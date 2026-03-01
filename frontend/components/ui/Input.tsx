/**
 * 赛博朋克风格输入框组件
 */

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'neon';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, variant = 'default', className, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-2.5 rounded bg-cyber-muted border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all';

    const variants = {
      default: 'border-cyber-border focus:border-cyber-cyan focus:ring-cyber-cyan/20',
      neon: 'border-cyber-cyan focus:border-cyber-cyan focus:ring-cyber-cyan/40 shadow-neon-cyan/20',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              baseStyles,
              variants[variant],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-cyber-pink focus:border-cyber-pink focus:ring-cyber-pink/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-cyber-pink">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
