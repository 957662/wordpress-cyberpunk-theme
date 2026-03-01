/**
 * NeonCard Component
 * 霓虹灯效卡片组件
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 霓虹颜色主题
 */
export type NeonColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'blue';

/**
 * NeonCard 属性
 */
export interface NeonCardProps extends HTMLMotionProps<'div'> {
  color?: NeonColor;
  intensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  bordered?: boolean;
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * 颜色样式映射
 */
const colorStyles: Record<NeonColor, { border: string; glow: string; text: string }> = {
  cyan: {
    border: 'border-cyber-cyan',
    glow: 'shadow-neon',
    text: 'text-cyber-cyan',
  },
  purple: {
    border: 'border-cyber-purple',
    glow: 'shadow-purple',
    text: 'text-cyber-purple',
  },
  pink: {
    border: 'border-cyber-pink',
    glow: 'shadow-pink',
    text: 'text-cyber-pink',
  },
  green: {
    border: 'border-cyber-green',
    glow: 'shadow-green',
    text: 'text-cyber-green',
  },
  yellow: {
    border: 'border-cyber-yellow',
    glow: 'shadow-yellow',
    text: 'text-cyber-yellow',
  },
  blue: {
    border: 'border-cyber-blue',
    glow: 'shadow-blue',
    text: 'text-cyber-blue',
  },
};

/**
 * 强度样式映射
 */
const intensityStyles: Record<'low' | 'medium' | 'high', { bgOpacity: string; glowOpacity: string }> = {
  low: {
    bgOpacity: 'bg-opacity-5',
    glowOpacity: 'opacity-50',
  },
  medium: {
    bgOpacity: 'bg-opacity-10',
    glowOpacity: 'opacity-75',
  },
  high: {
    bgOpacity: 'bg-opacity-20',
    glowOpacity: 'opacity-100',
  },
};

/**
 * NeonCard 组件
 */
export function NeonCard({
  color = 'cyan',
  intensity = 'medium',
  glow = true,
  bordered = true,
  hover = true,
  children,
  className,
  ...props
}: NeonCardProps) {
  const styles = colorStyles[color];
  const intensityClass = intensityStyles[intensity];

  const baseStyles = cn(
    'relative',
    'rounded-lg',
    'p-6',
    'bg-cyber-dark',
    'transition-all',
    'duration-300',
    bordered && `border-2 ${styles.border}`,
    glow && styles.glow,
    hover && 'hover:scale-105 hover:shadow-2xl',
    className
  );

  return (
    <motion.div
      className={baseStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      {...props}
    >
      {/* 内部光晕效果 */}
      {glow && (
        <div
          className={cn(
            'absolute inset-0 rounded-lg pointer-events-none',
            `bg-${color}-500`,
            intensityClass.bgOpacity,
            intensityClass.glowOpacity,
            'blur-xl'
          )}
        />
      )}

      {/* 扫描线效果 */}
      <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scanline" />
      </div>

      {/* 内容 */}
      <div className="relative z-10">{children}</div>

      {/* 装饰角 */}
      <div className={cn('absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2', styles.text)} />
      <div className={cn('absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2', styles.text)} />
      <div className={cn('absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2', styles.text)} />
      <div className={cn('absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2', styles.text)} />
    </motion.div>
  );
}

/**
 * NeonCardHeader 组件
 */
export interface NeonCardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function NeonCardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: NeonCardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-cyber-cyan">{icon}</div>}
        <div>
          {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * NeonCardBody 组件
 */
export interface NeonCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function NeonCardBody({ children, className }: NeonCardBodyProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

/**
 * NeonCardFooter 组件
 */
export interface NeonCardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function NeonCardFooter({ children, className, align = 'right' }: NeonCardFooterProps) {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={cn('flex items-center gap-2 mt-6 pt-4 border-t border-gray-800', alignStyles[align], className)}>
      {children}
    </div>
  );
}
