/**
 * Radio Group Component
 * 单选框组组件
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  containerClassName?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      label,
      options,
      value,
      onChange,
      error,
      disabled = false,
      orientation = 'vertical',
      containerClassName,
    },
    ref
  ) => {
    const handleChange = (optionValue: string) => {
      if (!disabled) {
        onChange?.(optionValue);
      }
    };

    return (
      <div ref={ref} className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}

        <div
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col space-y-2' : 'flex-row space-x-6'
          )}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                name={name}
                id={`${name}-${option.value}`}
                value={option.value}
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                disabled={disabled || option.disabled}
                className={cn(
                  'w-4 h-4 rounded-full',
                  'border border-gray-300 dark:border-gray-700',
                  'text-cyber-cyan',
                  'focus:ring-2 focus:ring-cyber-cyan/50',
                  'focus:ring-offset-0',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200',
                  error && 'border-red-500 focus:ring-red-500/50'
                )}
              />

              <label
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'ml-3 text-sm font-medium',
                  (disabled || option.disabled)
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 cursor-pointer'
                )}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
