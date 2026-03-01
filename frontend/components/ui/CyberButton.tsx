/**
 * CyberButton Component
 * 赛博朋克风格按钮组件
 */

'use client';

import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 按钮变体
 */
export type CyberButtonVariant = 'primary' | 'secondary' | 'outline' | 'glow' | 'neon';

/**
 * 按钮尺寸
 */
export type CyberButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * CyberButton 属性
 */
export interface CyberButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: CyberButtonVariant;
  size?: CyberButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glitch?: boolean;
  scanline?: boolean;
}

/**
 * 变体样式映射
 */
const variantStyles: Record<CyberButtonVariant, string> = {
  primary: `
    bg-cyber-cyan/20
    border-2 border-cyber-cyan
    text-cyber-cyan
    hover:bg-cyber-cyan/30
    hover:shadow-neon
    active:scale-95
  `,
  secondary: `
    bg-cyber-purple/20
    border-2 border-cyber-purple
    text-cyber-purple
    hover:bg-cyber-purple/30
    hover:shadow-purple
    active:scale-95
  `,
  outline: `
    bg-transparent
    border-2 border-cyber-cyan
    text-cyber-cyan
    hover:bg-cyber-cyan/10
    active:scale-95
  `,
  glow: `
    bg-cyber-pink/20
    border-2 border-cyber-pink
    text-cyber-pink
    hover:bg-cyber-pink/30
    hover:shadow-pink
    active:scale-95
  `,
  neon: `
    bg-cyber-green/20
    border-2 border-cyber-green
    text-cyber-green
    hover:bg-cyber-green/30
    hover:shadow-green
    active:scale-95
  `,
};

/**
 * 尺寸样式映射
 */
const sizeStyles: Record<CyberButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

/**
 * 图标尺寸映射
 */
const iconSizeStyles: Record<CyberButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};

/**
 * CyberButton 组件
 */
export function CyberButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  glitch = false,
  scanline = false,
  children,
  className,
  disabled,
  ...props
}: CyberButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = `
    relative
    inline-flex
    items-center
    justify-center
    gap-2
    font-semibold
    uppercase
    tracking-wider
    transition-all
    duration-300
    rounded
    overflow-hidden
    cursor-pointer
    select-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <motion.button
      className={cn(baseStyles, className)}
      disabled={disabled}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      {...props}
    >
      {/* 扫描线效果 */}
      {scanline && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* 故障效果 */}
      {glitch && isHovered && !disabled && (
        <>
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-current opacity-50"
            animate={{
              x: [0, -2, 2, -2, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: 2,
            }}
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-current opacity-50"
            style={{ color: 'var(--cyber-pink)' }}
            animate={{
              x: [0, 2, -2, 2, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: 2,
            }}
          >
            {children}
          </motion.span>
        </>
      )}

      {/* 左侧图标 */}
      {icon && iconPosition === 'left' && (
        <span className={cn('flex-shrink-0', iconSizeStyles[size])}>
          {icon}
        </span>
      )}

      {/* 按钮内容 */}
      <span className="relative z-10">{children}</span>

      {/* 右侧图标 */}
      {icon && iconPosition === 'right' && (
        <span className={cn('flex-shrink-0', iconSizeStyles[size])}>
          {icon}
        </span>
      )}

      {/* 装饰角 */}
      {!disabled && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current" />
        </>
      )}
    </motion.button>
  );
}

/**
 * CyberButtonGroup 组件
 */
export interface CyberButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: CyberButtonSize;
}

export function CyberButtonGroup({
  children,
  className,
  orientation = 'horizontal',
  size = 'md',
}: CyberButtonGroupProps) {
  const groupStyles = cn(
    'flex gap-2',
    orientation === 'horizontal' ? 'flex-row' : 'flex-col',
    className
  );

  return (
    <div className={groupStyles}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === CyberButton) {
          return React.cloneElement(child as React.ReactElement<any>, {
            size,
          });
        }
        return child;
      })}
    </div>
  );
}
