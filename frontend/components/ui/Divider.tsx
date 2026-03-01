/**
 * 分割线组件
 * 视觉分隔元素
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DividerProps {
  /** 分割线方向 */
  orientation?: 'horizontal' | 'vertical';
  /** 分割线样式 */
  variant?: 'solid' | 'dashed' | 'dotted' | 'glow';
  /** 颜色 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'default';
  /** 文字标签 */
  label?: string;
  /** 自定义类名 */
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'default',
  label,
  className,
}: DividerProps) {
  const colorStyles = {
    cyan: 'border-cyber-cyan shadow-neon-cyan',
    purple: 'border-cyber-purple shadow-neon-purple',
    pink: 'border-cyber-pink shadow-neon-pink',
    yellow: 'border-cyber-yellow shadow-neon-yellow',
    default: 'border-cyber-border',
  };

  const variantStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    glow: 'border-solid shadow-lg',
  };

  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div
          className={cn(
            'flex-1 border-t',
            colorStyles[color],
            variantStyles[variant]
          )}
        />
        <span className="text-sm text-gray-400 whitespace-nowrap">{label}</span>
        <div
          className={cn(
            'flex-1 border-t',
            colorStyles[color],
            variantStyles[variant]
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border',
        orientation === 'horizontal' ? 'border-t' : 'border-l',
        colorStyles[color],
        variantStyles[variant],
        className
      )}
    />
  );
}

export interface AnimatedDividerProps extends Omit<DividerProps, 'variant'> {
  /** 是否启用扫描动画 */
  scan?: boolean;
}

export function AnimatedDivider({
  orientation = 'horizontal',
  color = 'cyan',
  label,
  scan = true,
  className,
}: AnimatedDividerProps) {
  const colorStyles = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
    default: 'bg-cyber-border',
  };

  if (label) {
    return (
      <div className={cn('flex items-center gap-4 relative overflow-hidden', className)}>
        <div className="flex-1 h-px bg-cyber-border relative overflow-hidden">
          {scan && (
            <motion.div
              className={cn('absolute inset-0', colorStyles[color])}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>
        <span className="text-sm text-gray-400 whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-cyber-border relative overflow-hidden">
          {scan && (
            <motion.div
              className={cn('absolute inset-0', colorStyles[color])}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    >
      <div className="absolute inset-0 bg-cyber-border" />
      {scan && (
        <motion.div
          className={cn('absolute inset-0', colorStyles[color])}
          animate={
            orientation === 'horizontal'
              ? { x: ['-100%', '100%'] }
              : { y: ['-100%', '100%'] }
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  );
}
