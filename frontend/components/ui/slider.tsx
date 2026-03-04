'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/clsx';
import { useState, useCallback } from 'react';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'cyan' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showValue?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 50,
  onChange,
  variant = 'default',
  glowColor = 'cyan',
  size = 'md',
  showLabel = false,
  showValue = false,
  label,
  className,
  disabled = false,
}: SliderProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setInternalValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const thumbSizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variantStyles = {
    default: `bg-cyber-${glowColor}`,
    neon: `bg-cyber-${glowColor} shadow-neon-${glowColor}`,
    cyber: 'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(showLabel || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-gray-400">{label}</span>}
          {showValue && <span className={`text-cyber-${glowColor} font-mono`}>{value}</span>}
        </div>
      )}
      <div className="relative">
        {/* Track background */}
        <div
          className={cn(
            'absolute top-1/2 left-0 right-0 -translate-y-1/2 rounded-full bg-cyber-muted',
            sizeStyles[size]
          )}
        />

        {/* Filled track */}
        <motion.div
          className={cn(
            'absolute top-1/2 left-0 -translate-y-1/2 rounded-full',
            sizeStyles[size],
            variantStyles[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'relative w-full appearance-none bg-transparent cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
          }}
        />

        {/* Thumb */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-white border-2 pointer-events-none',
            thumbSizeStyles[size],
            `border-cyber-${glowColor}`,
            disabled && 'opacity-50'
          )}
          style={{ left: `calc(${percentage}% - ${size === 'sm' ? 6 : size === 'md' ? 8 : 10}px)` }}
          animate={{ scale: disabled ? 1 : 1 }}
          whileHover={{ scale: disabled ? 1 : 1.2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
    </div>
  );
};

export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'cyan' | 'purple' | 'pink';
  showLabel?: boolean;
  showValue?: boolean;
  label?: string;
  className?: string;
}

export const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = [25, 75],
  onChange,
  variant = 'default',
  glowColor = 'cyan',
  showLabel = false,
  showValue = false,
  label,
  className,
}: RangeSliderProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const [minValue, maxValue] = value;
  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(Number(e.target.value), maxValue - step);
    const newRange: [number, number] = [newValue, maxValue];
    setInternalValue(newRange);
    onChange?.(newRange);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(e.target.value), minValue + step);
    const newRange: [number, number] = [minValue, newValue];
    setInternalValue(newRange);
    onChange?.(newRange);
  };

  const variantStyles = {
    default: `bg-cyber-${glowColor}`,
    neon: `bg-cyber-${glowColor} shadow-neon-${glowColor}`,
    cyber: 'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(showLabel || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-gray-400">{label}</span>}
          {showValue && (
            <span className={`text-cyber-${glowColor} font-mono`}>
              {minValue} - {maxValue}
            </span>
          )}
        </div>
      )}
      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 rounded-full bg-cyber-muted" />

        {/* Filled track */}
        <motion.div
          className={cn('absolute top-1/2 -translate-y-1/2 h-1 rounded-full', variantStyles[variant])}
          initial={{ left: '0%', width: '0%' }}
          animate={{ left: `${minPercentage}%`, width: `${maxPercentage - minPercentage}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* Inputs */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-full appearance-none bg-transparent cursor-pointer"
          style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-full appearance-none bg-transparent cursor-pointer"
          style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
        />

        {/* Thumbs */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-cyber-cyan"
          style={{ left: `calc(${minPercentage}% - 8px)` }}
          whileHover={{ scale: 1.2 }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-cyber-cyan"
          style={{ left: `calc(${maxPercentage}% - 8px)` }}
          whileHover={{ scale: 1.2 }}
        />
      </div>
    </div>
  );
};
