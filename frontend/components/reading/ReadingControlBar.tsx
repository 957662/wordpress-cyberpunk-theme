'use client';

/**
 * ReadingControlBar - 响应式阅读控制栏
 * 提供阅读体验的各种控制选项
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  X,
  Type,
  Palette,
  Sun,
  Moon,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Minus,
  Plus,
  Eye,
  Bookmark,
  Share2,
  Printer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReadingSettings {
  fontSize: number; // 14-24
  lineHeight: number; // 1.4-2.0
  textAlign: 'left' | 'center' | 'justify';
  theme: 'light' | 'dark' | 'sepia' | 'cyber';
  fontFamily: 'sans' | 'serif' | 'mono';
  width: 'narrow' | 'medium' | 'wide';
}

export interface ReadingControlBarProps {
  settings?: ReadingSettings;
  onSettingsChange?: (settings: ReadingSettings) => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
  onToggleSpeech?: () => void;
  isSpeaking?: boolean;
  isBookmarked?: boolean;
  position?: 'bottom' | 'top';
  className?: string;
}

const defaultSettings: ReadingSettings = {
  fontSize: 16,
  lineHeight: 1.6,
  textAlign: 'left',
  theme: 'cyber',
  fontFamily: 'sans',
  width: 'medium',
};

const themeStyles = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-900',
    card: 'bg-gray-50',
    border: 'border-gray-200',
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    card: 'bg-gray-800',
    border: 'border-gray-700',
  },
  sepia: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    card: 'bg-amber-100',
    border: 'border-amber-200',
  },
  cyber: {
    bg: 'bg-cyber-dark',
    text: 'text-white',
    card: 'bg-cyber-muted',
    border: 'border-cyber-border',
  },
};

export function ReadingControlBar({
  settings = defaultSettings,
  onSettingsChange,
  onBookmark,
  onShare,
  onPrint,
  onToggleSpeech,
  isSpeaking = false,
  isBookmarked = false,
  position = 'bottom',
  className,
}: ReadingControlBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'display' | 'theme' | 'layout'>('display');

  // 更新设置
  const updateSetting = <K extends keyof ReadingSettings>(
    key: K,
    value: ReadingSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange?.(newSettings);
  };

  // 应用样式到文档
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--reading-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--reading-line-height', settings.lineHeight.toString());
    root.style.setProperty('--reading-text-align', settings.textAlign);
  }, [settings]);

  // 渲染显示设置
  const renderDisplaySettings = () => (
    <div className="space-y-4">
      {/* 字体大小 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <Type className="w-4 h-4" />
            字体大小
          </label>
          <span className="text-sm text-cyber-cyan font-medium">{settings.fontSize}px</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateSetting('fontSize', Math.max(14, settings.fontSize - 2))}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            disabled={settings.fontSize <= 14}
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              animate={{ width: `${((settings.fontSize - 14) / 10) * 100}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <button
            onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            disabled={settings.fontSize >= 24}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 行高 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">行高</label>
          <span className="text-sm text-cyber-cyan font-medium">{settings.lineHeight}</span>
        </div>
        <input
          type="range"
          min="1.4"
          max="2.0"
          step="0.1"
          value={settings.lineHeight}
          onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyber-cyan"
        />
      </div>

      {/* 字体 */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">字体系列</label>
        <div className="grid grid-cols-3 gap-2">
          {(['sans', 'serif', 'mono'] as const).map((font) => (
            <button
              key={font}
              onClick={() => updateSetting('fontFamily', font)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all text-sm',
                settings.fontFamily === font
                  ? 'border-cyber-cyan bg-cyber-cyan/20 text-white'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
              )}
              style={{
                fontFamily: font === 'sans' ? 'system-ui, sans-serif' :
                           font === 'serif' ? 'Georgia, serif' :
                           'monospace'
              }}
            >
              {font === 'sans' ? '无衬' : font === 'serif' ? '衬线' : '等宽'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染主题设置
  const renderThemeSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-400 mb-3 block flex items-center gap-2">
          <Palette className="w-4 h-4" />
          阅读主题
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(themeStyles) as const).map((theme) => {
            const config = themeStyles[theme];
            const icons = {
              light: <Sun className="w-4 h-4" />,
              dark: <Moon className="w-4 h-4" />,
              sepia: <Eye className="w-4 h-4" />,
              cyber: <Type className="w-4 h-4" />,
            };

            return (
              <button
                key={theme}
                onClick={() => updateSetting('theme', theme)}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border-2 transition-all',
                  settings.theme === theme
                    ? 'border-cyber-cyan bg-cyber-cyan/20 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                )}
              >
                {icons[theme]}
                <span className="capitalize">{theme}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 渲染布局设置
  const renderLayoutSettings = () => (
    <div className="space-y-4">
      {/* 对齐方式 */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">文本对齐</label>
        <div className="grid grid-cols-3 gap-2">
          {(['left', 'center', 'justify'] as const).map((align) => {
            const icons = {
              left: <AlignLeft className="w-4 h-4" />,
              center: <AlignCenter className="w-4 h-4" />,
              justify: <AlignJustify className="w-4 h-4" />,
            };

            return (
              <button
                key={align}
                onClick={() => updateSetting('textAlign', align)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all flex justify-center',
                  settings.textAlign === align
                    ? 'border-cyber-cyan bg-cyber-cyan/20 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                )}
              >
                {icons[align]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 内容宽度 */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">内容宽度</label>
        <div className="grid grid-cols-3 gap-2">
          {(['narrow', 'medium', 'wide'] as const).map((width) => (
            <button
              key={width}
              onClick={() => updateSetting('width', width)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all text-sm',
                settings.width === width
                  ? 'border-cyber-cyan bg-cyber-cyan/20 text-white'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
              )}
            >
              {width === 'narrow' ? '窄' : width === 'medium' ? '中' : '宽'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染快捷操作
  const renderQuickActions = () => (
    <div className="flex items-center gap-2">
      {onToggleSpeech && (
        <motion.button
          onClick={onToggleSpeech}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isSpeaking
              ? 'bg-cyber-pink hover:bg-cyber-pink/80 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isSpeaking ? '暂停朗读' : '开始朗读'}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      )}

      {onBookmark && (
        <motion.button
          onClick={onBookmark}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isBookmarked
              ? 'bg-cyber-yellow hover:bg-cyber-yellow/80 text-gray-900'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="收藏"
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </motion.button>
      )}

      {onShare && (
        <motion.button
          onClick={onShare}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="分享"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      )}

      {onPrint && (
        <motion.button
          onClick={onPrint}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="打印"
        >
          <Printer className="w-5 h-5" />
        </motion.button>
      )}

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2 rounded-lg transition-colors',
          isOpen
            ? 'bg-cyber-cyan hover:bg-cyber-cyan/80 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="阅读设置"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </motion.button>
    </div>
  );

  return (
    <div className={cn('fixed left-0 right-0 z-40', position === 'bottom' ? 'bottom-0' : 'top-0', className)}>
      {/* 控制栏 */}
      <motion.div
        initial={{ y: position === 'bottom' ? 100 : -100 }}
        animate={{ y: 0 }}
        className="cyber-card border-t border-cyber-border bg-cyber-dark/95 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* 快捷操作栏 */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              <span>阅读模式</span>
            </div>

            {renderQuickActions()}
          </div>

          {/* 设置面板 */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-cyber-border overflow-hidden"
              >
                <div className="py-4">
                  {/* 标签切换 */}
                  <div className="flex gap-2 mb-4">
                    {([
                      { key: 'display' as const, label: '显示', icon: Type },
                      { key: 'theme' as const, label: '主题', icon: Palette },
                      { key: 'layout' as const, label: '布局', icon: Settings },
                    ]).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                          activeTab === tab.key
                            ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                            : 'bg-gray-800/50 text-gray-400 hover:text-white border border-transparent'
                        )}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* 设置内容 */}
                  <div className="max-h-[60vh] overflow-y-auto">
                    {activeTab === 'display' && renderDisplaySettings()}
                    {activeTab === 'theme' && renderThemeSettings()}
                    {activeTab === 'layout' && renderLayoutSettings()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default ReadingControlBar;
