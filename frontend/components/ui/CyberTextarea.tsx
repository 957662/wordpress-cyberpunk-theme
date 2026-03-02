/**
 * CyberTextarea Component
 * 赛博朋克风格的多行文本输入组件
 */

'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { CyberColor } from '@/types';

export interface CyberTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  color?: CyberColor;
  resizable?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

const colorClasses: Record<CyberColor, { border: string; focus: string; glow: string }> = {
  cyan: {
    border: 'border-cyber-cyan/50',
    focus: 'focus:border-cyber-cyan',
    glow: 'focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  },
  purple: {
    border: 'border-cyber-purple/50',
    focus: 'focus:border-cyber-purple',
    glow: 'focus:shadow-[0_0_20px_rgba(157,0,255,0.3)]',
  },
  pink: {
    border: 'border-cyber-pink/50',
    focus: 'focus:border-cyber-pink',
    glow: 'focus:shadow-[0_0_20px_rgba(255,0,128,0.3)]',
  },
  yellow: {
    border: 'border-cyber-yellow/50',
    focus: 'focus:border-cyber-yellow',
    glow: 'focus:shadow-[0_0_20px_rgba(240,255,0,0.3)]',
  },
  green: {
    border: 'border-cyber-green/50',
    focus: 'focus:border-cyber-green',
    glow: 'focus:shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  },
  orange: {
    border: 'border-cyber-orange/50',
    focus: 'focus:border-cyber-orange',
    glow: 'focus:shadow-[0_0_20px_rgba(255,136,0,0.3)]',
  },
};

export const CyberTextarea = forwardRef<HTMLTextAreaElement, CyberTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      color = 'cyan',
      resizable = true,
      maxLength,
      showCount = false,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const currentLength = String(value || '').length;

    const baseClasses = 'w-full px-4 py-3 rounded-lg bg-cyber-dark/50 text-white placeholder-gray-500 transition-all duration-300';

    const variantClasses = {
      default: `border-2 ${colorClasses[color].border} ${colorClasses[color].focus} ${colorClasses[color].glow}`,
      filled: 'bg-cyber-cyan/10 border-2 border-transparent focus:border-cyber-cyan/50 focus:bg-cyber-cyan/5',
      outlined: 'bg-transparent border-2 border-gray-700 focus:border-cyber-cyan',
    };

    const errorClasses = error
      ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-cyber-cyan mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <textarea
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={cn(
              baseClasses,
              variantClasses[variant],
              errorClasses,
              !resizable && 'resize-none',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* 装饰性角落 */}
          {variant === 'default' && isFocused && (
            <>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan" />
            </>
          )}

          {/* 字符计数 */}
          {showCount && (
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {maxLength ? `${currentLength}/${maxLength}` : currentLength}
            </div>
          )}
        </motion.div>

        {/* 辅助文本或错误信息 */}
        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('mt-2 text-sm', error ? 'text-red-500' : 'text-gray-400')}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

CyberTextarea.displayName = 'CyberTextarea';
