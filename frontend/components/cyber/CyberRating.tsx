'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberRatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  count?: number;
  readonly?: boolean;
  disabled?: boolean;
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'orange';
  allowHalf?: boolean;
  showValue?: boolean;
  precision?: number;
  className?: string;
}

const colorClasses = {
  cyan: 'text-cyan-400 hover:text-cyan-300',
  purple: 'text-purple-400 hover:text-purple-300',
  pink: 'text-pink-400 hover:text-pink-300',
  green: 'text-green-400 hover:text-green-300',
  yellow: 'text-yellow-400 hover:text-yellow-300',
  orange: 'text-orange-400 hover:text-orange-300'
};

const emptyColorClass = 'text-gray-600';

export const CyberRating: React.FC<CyberRatingProps> = ({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  count = 5,
  readonly = false,
  disabled = false,
  size = 24,
  color = 'yellow',
  allowHalf = true,
  showValue = false,
  precision = 1,
  className
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState(0);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const colorClass = colorClasses[color];

  // 处理鼠标移入
  const handleMouseEnter = useCallback((index: number) => {
    if (readonly || disabled) return;
    setHoverValue(index + 1);
  }, [readonly, disabled]);

  // 处理鼠标移出
  const handleMouseLeave = useCallback(() => {
    if (readonly || disabled) return;
    setHoverValue(0);
  }, [readonly, disabled]);

  // 处理点击
  const handleClick = useCallback((index: number) => {
    if (readonly || disabled) return;

    const newValue = index + 1;
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [readonly, disabled, onChange]);

  // 处理半星点击
  const handleHalfClick = useCallback((index: number, event: React.MouseEvent) => {
    if (readonly || disabled || !allowHalf) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isHalf = x < rect.width / 2;

    const newValue = index + (isHalf ? 0.5 : 1);
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [readonly, disabled, allowHalf, onChange]);

  // 渲染星星
  const renderStars = useMemo(() => {
    const stars = [];
    const displayValue = hoverValue || value;

    for (let i = 0; i < count; i++) {
      const starValue = i + 1;
      const isFilled = starValue <= displayValue;
      const isHalf = allowHalf && displayValue >= i + 0.5 && displayValue < starValue;
      const isEmpty = !isFilled && !isHalf;

      const starContent = (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <defs>
            <linearGradient id={`half-gradient-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={isHalf ? `url(#half-gradient-${i})` : 'currentColor'}
            className={cn(
              'transition-all duration-200',
              isFilled ? colorClass : isEmpty ? emptyColorClass : colorClass
            )}
          />
        </svg>
      );

      stars.push(
        <motion.button
          key={i}
          type="button"
          disabled={readonly || disabled}
          onClick={(e) => allowHalf ? handleHalfClick(i, e) : handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          className={cn(
            'relative focus:outline-none transition-transform duration-150',
            !readonly && !disabled && 'cursor-pointer hover:scale-110',
            (readonly || disabled) && 'cursor-default'
          )}
          style={{ width: size, height: size }}
          whileHover={{ scale: readonly || disabled ? 1 : 1.1 }}
          whileTap={{ scale: readonly || disabled ? 1 : 0.95 }}
        >
          {starContent}
        </motion.button>
      );
    }

    return stars;
  }, [
    count,
    value,
    hoverValue,
    size,
    colorClass,
    allowHalf,
    readonly,
    disabled,
    handleClick,
    handleHalfClick,
    handleMouseEnter
  ]);

  // 格式化显示值
  const formattedValue = useMemo(() => {
    return Number(value.toFixed(precision));
  }, [value, precision]);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-0.5">
        {renderStars}
      </div>

      {showValue && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'ml-2 font-medium tabular-nums',
            colorClass
          )}
          style={{ fontSize: size * 0.75 }}
        >
          {formattedValue}
        </motion.span>
      )}
    </div>
  );
};

export default CyberRating;
