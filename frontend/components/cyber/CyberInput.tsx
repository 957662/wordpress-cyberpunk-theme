/**
 * CyberInput - 赛博朋克风格输入框组件
 */

'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  glow?: boolean;
  variant?: 'default' | 'neon' | 'minimal';
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      icon,
      glow = true,
      variant = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'w-full px-4 py-2.5 rounded-md',
      'bg-cyber-dark/50 backdrop-blur-sm',
      'border-2 transition-all duration-200',
      'placeholder:text-gray-500',
      'focus:outline-none focus:ring-2',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    );

    const variantStyles = {
      default: cn(
        'border-gray-700',
        'focus:border-cyber-cyan focus:ring-cyber-cyan/20',
        error && 'border-cyber-pink focus:border-cyber-pink focus:ring-cyber-pink/20',
        glow && 'focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]'
      ),
      neon: cn(
        'border-cyber-cyan/50',
        'focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,240,255,0.5)]',
        error && 'border-cyber-pink focus:shadow-[0_0_20px_rgba(255,0,128,0.5)]'
      ),
      minimal: cn(
        'border-transparent bg-transparent',
        'focus:bg-cyber-dark/30',
        'border-b-2 rounded-none'
      ),
    };

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <motion.input
            ref={ref}
            type={type}
            className={cn(
              baseStyles,
              variantStyles[variant],
              icon && 'pl-10',
              className
            )}
            disabled={disabled}
            whileFocus={{
              scale: 1.01,
            }}
            transition={{ duration: 0.2 }}
            {...props}
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-cyber-pink"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

// Textarea 组件
export interface CyberTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  glow?: boolean;
  variant?: 'default' | 'neon' | 'minimal';
}

export const CyberTextarea = forwardRef<HTMLTextAreaElement, CyberTextareaProps>(
  (
    {
      className,
      label,
      error,
      glow = true,
      variant = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'w-full px-4 py-2.5 rounded-md',
      'bg-cyber-dark/50 backdrop-blur-sm',
      'border-2 transition-all duration-200',
      'placeholder:text-gray-500',
      'focus:outline-none focus:ring-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'resize-y min-h-[100px]'
    );

    const variantStyles = {
      default: cn(
        'border-gray-700',
        'focus:border-cyber-cyan focus:ring-cyber-cyan/20',
        error && 'border-cyber-pink focus:border-cyber-pink focus:ring-cyber-pink/20',
        glow && 'focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]'
      ),
      neon: cn(
        'border-cyber-cyan/50',
        'focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,240,255,0.5)]',
        error && 'border-cyber-pink focus:shadow-[0_0_20px_rgba(255,0,128,0.5)]'
      ),
      minimal: cn(
        'border-transparent bg-transparent',
        'focus:bg-cyber-dark/30',
        'border-b-2 rounded-none'
      ),
    };

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        <motion.textarea
          ref={ref}
          className={cn(baseStyles, variantStyles[variant], className)}
          disabled={disabled}
          whileFocus={{
            scale: 1.01,
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-cyber-pink"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

CyberTextarea.displayName = 'CyberTextarea';
