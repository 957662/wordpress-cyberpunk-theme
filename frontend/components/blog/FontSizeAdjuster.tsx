'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface FontSizeAdjusterProps {
  /**
   * 最小字体大小（像素）
   * @default 14
   */
  minSize?: number;

  /**
   * 最大字体大小（像素）
   * @default 24
   */
  maxSize?: number;

  /**
   * 默认字体大小（像素）
   * @default 16
   */
  defaultSize?: number;

  /**
   * 字体大小变化步长（像素）
   * @default 2
   */
  step?: number;

  /**
   * 存储键名（用于 localStorage）
   * @default 'cyberpress-font-size'
   */
  storageKey?: string;

  /**
   * 是否显示为浮动按钮
   * @default false
   */
  floating?: boolean;

  /**
   * 自定义样式类名
   */
  className?: string;
}

/**
 * 字体大小调整器组件
 *
 * 允许用户调整页面内容的字体大小，并保存到 localStorage。
 * 支持浮动按钮和内联两种显示方式。
 *
 * @example
 * ```tsx
 * <FontSizeAdjuster />
 * <FontSizeAdjuster floating />
 * <FontSizeAdjuster minSize={12} maxSize={28} step={2} />
 * ```
 */
export function FontSizeAdjuster({
  minSize = 14,
  maxSize = 24,
  defaultSize = 16,
  step = 2,
  storageKey = 'cyberpress-font-size',
  floating = false,
  className = '',
}: FontSizeAdjusterProps) {
  const [fontSize, setFontSize] = useState(defaultSize);
  const [isOpen, setIsOpen] = useState(false);

  // 从 localStorage 加载保存的字体大小
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const size = parseInt(saved, 10);
        if (size >= minSize && size <= maxSize) {
          setFontSize(size);
        }
      }
    } catch (error) {
      console.warn('Failed to load font size from localStorage:', error);
    }
  }, [storageKey, minSize, maxSize]);

  // 应用字体大小到页面内容
  useEffect(() => {
    const articleContent = document.querySelector('[data-article-content]');
    if (articleContent) {
      (articleContent as HTMLElement).style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  // 保存字体大小到 localStorage
  const saveFontSize = (size: number) => {
    try {
      localStorage.setItem(storageKey, size.toString());
    } catch (error) {
      console.warn('Failed to save font size to localStorage:', error);
    }
  };

  // 增加字体大小
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + step, maxSize);
    setFontSize(newSize);
    saveFontSize(newSize);
  };

  // 减少字体大小
  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - step, minSize);
    setFontSize(newSize);
    saveFontSize(newSize);
  };

  // 重置字体大小
  const resetFontSize = () => {
    setFontSize(defaultSize);
    saveFontSize(defaultSize);
  };

  // 浮动按钮样式
  if (floating) {
    return (
      <div className={`fixed bottom-24 right-8 z-40 ${className}`}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="mb-3 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg overflow-hidden"
            >
              <div className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={decreaseFontSize}
                    disabled={fontSize <= minSize}
                    className="p-2 rounded-lg bg-cyber-muted hover:bg-cyber-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="减小字体"
                  >
                    <Minus className="w-4 h-4 text-cyber-cyan" />
                  </button>

                  <div className="flex-1 text-center">
                    <span className="text-cyber-cyan font-mono font-bold">
                      {fontSize}px
                    </span>
                  </div>

                  <button
                    onClick={increaseFontSize}
                    disabled={fontSize >= maxSize}
                    className="p-2 rounded-lg bg-cyber-muted hover:bg-cyber-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="增大字体"
                  >
                    <Plus className="w-4 h-4 text-cyber-cyan" />
                  </button>
                </div>

                <button
                  onClick={resetFontSize}
                  disabled={fontSize === defaultSize}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  重置
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 rounded-lg transition-all hover:scale-110 active:scale-95"
          whileHover={{ boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}
          aria-label="调整字体大小"
        >
          <span className="text-cyber-cyan font-bold text-lg">A</span>
        </motion.button>
      </div>
    );
  }

  // 内联样式
  return (
    <div
      className={`flex items-center gap-2 bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg px-3 py-2 ${className}`}
    >
      <span className="text-gray-400 text-sm">字体大小:</span>

      <div className="flex items-center gap-1">
        <button
          onClick={decreaseFontSize}
          disabled={fontSize <= minSize}
          className="p-1.5 rounded hover:bg-cyber-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="减小字体"
        >
          <Minus className="w-4 h-4 text-cyber-cyan" />
        </button>

        <span className="mx-2 text-cyber-cyan font-mono font-bold min-w-[3rem] text-center">
          {fontSize}px
        </span>

        <button
          onClick={increaseFontSize}
          disabled={fontSize >= maxSize}
          className="p-1.5 rounded hover:bg-cyber-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="增大字体"
        >
          <Plus className="w-4 h-4 text-cyber-cyan" />
        </button>
      </div>

      <button
        onClick={resetFontSize}
        disabled={fontSize === defaultSize}
        className="p-1.5 rounded hover:bg-cyber-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="重置字体大小"
      >
        <RotateCcw className="w-4 h-4 text-cyber-purple" />
      </button>
    </div>
  );
}

/**
 * 字体大小预设选择器
 */
interface FontSizePresetProps {
  /**
   * 字体大小预设选项
   */
  presets?: Array<{ label: string; size: number }>;

  /**
   * 默认选中项
   * @default 2
   */
  defaultIndex?: number;

  /**
   * 存储键名
   * @default 'cyberpress-font-preset'
   */
  storageKey?: string;

  /**
   * 自定义样式类名
   */
  className?: string;
}

export function FontSizePreset({
  presets = [
    { label: '小', size: 14 },
    { label: '中', size: 16 },
    { label: '大', size: 18 },
    { label: '特大', size: 20 },
  ],
  defaultIndex = 1,
  storageKey = 'cyberpress-font-preset',
  className = '',
}: FontSizePresetProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const index = parseInt(saved, 10);
        if (index >= 0 && index < presets.length) {
          setSelectedIndex(index);
          applyFontSize(presets[index].size);
        }
      }
    } catch (error) {
      console.warn('Failed to load font preset from localStorage:', error);
    }
  }, [storageKey, presets]);

  const applyFontSize = (size: number) => {
    const articleContent = document.querySelector('[data-article-content]');
    if (articleContent) {
      (articleContent as HTMLElement).style.fontSize = `${size}px`;
    }
  };

  const selectPreset = (index: number) => {
    setSelectedIndex(index);
    applyFontSize(presets[index].size);

    try {
      localStorage.setItem(storageKey, index.toString());
    } catch (error) {
      console.warn('Failed to save font preset to localStorage:', error);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-gray-400 text-sm">字体:</span>
      <div className="flex gap-1 bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg p-1">
        {presets.map((preset, index) => (
          <button
            key={preset.label}
            onClick={() => selectPreset(index)}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedIndex === index
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold shadow-lg shadow-cyber-cyan/20'
                : 'text-gray-400 hover:text-white hover:bg-cyber-muted/50'
            }`}
            aria-label={`选择${preset.label}号字体`}
            aria-pressed={selectedIndex === index}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
