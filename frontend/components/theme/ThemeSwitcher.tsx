/**
 * 主题切换组件
 * 支持明暗主题切换和自定义主题色
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useThemeStore } from '@/store/themeStore';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';

export interface ThemeSwitcherProps {
  showLabel?: boolean;
  variant?: 'dropdown' | 'popover' | 'toggle';
}

const accentColors: AccentColor[] = ['cyan', 'purple', 'pink', 'yellow', 'green', 'orange'];

const colorNames: Record<AccentColor, string> = {
  cyan: '赛博蓝',
  purple: '霓虹紫',
  pink: '电子粉',
  yellow: '数据黄',
  green: '矩阵绿',
  orange: '火焰橙',
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  showLabel = false,
  variant = 'dropdown',
}) => {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('cyan');

  // 获取系统主题
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 应用主题到文档
  useEffect(() => {
    const root = document.documentElement;

    // 应用主题模式
    const effectiveMode = mode === 'system' ? systemTheme : mode;
    if (effectiveMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // 应用主题色
    root.style.setProperty('--accent-color', `var(--cyber-${accentColor})`);
  }, [mode, systemTheme, accentColor]);

  // 切换主题模式
  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // 切换强调色
  const handleAccentColorChange = (color: AccentColor) => {
    setAccentColor(color);
  };

  if (variant === 'toggle') {
    return (
      <Button
        onClick={toggleTheme}
        variant="ghost"
        size="sm"
        className="relative"
      >
        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        {showLabel && <span className="ml-2">切换主题</span>}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
      >
        <Palette className="w-5 h-5" />
        {showLabel && <span>主题</span>}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 下拉面板 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 w-80"
            >
              <Card className="p-6 border-cyber-cyan/20 bg-cyber-dark/95 backdrop-blur-xl">
                <h3 className="text-lg font-semibold mb-4">主题设置</h3>

                {/* 主题模式 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    主题模式
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleModeChange('light')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        mode === 'light'
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                          : 'bg-cyber-dark/50 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span className="text-xs">亮色</span>
                    </button>
                    <button
                      onClick={() => handleModeChange('dark')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        mode === 'dark'
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                          : 'bg-cyber-dark/50 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      <span className="text-xs">暗色</span>
                    </button>
                    <button
                      onClick={() => handleModeChange('system')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        mode === 'system'
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                          : 'bg-cyber-dark/50 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Monitor className="w-5 h-5" />
                      <span className="text-xs">跟随系统</span>
                    </button>
                  </div>
                </div>

                {/* 强调色 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    主题色
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleAccentColorChange(color)}
                        className="relative w-12 h-12 rounded-lg border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: `var(--cyber-${color})`,
                          borderColor:
                            accentColor === color
                              ? `var(--cyber-${color})`
                              : 'transparent',
                        }}
                        title={colorNames[color]}
                      >
                        {accentColor === color && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Check className="w-6 h-6 text-white" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {colorNames[accentColor]}
                  </p>
                </div>

                {/* 预设主题 */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    快速预设
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setMode('dark');
                        setAccentColor('cyan');
                      }}
                      className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all"
                    >
                      赛博朋克
                    </button>
                    <button
                      onClick={() => {
                        setMode('dark');
                        setAccentColor('green');
                      }}
                      className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-green-500/20 to-green-700/20 border border-green-500/30 hover:border-green-500/60 transition-all"
                    >
                      矩阵
                    </button>
                    <button
                      onClick={() => {
                        setMode('light');
                        setAccentColor('purple');
                      }}
                      className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-700/20 border border-purple-500/30 hover:border-purple-500/60 transition-all"
                    >
                      霓虹
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
