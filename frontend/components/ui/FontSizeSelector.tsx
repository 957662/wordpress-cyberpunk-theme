'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Minus, Plus, RotateCcw } from 'lucide-react';

export interface FontSizeSelectorProps {
  /** 最小字体大小 */
  min?: number;
  /** 最大字体大小 */
  max?: number;
  /** 默认字体大小 */
  defaultSize?: number;
  /** 步进值 */
  step?: number;
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 自定义类名 */
  className?: string;
  /** 字体大小变化回调 */
  onFontSizeChange?: (size: number) => void;
  /** 存储键名 */
  storageKey?: string;
  /** 是否显示当前大小 */
  showCurrentSize?: boolean;
  /** 是否应用到根元素 */
  applyToRoot?: boolean;
  /** 目标选择器 */
  targetSelector?: string;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
  min = 12,
  max = 24,
  defaultSize = 16,
  step = 1,
  size = 'md',
  variant = 'primary',
  className = '',
  onFontSizeChange,
  storageKey = 'cyberpress-font-size',
  showCurrentSize = true,
  applyToRoot = true,
  targetSelector,
}) => {
  const [currentSize, setCurrentSize] = useState(defaultSize);
  const [isOpen, setIsOpen] = useState(false);

  // 从 localStorage 加载字体大小
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const size = parseInt(stored, 10);
        if (!isNaN(size) && size >= min && size <= max) {
          setCurrentSize(size);
        }
      }
    } catch (error) {
      console.error('Failed to load font size:', error);
    }
  }, [storageKey, min, max]);

  // 应用字体大小到目标元素
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const target = targetSelector
      ? document.querySelector(targetSelector)
      : document.documentElement;

    if (target) {
      target.style.fontSize = `${currentSize}px`;
    }
  }, [currentSize, targetSelector, applyToRoot]);

  const handleDecrease = () => {
    const newSize = Math.max(min, currentSize - step);
    if (newSize !== currentSize) {
      setCurrentSize(newSize);
      saveFontSize(newSize);
    }
  };

  const handleIncrease = () => {
    const newSize = Math.min(max, currentSize + step);
    if (newSize !== currentSize) {
      setCurrentSize(newSize);
      saveFontSize(newSize);
    }
  };

  const handleReset = () => {
    setCurrentSize(defaultSize);
    saveFontSize(defaultSize);
  };

  const saveFontSize = (size: number) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, size.toString());
    } catch (error) {
      console.error('Failed to save font size:', error);
    }
    onFontSizeChange?.(size);
  };

  const canDecrease = currentSize > min;
  const canIncrease = currentSize < max;
  const isDefault = currentSize === defaultSize;

  const variantStyles = {
    primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-purple hover:text-white',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-pink',
    ghost: 'bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark',
  };

  return (
    <div className={`relative ${className}`}>
      {/* 主按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-lg font-medium
          transition-all duration-300
          ${sizeStyles[size]}
          ${variantStyles[variant]}
        `}
      >
        <Type size={iconSizes[size]} />
        {showCurrentSize && (
          <span className="font-mono">{currentSize}px</span>
        )}
      </motion.button>

      {/* 控制面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 面板 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-50 w-64"
            >
              <div className="bg-cyber-card border border-cyber-border rounded-lg overflow-hidden shadow-xl">
                {/* 标题 */}
                <div className="px-4 py-3 border-b border-cyber-border">
                  <h3 className="font-semibold text-cyber-cyan">字体大小</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    调整页面文字大小以适应您的阅读需求
                  </p>
                </div>

                {/* 滑块 */}
                <div className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDecrease}
                      disabled={!canDecrease}
                      className={`
                        p-2 rounded-lg border transition-all
                        ${canDecrease
                          ? 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
                          : 'border-cyber-border text-gray-600 cursor-not-allowed opacity-50'
                        }
                      `}
                      aria-label="Decrease font size"
                    >
                      <Minus size={18} />
                    </motion.button>

                    <div className="flex-1 text-center">
                      <span className="text-2xl font-mono font-bold text-cyber-cyan">
                        {currentSize}
                      </span>
                      <span className="text-sm text-gray-400 ml-1">px</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleIncrease}
                      disabled={!canIncrease}
                      className={`
                        p-2 rounded-lg border transition-all
                        ${canIncrease
                          ? 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
                          : 'border-cyber-border text-gray-600 cursor-not-allowed opacity-50'
                        }
                      `}
                      aria-label="Increase font size"
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>

                  {/* 进度条 */}
                  <div className="mt-4 relative h-2 bg-cyber-darker rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                      initial={false}
                      animate={{
                        width: `${((currentSize - min) / (max - min)) * 100}%`,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  {/* 范围标签 */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{min}px</span>
                    <span>{max}px</span>
                  </div>
                </div>

                {/* 预览文本 */}
                <div className="px-4 py-3 border-t border-cyber-border">
                  <p className="text-gray-400 text-sm mb-2">预览</p>
                  <p
                    className="text-gray-200"
                    style={{ fontSize: `${currentSize}px` }}
                  >
                    这是预览文本，您可以看到当前字体大小对阅读的影响。
                  </p>
                </div>

                {/* 底部操作 */}
                <div className="px-4 py-3 border-t border-cyber-border">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    disabled={isDefault}
                    className={`
                      w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-all
                      ${isDefault
                        ? 'bg-cyber-muted text-gray-500 cursor-not-allowed'
                        : 'bg-cyber-muted text-gray-300 hover:bg-cyber-border hover:text-white'
                      }
                    `}
                  >
                    <RotateCcw size={16} />
                    重置为默认大小
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/** 快速字体大小切换按钮组 */
export const FontSizeQuickSelector: React.FC<Omit<FontSizeSelectorProps, 'showCurrentSize'>> = (props) => {
  const { min = 12, max = 24, defaultSize = 16, step = 2, ...rest } = props;
  const [currentSize, setCurrentSize] = useState(defaultSize);

  const sizes = [];
  for (let size = min; size <= max; size += step) {
    sizes.push(size);
  }

  const handleSizeChange = (size: number) => {
    setCurrentSize(size);
    props.onFontSizeChange?.(size);

    if (typeof window !== 'undefined' && props.applyToRoot !== false) {
      const target = props.targetSelector
        ? document.querySelector(props.targetSelector)
        : document.documentElement;

      if (target) {
        target.style.fontSize = `${size}px`;
      }
    }

    try {
      localStorage.setItem(props.storageKey || 'cyberpress-font-size', size.toString());
    } catch (error) {
      console.error('Failed to save font size:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Type size={18} className="text-gray-400" />
      {sizes.map((size) => (
        <motion.button
          key={size}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSizeChange(size)}
          className={`
            px-3 py-1 rounded-lg text-sm font-medium transition-all
            ${currentSize === size
              ? 'bg-cyber-cyan text-cyber-dark shadow-lg shadow-cyber-cyan/30'
              : 'bg-cyber-muted text-gray-400 hover:bg-cyber-border hover:text-white'
            }
          `}
        >
          A{size}
        </motion.button>
      ))}
    </div>
  );
};

export default FontSizeSelector;
