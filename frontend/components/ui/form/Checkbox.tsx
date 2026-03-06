/**
 * Checkbox Component
 * 复选框组件
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      indeterminate = false,
      containerClassName,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('flex items-start', containerClassName)}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={cn(
              'w-4 h-4 rounded',
              'border border-gray-300 dark:border-gray-700',
              'text-cyber-cyan',
              'focus:ring-2 focus:ring-cyber-cyan/50',
              'focus:ring-offset-0',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              error && 'border-red-500 focus:ring-red-500/50',
              className
            )}
            {...props}
          />
        </div>

        {label && (
          <div className="ml-3">
            <label
              className={cn(
                'text-sm font-medium',
                disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300',
                'cursor-pointer'
              )}
            >
              {label}
            </label>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
