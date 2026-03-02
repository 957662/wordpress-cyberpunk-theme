/**
 * CyberInput - 赛博朋克风格输入框
 * 带有霓虹聚焦效果
 */

'use client';

import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'cyan' | 'purple' | 'pink';
  icon?: React.ReactNode;
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ label, error, variant = 'cyan', icon, className, ...props }, ref) => {
    const variantColors = {
      cyan: {
        border: 'border-cyber-border focus:border-cyber-cyan',
        focus: 'focus:shadow-neon-cyan focus:ring-cyber-cyan/20',
        label: 'text-cyber-cyan',
      },
      purple: {
        border: 'border-cyber-border focus:border-cyber-purple',
        focus: 'focus:shadow-neon-purple focus:ring-cyber-purple/20',
        label: 'text-cyber-purple',
      },
      pink: {
        border: 'border-cyber-border focus:border-cyber-pink',
        focus: 'focus:shadow-neon-pink focus:ring-cyber-pink/20',
        label: 'text-cyber-pink',
      },
    };

    const colors = variantColors[variant];

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              'block text-sm font-semibold mb-2 uppercase tracking-wider',
              colors.label
            )}
          >
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
            className={cn(
              'w-full',
              'px-4 py-3',
              'bg-cyber-darker/80',
              'border-2',
              'rounded-lg',
              'text-white',
              'placeholder-gray-500',
              'transition-all',
              'duration-300',
              'focus:outline-none',
              'focus:ring-2',
              icon && 'pl-10',
              colors.border,
              colors.focus,
              error && 'border-red-500 focus:border-red-500 focus:shadow-red-500/20',
              'disabled:opacity-50',
              'disabled:cursor-not-allowed',
              className
            )}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />

          {/* 聚焦时的光效 */}
          <motion.div
            className={cn(
              'absolute inset-0 rounded-lg pointer-events-none',
              variant === 'cyan' && 'shadow-neon-cyan',
              variant === 'purple' && 'shadow-neon-purple',
              variant === 'pink' && 'shadow-neon-pink'
            )}
            initial={{ opacity: 0 }}
            whileFocus={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {error && (
          <motion.p
            className="mt-2 text-sm text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

export default CyberInput;
