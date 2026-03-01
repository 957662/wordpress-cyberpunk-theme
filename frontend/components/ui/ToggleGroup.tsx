/**
 * 切换组组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  type?: 'single' | 'multiple';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'segmented';
  className?: string;
}

export function ToggleGroup({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  type = 'single',
  size = 'md',
  variant = 'default',
  className,
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue || '');
  const [internalValues, setInternalValues] = useState<string[]>([]);

  const isControlled = controlledValue !== undefined;
  const currentValue = type === 'single' ? (isControlled ? controlledValue : internalValue) : null;
  const currentValues = type === 'multiple' ? (isControlled ? [] : internalValues) : [];

  const handleToggle = (optionValue: string) => {
    if (type === 'single') {
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
    } else {
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];

      if (!isControlled) {
        setInternalValues(newValues);
      }
      onChange?.(newValues.join(','));
    }
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variants = {
    default: 'bg-cyber-muted',
    neon: 'bg-cyber-card border border-cyber-cyan/30',
    segmented: 'bg-cyber-card',
  };

  return (
    <div
      className={cn(
        'inline-flex rounded-lg overflow-hidden',
        variant === 'default' && 'gap-1',
        variant === 'neon' && 'gap-1 p-1',
        variant === 'segmented' && 'border border-cyber-border',
        className
      )}
    >
      {options.map((option) => {
        const isSelected =
          type === 'single'
            ? currentValue === option.value
            : currentValues.includes(option.value);

        return (
          <motion.button
            key={option.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => !option.disabled && handleToggle(option.value)}
            disabled={option.disabled}
            className={cn(
              'relative flex items-center gap-2 font-medium transition-all duration-200 outline-none',
              sizes[size],
              variant === 'default' && 'rounded',
              variant === 'neon' && 'rounded',
              variant === 'segmented' && '',
              option.disabled && 'opacity-50 cursor-not-allowed',
              isSelected
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'text-gray-400 hover:text-white hover:bg-cyber-muted/50'
            )}
          >
            {option.icon && <span>{option.icon}</span>}
            <span>{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default ToggleGroup;
