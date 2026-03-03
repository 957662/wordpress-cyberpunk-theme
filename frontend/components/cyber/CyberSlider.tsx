'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeComplete?: (value: number) => void;
  disabled?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showTooltip?: boolean;
  marks?: { value: number; label: string }[];
  formatValue?: (value: number) => string;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const colorClasses = {
  cyan: {
    track: 'bg-cyan-500/20',
    fill: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    thumb: 'bg-cyan-400 shadow-cyan-500/50',
    tooltip: 'bg-cyan-500 text-cyan-950'
  },
  purple: {
    track: 'bg-purple-500/20',
    fill: 'bg-gradient-to-r from-purple-400 to-pink-500',
    thumb: 'bg-purple-400 shadow-purple-500/50',
    tooltip: 'bg-purple-500 text-purple-950'
  },
  pink: {
    track: 'bg-pink-500/20',
    fill: 'bg-gradient-to-r from-pink-400 to-rose-500',
    thumb: 'bg-pink-400 shadow-pink-500/50',
    tooltip: 'bg-pink-500 text-pink-950'
  },
  green: {
    track: 'bg-green-500/20',
    fill: 'bg-gradient-to-r from-green-400 to-emerald-500',
    thumb: 'bg-green-400 shadow-green-500/50',
    tooltip: 'bg-green-500 text-green-950'
  },
  yellow: {
    track: 'bg-yellow-500/20',
    fill: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    thumb: 'bg-yellow-400 shadow-yellow-500/50',
    tooltip: 'bg-yellow-500 text-yellow-950'
  }
};

const sizeClasses = {
  sm: { height: 'h-1.5', thumb: 'w-4 h-4', tooltip: 'text-xs px-2 py-1' },
  md: { height: 'h-2', thumb: 'w-5 h-5', tooltip: 'text-sm px-2.5 py-1' },
  lg: { height: 'h-3', thumb: 'w-6 h-6', tooltip: 'text-base px-3 py-1.5' }
};

export const CyberSlider: React.FC<CyberSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = min,
  onChange,
  onChangeComplete,
  disabled = false,
  color = 'cyan',
  size = 'md',
  showValue = true,
  showTooltip = true,
  marks,
  formatValue,
  suffix,
  prefix,
  className
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltipValue, setShowTooltipValue] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const colors = colorClasses[color];
  const sizeClass = sizeClasses[size];

  // 计算百分比
  const percentage = useMemo(() => {
    const range = max - min;
    return ((value - min) / range) * 100;
  }, [value, min, max]);

  // 格式化显示值
  const displayValue = useMemo(() => {
    const formatted = formatValue ? formatValue(value) : value.toFixed(step < 1 ? 2 : 0);
    return `${prefix || ''}${formatted}${suffix || ''}`;
  }, [value, formatValue, step, prefix, suffix]);

  // 处理值变化
  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const rawValue = percentage * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    setInternalValue(clampedValue);
    onChange?.(clampedValue);
  }, [min, max, step, disabled, onChange]);

  // 处理鼠标/触摸事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    setShowTooltipValue(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setShowTooltipValue(false), 1000);
      onChangeComplete?.(value);
    }
  }, [isDragging, value, onChangeComplete]);

  // 注册全局事件监听
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = value;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, value - step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }

    e.preventDefault();
    setInternalValue(newValue);
    onChange?.(newValue);
    onChangeComplete?.(newValue);
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* 滑块容器 */}
      <div
        ref={trackRef}
        className={cn(
          'relative rounded-full cursor-pointer select-none',
          'transition-opacity duration-200',
          disabled && 'opacity-50 cursor-not-allowed',
          sizeClass.height
        )}
        onMouseDown={handleMouseDown}
        role="presentation"
      >
        {/* 轨道背景 */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            colors.track
          )}
        />

        {/* 填充进度 */}
        <motion.div
          className={cn(
            'absolute left-0 top-0 bottom-0 rounded-full',
            colors.fill
          )}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* 刻度标记 */}
        {marks && marks.map((mark, index) => {
          const markPercentage = ((mark.value - min) / (max - min)) * 100;
          return (
            <div
              key={index}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-0.5 rounded-full',
                'bg-gray-600',
                mark.value <= value && colors.thumb.replace('bg-', 'bg-').replace('/50', '')
              )}
              style={{ left: `${markPercentage}%` }}
            >
              <span className={cn(
                'absolute top-full mt-2 left-1/2 -translate-x-1/2',
                'text-xs text-gray-500 whitespace-nowrap'
              )}>
                {mark.label}
              </span>
            </div>
          );
        })}

        {/* 滑块按钮 */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full shadow-lg',
            'cursor-grab active:cursor-grabbing',
            'border-2 border-white',
            colors.thumb,
            sizeClass.thumb
          )}
          style={{ left: `${percentage}%`, marginLeft: `-${parseInt(sizeClass.thumb.split('-')[1]) / 2}px` }}
          initial={false}
          animate={{
            scale: isDragging ? 1.2 : 1,
            boxShadow: isDragging ? `0 0 20px ${color === 'cyan' ? '#06b6d4' : color === 'purple' ? '#a855f7' : '#ec4899'}` : 'none'
          }}
          transition={{ duration: 0.15 }}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Tooltip */}
      {(showTooltip && showTooltipValue) && (
        <motion.div
          className={cn(
            'absolute top-full left-1/2 -translate-x-1/2 mt-2',
            'px-2 py-1 rounded-lg font-medium',
            'shadow-lg whitespace-nowrap',
            'pointer-events-none z-10',
            colors.tooltip,
            sizeClass.tooltip
          )}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {displayValue}
          {/* 小三角 */}
          <div className={cn(
            'absolute bottom-full left-1/2 -translate-x-1/2',
            'w-0 h-0 border-l-4 border-l-transparent',
            'border-r-4 border-r-transparent',
            color === 'cyan' && 'border-b-4 border-b-cyan-500',
            color === 'purple' && 'border-b-4 border-b-purple-500',
            color === 'pink' && 'border-b-4 border-b-pink-500',
            color === 'green' && 'border-b-4 border-b-green-500',
            color === 'yellow' && 'border-b-4 border-b-yellow-500'
          )} />
        </motion.div>
      )}

      {/* 数值显示 */}
      {showValue && !showTooltip && (
        <div className={cn(
          'mt-3 text-sm font-medium text-center',
          colors.thumb.replace('shadow-', 'text-').replace('/50', '')
        )}>
          {displayValue}
        </div>
      )}
    </div>
  );
};

export default CyberSlider;
