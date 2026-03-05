/**
 * RadioGroup Component
 * 单选框组组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'cyber';
  disabled?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || options[0]?.value);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (disabled) return;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const variantStyles = {
    default: 'border-cyber-border',
    neon: 'border-cyber-cyan shadow-neon-cyan',
    cyber: 'border-cyber-purple shadow-neon-purple',
  };

  return (
    <div
      className={cn(
        'flex gap-3',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = currentValue === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <motion.label
            key={option.value}
            className={cn(
              'relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
              'bg-cyber-card/50 hover:bg-cyber-card',
              isSelected && variantStyles[variant],
              isDisabled && 'opacity-50 cursor-not-allowed',
              sizeStyles[size]
            )}
            whileHover={!isDisabled ? { scale: 1.02 } : undefined}
            whileTap={!isDisabled ? { scale: 0.98 } : undefined}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => handleChange(option.value)}
              disabled={isDisabled}
              className="sr-only"
            />

            {/* Custom Radio Button */}
            <div className="relative flex-shrink-0 mt-0.5">
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 transition-all',
                  isSelected
                    ? 'border-cyber-cyan bg-cyber-cyan/20'
                    : 'border-cyber-border bg-cyber-dark'
                )}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-1.5 rounded-full bg-cyber-cyan"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            </div>

            {/* Label and Description */}
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  'font-medium transition-colors',
                  isSelected ? 'text-cyber-cyan' : 'text-gray-200'
                )}
              >
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-gray-400 mt-0.5">
                  {option.description}
                </div>
              )}
            </div>
          </motion.label>
        );
      })}
    </div>
  );
};

export default RadioGroup;
