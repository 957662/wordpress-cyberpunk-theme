/**
 * Badge - 徽章组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, TrendingUp, AlertCircle } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className,
}) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    primary: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    success: 'bg-green-500/10 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={cn(
        'inline-flex items-center gap-1.5 border font-medium rounded-md',
        variants[variant],
        sizes[size],
        'hover:opacity-80 transition-opacity',
        className
      )}
    >
      {dot && (
        <motion.span
          className={cn('rounded-full', iconSizes[size], 'bg-current')}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          ✕
        </button>
      )}
    </motion.span>
  );
};

export default Badge;

// 状态徽章
export function StatusBadge({ status, showText = true }: { status: 'online' | 'offline'; showText?: boolean }) {
  const config = {
    online: { color: 'success' as const, text: '在线' },
    offline: { color: 'default' as const, text: '离线' },
  };

  return (
    <Badge variant={config[status].color} size="sm" dot>
      {showText && config[status].text}
    </Badge>
  );
}

// 计数徽章
export function CountBadge({ count, max = 99, color = 'red' }: { count: number; max?: number; color?: string }) {
  if (count === 0) return null;
  const displayCount = count > max ? `${max}+` : count;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        'absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
        `bg-${color}-500 text-white`,
        count > 9 && 'w-auto px-1'
      )}
    >
      {displayCount}
    </motion.span>
  );
}

// 趋势徽章
export function TrendBadge({ value }: { value: number }) {
  const isPositive = value >= 0;

  return (
    <Badge variant={isPositive ? 'success' : 'error'} size="sm" icon={<TrendingUp className="w-3 h-3" />}>
      {isPositive ? '+' : ''}{value}%
    </Badge>
  );
}

// 验证徽章
export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;

  return (
    <motion.div
      initial={{ rotate: -180, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      className="inline-flex"
      title="已验证"
    >
      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
        <Check className="text-white" strokeWidth={3} />
      </div>
    </motion.div>
  );
}
