/**
 * 赛博朋克风格文本域组件
 */

'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'neon' | 'underline';
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      resize = 'vertical',
      className,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full px-4 py-2.5 bg-cyber-card border rounded-md transition-all duration-200 outline-none text-white placeholder:text-gray-500';

    const variants = {
      default:
        'border-cyber-border focus:border-cyber-cyan focus:shadow-neon-cyan',
      neon: 'border-cyber-cyan/50 focus:border-cyber-cyan focus:shadow-neon-cyan',
      underline:
        'border-x-0 border-t-0 border-b-2 border-cyber-border rounded-none px-0 bg-transparent focus:border-cyber-cyan',
    };

    const resizeStyles = {
      none: 'resize-none',
      both: 'resize',
      horizontal: 'resize-x',
      vertical: 'resize-y',
    };

    const errorStyles = error
      ? 'border-cyber-pink focus:border-cyber-pink focus:shadow-neon-pink'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            baseStyles,
            variants[variant],
            errorStyles,
            resizeStyles[resize],
            className
          )}
          {...props}
        />

        {(error || helperText) && (
          <p
            className={cn(
              'mt-1 text-sm',
              error ? 'text-cyber-pink' : 'text-gray-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
