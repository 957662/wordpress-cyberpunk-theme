'use client';

/**
 * QuickAction - 快捷操作按钮组件
 * 赛博朋克风格的快捷操作按钮
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface QuickActionProps extends HTMLMotionProps<'button'> {
  icon: LucideIcon;
  label: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  badge?: string | number;
  active?: boolean;
  fullWidth?: boolean;
  showLabel?: boolean;
}

const variantStyles = {
  primary: 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50 hover:shadow-neon-cyan',
  secondary: 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/20 hover:border-cyber-purple/50 hover:shadow-neon-purple',
  accent: 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/20 hover:border-cyber-pink/50 hover:shadow-neon-pink',
  success: 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green hover:bg-cyber-green/20 hover:border-cyber-green/50',
  warning: 'bg-cyber-yellow/10 border-cyber-yellow/30 text-cyber-yellow hover:bg-cyber-yellow/20 hover:border-cyber-yellow/50',
  danger: 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/20 hover:border-cyber-pink/50 hover:shadow-neon-pink',
};

const sizeStyles = {
  sm: 'p-2 rounded-lg',
  md: 'p-3 rounded-xl',
  lg: 'p-4 rounded-2xl',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function QuickAction({
  icon: Icon,
  label,
  description,
  variant = 'primary',
  size = 'md',
  disabled = false,
  badge,
  active = false,
  fullWidth = false,
  showLabel = true,
  className,
  ...props
}: QuickActionProps) {
  const baseStyles = 'relative inline-flex items-center gap-3 border backdrop-blur-sm transition-all duration-200';
  const activeStyles = active ? 'ring-2 ring-offset-2 ring-offset-cyber-dark ring-cyber-cyan' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        activeStyles,
        disabledStyles,
        fullWidth && 'w-full justify-center',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {/* 图标 */}
      <div className="relative flex-shrink-0">
        <Icon className={cn(iconSizes[size])} />

        {/* 徽章 */}
        {badge && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyber-pink text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </div>

      {/* 标签和描述 */}
      {showLabel && (
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-medium font-display">{label}</span>
          {description && (
            <span className="text-xs text-gray-400">{description}</span>
          )}
        </div>
      )}

      {/* 激活状态指示器 */}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute inset-0 rounded-inherit bg-cyber-cyan/5"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

/**
 * QuickActionGroup - 快捷操作组
 */
export interface QuickActionGroupProps {
  children: React.ReactNode;
  layout?: 'horizontal' | 'vertical' | 'grid';
  gap?: number;
  className?: string;
}

export function QuickActionGroup({
  children,
  layout = 'horizontal',
  gap = 2,
  className,
}: QuickActionGroupProps) {
  const layoutStyles = {
    horizontal: 'flex-row flex-wrap',
    vertical: 'flex-col',
    grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={cn('flex', layoutStyles[layout], `gap-${gap}`, className)}>
      {children}
    </div>
  );
}
