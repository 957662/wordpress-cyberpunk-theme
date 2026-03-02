/**
 * CyberButton - 赛博朋克风格按钮组件
 * 支持多种视觉效果和动画
 */

'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  glow?: boolean;
  scanline?: boolean;
  glitch?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      color = 'cyan',
      glow = true,
      scanline = false,
      glitch = false,
      fullWidth = false,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const colorStyles = {
      cyan: {
        bg: 'bg-cyber-cyan',
        text: 'text-black',
        border: 'border-cyber-cyan',
        shadow: 'shadow-cyber-cyan/50',
      },
      purple: {
        bg: 'bg-cyber-purple',
        text: 'text-white',
        border: 'border-cyber-purple',
        shadow: 'shadow-cyber-purple/50',
      },
      pink: {
        bg: 'bg-cyber-pink',
        text: 'text-white',
        border: 'border-cyber-pink',
        shadow: 'shadow-cyber-pink/50',
      },
      yellow: {
        bg: 'bg-cyber-yellow',
        text: 'text-black',
        border: 'border-cyber-yellow',
        shadow: 'shadow-cyber-yellow/50',
      },
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    };

    const variantStyles = {
      primary: cn(
        colorStyles[color].bg,
        colorStyles[color].text,
        'border-transparent',
        glow && `shadow-lg ${colorStyles[color].shadow} hover:shadow-xl`,
        'hover:opacity-90'
      ),
      secondary: cn(
        'bg-gray-800 text-white border-gray-700',
        'hover:bg-gray-700'
      ),
      outline: cn(
        'bg-transparent',
        colorStyles[color].text,
        colorStyles[color].border,
        'border-2',
        `hover:bg-${color}-500/10`
      ),
      glow: cn(
        'bg-transparent',
        colorStyles[color].text,
        colorStyles[color].border,
        'border-2',
        `shadow-[0_0_20px_currentColor] hover:shadow-[0_0_40px_currentColor]`
      ),
      ghost: cn(
        'bg-transparent text-gray-300 border-transparent',
        'hover:bg-white/5 hover:text-white'
      ),
    };

    const baseStyles = cn(
      'relative inline-flex items-center justify-center',
      'font-medium rounded-md transition-all',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-dark',
      sizeStyles[size],
      variantStyles[variant],
      fullWidth && 'w-full',
      className
    );

    return (
      <motion.button
        ref={ref}
        className={baseStyles}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        {...props}
      >
        {/* 扫描线效果 */}
        {scanline && (
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-md"
            initial={false}
          >
            <motion.div
              className="h-full w-0.5 bg-white/30"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}

        {/* 故障效果 */}
        {glitch && !disabled && !loading && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-cyber-cyan/20 mix-blend-overlay animate-pulse" />
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-current rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* 内容 */}
        <span className={cn('relative z-10', loading && 'opacity-0')}>
          {children}
        </span>
      </motion.button>
    );
  }
);

CyberButton.displayName = 'CyberButton';

// 快捷组件
export function CyanButton(props: CyberButtonProps) {
  return <CyberButton {...props} color="cyan" />;
}

export function PurpleButton(props: CyberButtonProps) {
  return <CyberButton {...props} color="purple" />;
}

export function PinkButton(props: CyberButtonProps) {
  return <CyberButton {...props} color="pink" />;
}
