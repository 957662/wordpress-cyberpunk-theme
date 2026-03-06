'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Monitor, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';

interface ThemeSettingsProps {
  onSave?: (theme: string) => Promise<void>;
  className?: string;
}

/**
 * 主题设置组件
 * 允许用户自定义界面主题和外观
 */
export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  onSave,
  className
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState('#00f0ff');
  const [fontSize, setFontSize] = useState('16');
  const [borderRadius, setBorderRadius] = useState('8');
  const [isLoading, setIsLoading] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  const colorPresets = [
    { name: 'Cyber Cyan', value: '#00f0ff' },
    { name: 'Neon Pink', value: '#ff0080' },
    { name: 'Cyber Purple', value: '#9d00ff' },
    { name: 'Cyber Green', value: '#00ff88' },
    { name: 'Voltage Yellow', value: '#f0ff00' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const settings = {
        theme,
        primaryColor,
        fontSize,
        borderRadius
      };
      await onSave?.(JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save theme settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('theme-settings', className)}>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-cyber-cyan" />
          <h3 className="text-lg font-semibold text-white">Theme Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Theme Mode */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    theme === value
                      ? 'border-cyber-cyan bg-cyber-cyan/10'
                      : 'border-cyber-cyan/20 bg-cyber-muted/30 hover:border-cyber-cyan/50'
                  )}
                >
                  <Icon className={cn(
                    'w-6 h-6',
                    theme === value ? 'text-cyber-cyan' : 'text-cyber-cyan/60'
                  )} />
                  <span className={cn(
                    'text-sm font-medium',
                    theme === value ? 'text-cyber-cyan' : 'text-cyber-cyan/80'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Primary Color
            </label>
            <div className="space-y-3">
              {/* Color Presets */}
              <div className="flex flex-wrap gap-2">
                {colorPresets.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setPrimaryColor(color.value)}
                    className={cn(
                      'w-10 h-10 rounded-lg border-2 transition-all',
                      primaryColor === color.value
                        ? 'border-white scale-110'
                        : 'border-cyber-cyan/30 hover:border-cyber-cyan/60'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Custom Color Picker */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#00f0ff"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Font Size
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="12"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-cyber-cyan/60">
                <span>12px</span>
                <span className="text-cyber-cyan font-medium">{fontSize}px</span>
                <span>20px</span>
              </div>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Border Radius
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="16"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-cyber-cyan/60">
                <span>Sharp</span>
                <span className="text-cyber-cyan font-medium">{borderRadius}px</span>
                <span>Rounded</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-cyber-cyan/80 mb-3">
              Preview
            </label>
            <Card className="p-4" style={{
              fontSize: `${fontSize}px`,
              borderRadius: `${borderRadius}px`
            }}>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="sm"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#0a0a0f'
                  }}
                >
                  Primary Button
                </Button>
                <p className="text-cyber-cyan/80">
                  This is how your content will look with the selected theme settings.
                </p>
              </div>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-cyber-cyan/20">
            <Button
              onClick={handleSave}
              variant="primary"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Theme
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThemeSettings;
