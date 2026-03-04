/**
 * CyberPress Platform - RadioGroup Component
 * 单选框组组件 - 赛博朋克风格
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'glass';
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
}

const sizeStyles = {
  sm: {
    container: 'p-2',
    label: 'text-sm',
    description: 'text-xs',
    icon: 'w-4 h-4',
  },
  md: {
    container: 'p-3',
    label: 'text-base',
    description: 'text-sm',
    icon: 'w-5 h-5',
  },
  lg: {
    container: 'p-4',
    label: 'text-lg',
    description: 'text-base',
    icon: 'w-6 h-6',
  },
};

export function RadioGroup({
  name,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  disabled = false,
  className,
  optionClassName,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (optionValue: string) => {
    if (disabled) return;
    setInternalValue(optionValue);
    onChange?.(optionValue);
  };

  const getVariantStyles = (isSelected: boolean) => {
    switch (variant) {
      case 'neon':
        return isSelected
          ? 'border-cyber-cyan shadow-neon-cyan bg-cyber-cyan/5'
          : 'border-cyber-border hover:border-cyber-cyan/50';
      case 'glass':
        return isSelected
          ? 'border-cyber-cyan bg-cyber-cyan/10 backdrop-blur-md'
          : 'border-cyber-border/50 hover:border-cyber-cyan/50 bg-cyber-card/50';
      default:
        return isSelected
          ? 'border-cyber-cyan bg-cyber-cyan/5'
          : 'border-cyber-border hover:border-cyber-cyan/50';
    }
  };

  return (
    <div
      className={cn(
        'space-y-2',
        orientation === 'horizontal' && 'flex flex-wrap gap-3',
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <motion.label
            key={option.value}
            whileHover={isDisabled ? {} : { scale: 1.02 }}
            whileTap={isDisabled ? {} : { scale: 0.98 }}
            className={cn(
              'relative flex items-center cursor-pointer rounded-lg border-2 transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              getVariantStyles(isSelected),
              orientation === 'horizontal' && 'flex-1 min-w-[200px]',
              sizeStyles[size].container,
              optionClassName
            )}
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

            {/* 单选圆圈 */}
            <div className="flex-shrink-0 mr-3">
              <motion.div
                className={cn(
                  'w-5 h-5 rounded-full border-2 relative',
                  isSelected ? 'border-cyber-cyan' : 'border-cyber-muted'
                )}
                animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-1 rounded-full bg-cyber-cyan shadow-neon-cyan"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.div>
            </div>

            {/* 图标 */}
            {option.icon && (
              <div className={cn('flex-shrink-0 mr-3', sizeStyles[size].icon)}>
                {option.icon}
              </div>
            )}

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  'font-medium transition-colors',
                  isSelected ? 'text-cyber-cyan' : 'text-gray-300',
                  sizeStyles[size].label
                )}
              >
                {option.label}
              </div>
              {option.description && (
                <div
                  className={cn(
                    'text-cyber-muted transition-colors',
                    isSelected && 'text-gray-400',
                    sizeStyles[size].description
                  )}
                >
                  {option.description}
                </div>
              )}
            </div>

            {/* 选中指示器 */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex-shrink-0 ml-2"
                >
                  <svg
                    className={cn('text-cyber-cyan', sizeStyles[size].icon)}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.label>
        );
      })}
    </div>
  );
}
