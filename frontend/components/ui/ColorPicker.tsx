/**
 * 颜色选择器组件
 * 赛博朋克风格颜色选择器
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  showAlpha?: boolean;
  className?: string;
}

const DEFAULT_PRESET_COLORS = [
  '#00f0ff', // 霓虹青
  '#9d00ff', // 赛博紫
  '#ff0080', // 激光粉
  '#00ff88', // 赛博绿
  '#f0ff00', // 电压黄
  '#ff0000', // 红色
  '#00ff00', // 绿色
  '#0000ff', // 蓝色
  '#ffffff', // 白色
  '#000000', // 黑色
];

export function ColorPicker({
  value,
  onChange,
  presetColors = DEFAULT_PRESET_COLORS,
  showAlpha = false,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={pickerRef} className={cn('relative', className)}>
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-10 h-10 rounded-lg border-2 transition-all',
          'hover:scale-105 active:scale-95',
          'border-cyber-border hover:border-cyber-cyan'
        )}
        style={{ backgroundColor: value }}
      >
        <span className="sr-only">选择颜色</span>
      </button>

      {/* 颜色面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full mt-2 left-0 z-50',
              'bg-cyber-card border border-cyber-border rounded-lg',
              'p-3 shadow-xl min-w-[200px]'
            )}
          >
            {/* 当前颜色 */}
            <div className="mb-3">
              <label className="text-xs text-cyber-muted mb-2 block">
                当前颜色
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded border-2 border-cyber-border"
                  style={{ backgroundColor: value }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className={cn(
                    'flex-1 px-3 py-2 rounded bg-cyber-muted',
                    'border border-cyber-border text-sm',
                    'focus:outline-none focus:border-cyber-cyan'
                  )}
                />
              </div>
            </div>

            {/* 预设颜色 */}
            <div>
              <label className="text-xs text-cyber-muted mb-2 block">
                预设颜色
              </label>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-8 h-8 rounded transition-transform',
                      'hover:scale-110 active:scale-95',
                      'border-2 border-transparent',
                      'hover:border-cyber-cyan'
                    )}
                    style={{ backgroundColor: color }}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 颜色滑块
export interface ColorSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  color?: string;
  className?: string;
}

export function ColorSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  color = '#00f0ff',
  className,
}: ColorSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('relative w-full', className)}>
      <div className="h-2 bg-cyber-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
          'appearance-none'
        )}
      />
    </div>
  );
}

// 颜色输入组（RGB/HSL）
export interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  format?: 'hex' | 'rgb' | 'hsl';
  label?: string;
  className?: string;
}

export function ColorInput({
  value,
  onChange,
  format = 'hex',
  label,
  className,
}: ColorInputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="text-xs text-cyber-muted mb-2 block">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded border-2 border-cyber-border flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={format === 'hex' ? '#000000' : format}
          className={cn(
            'flex-1 px-3 py-2 rounded bg-cyber-muted',
            'border border-cyber-border text-sm',
            'focus:outline-none focus:border-cyber-cyan',
            'font-mono'
          )}
        />
      </div>
    </div>
  );
}

// 颜色对比度检查器
export interface ContrastCheckerProps {
  foreground: string;
  background: string;
}

export function ContrastChecker({ foreground, background }: ContrastCheckerProps) {
  // 计算相对亮度
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      val /= 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // 计算对比度
  const getContrastRatio = (fg: string, bg: string): number => {
    const lum1 = getLuminance(fg);
    const lum2 = getLuminance(bg);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const ratio = getContrastRatio(foreground, background);
  const wcagAA = ratio >= 4.5;
  const wcagAAA = ratio >= 7;

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex-1">
        <span className="text-cyber-muted">对比度: </span>
        <span className="font-mono">{ratio.toFixed(2)}:1</span>
      </div>
      <div
        className={cn(
          'px-2 py-1 rounded text-xs font-medium',
          wcagAAA
            ? 'bg-cyber-green text-cyber-dark'
            : wcagAA
            ? 'bg-cyber-yellow text-cyber-dark'
            : 'bg-cyber-pink text-white'
        )}
      >
        {wcagAAA ? 'AAA' : wcagAA ? 'AA' : 'Fail'}
      </div>
      <div
        className="w-20 h-8 rounded border border-cyber-border"
        style={{ backgroundColor: background, color: foreground }}
      >
        示例文本
      </div>
    </div>
  );
}

// HEX 转 RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
