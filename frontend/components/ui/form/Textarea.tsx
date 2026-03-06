/**
 * Textarea Component
 * 文本域组件
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      showCount = false,
      containerClassName,
      className,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'border border-gray-300 dark:border-gray-700',
            'bg-white dark:bg-gray-900',
            'text-gray-900 dark:text-white',
            'placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
            'focus:border-cyber-cyan',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'resize-none',
            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />

        <div className="flex items-center justify-between mt-1">
          <div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
          </div>

          {showCount && maxLength && (
            <span className={cn(
              'text-sm',
              currentLength > maxLength ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            )}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
