'use client';

import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'neon' | 'glass' | 'underline';
  icon?: React.ReactNode;
  onIconClick?: () => void;
  showPasswordToggle?: boolean;
  glowOnFocus?: boolean;
  animateLabel?: boolean;
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  (
    {
      label,
      error,
      variant = 'neon',
      icon,
      onIconClick,
      showPasswordToggle = false,
      glowOnFocus = true,
      animateLabel = true,
      type,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    const variantStyles = {
      neon: `
        bg-cyber-dark/80
        border-2 ${error ? 'border-cyber-pink' : 'border-cyber-cyan'}
        ${isFocused ? 'shadow-[0_0_20px_rgba(0,240,255,0.3)]' : ''}
        focus:shadow-[0_0_20px_rgba(0,240,255,0.5)]
      `,
      glass: `
        bg-white/5
        backdrop-blur-xl
        border border-white/20
        focus:border-cyber-cyan/50
        focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]
      `,
      underline: `
        bg-transparent
        border-b-2 ${error ? 'border-cyber-pink' : 'border-cyber-cyan'}
        rounded-none
        focus:shadow-none
      `,
    };

    return (
      <div className="relative w-full">
        {/* 输入框容器 */}
        <div className="relative">
          {/* 图标 */}
          {icon && (
            <button
              type="button"
              onClick={onIconClick}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-cyan/70 hover:text-cyber-cyan transition-colors"
            >
              {icon}
            </button>
          )}

          {/* 输入框 */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full rounded-lg px-4 py-3 text-white placeholder-transparent outline-none transition-all duration-300',
              'focus:placeholder:text-white/30',
              icon && 'pl-12',
              showPasswordToggle && 'pr-12',
              variantStyles[variant],
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
            onChange={(e) => {
              setHasValue(e.target.value.length > 0);
              props.onChange?.(e);
            }}
            {...props}
          />

          {/* 浮动标签 */}
          {label && (
            <motion.label
              className={cn(
                'absolute pointer-events-none transition-colors duration-200',
                icon ? 'left-12' : 'left-4',
                error ? 'text-cyber-pink' : 'text-cyber-cyan',
                animateLabel && (isFocused || hasValue ? 'text-xs top-1' : 'top-1/2 -translate-y-1/2')
              )}
              animate={{
                top: animateLabel && (isFocused || hasValue) ? '4px' : '50%',
                y: animateLabel && (isFocused || hasValue) ? 0 : '-50%',
                fontSize: animateLabel && (isFocused || hasValue) ? '12px' : '16px',
              }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.label>
          )}

          {/* 密码切换按钮 */}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-cyan/70 hover:text-cyber-cyan transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {/* 光晕效果 */}
          {glowOnFocus && isFocused && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 blur-xl -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>

        {/* 错误消息 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 flex items-center gap-1 text-cyber-pink text-sm"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 装饰线 */}
        {variant === 'neon' && isFocused && (
          <>
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

export default CyberInput;
