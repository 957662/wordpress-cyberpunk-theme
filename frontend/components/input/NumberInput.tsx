'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
  prefix?: string;
  suffix?: string;
}

const sizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2',
  lg: 'px-4 py-3 text-lg',
};

/**
 * NumberInput - 数字输入组件
 * 带有增减控制和格式化
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision = 0,
  className,
  disabled = false,
  size = 'md',
  showControls = true,
  prefix,
  suffix,
}) => {
  const [inputValue, setInputValue] = useState(value.toFixed(precision));

  const formatValue = (val: number) => {
    return val.toFixed(precision);
  };

  const parseValue = (str: string): number => {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  const handleChange = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
    setInputValue(formatValue(clampedValue));
  };

  const handleIncrement = () => {
    handleChange(value + step);
  };

  const handleDecrement = () => {
    handleChange(value - step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseValue(e.target.value);
    setInputValue(e.target.value);

    if (!isNaN(newValue)) {
      handleChange(newValue);
    }
  };

  const handleBlur = () => {
    setInputValue(formatValue(value));
  };

  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div className={cn('flex items-center', className)}>
      {showControls && (
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || !canDecrement}
          className={cn(
            'px-3 py-2 bg-gray-900 border border-r-0 border-gray-800 rounded-l-lg',
            'text-gray-400 hover:text-white hover:bg-gray-800',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors'
          )}
        >
          <Minus className="w-4 h-4" />
        </button>
      )}

      <div className="relative flex-1">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={cn(
            'w-full bg-gray-900 border border-gray-800 text-center',
            'text-gray-100 placeholder-gray-500',
            'focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all',
            sizeClasses[size],
            showControls ? 'rounded-none' : 'rounded-lg',
            prefix && 'pl-8',
            suffix && 'pr-8'
          )}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>

      {showControls && (
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || !canIncrement}
          className={cn(
            'px-3 py-2 bg-gray-900 border border-l-0 border-gray-800 rounded-r-lg',
            'text-gray-400 hover:text-white hover:bg-gray-800',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors'
          )}
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default NumberInput;
