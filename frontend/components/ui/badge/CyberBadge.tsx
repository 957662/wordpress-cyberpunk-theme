'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type BadgeColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'solid' | 'outline' | 'glow' | 'neon';

export interface CyberBadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  variant?: BadgeVariant;
  dot?: boolean;
  count?: number;
  maxCount?: number;
  pulse?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: {
    solid: 'bg-cyan-500 text-white border-cyan-500',
    outline: 'bg-transparent text-cyan-400 border-cyan-400',
    glow: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/50',
    neon: 'bg-cyan-500/10 text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]',
  },
  purple: {
    solid: 'bg-purple-500 text-white border-purple-500',
    outline: 'bg-transparent text-purple-400 border-purple-400',
    glow: 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-lg shadow-purple-500/50',
    neon: 'bg-purple-500/10 text-purple-400 border-purple-400 shadow-[0_0_10px_rgba(157,0,255,0.5)]',
  },
  pink: {
    solid: 'bg-pink-500 text-white border-pink-500',
    outline: 'bg-transparent text-pink-400 border-pink-400',
    glow: 'bg-pink-500/20 text-pink-400 border-pink-500/50 shadow-lg shadow-pink-500/50',
    neon: 'bg-pink-500/10 text-pink-400 border-pink-400 shadow-[0_0_10px_rgba(255,0,128,0.5)]',
  },
  green: {
    solid: 'bg-green-500 text-white border-green-500',
    outline: 'bg-transparent text-green-400 border-green-400',
    glow: 'bg-green-500/20 text-green-400 border-green-500/50 shadow-lg shadow-green-500/50',
    neon: 'bg-green-500/10 text-green-400 border-green-400 shadow-[0_0_10px_rgba(0,255,136,0.5)]',
  },
  yellow: {
    solid: 'bg-yellow-500 text-black border-yellow-500',
    outline: 'bg-transparent text-yellow-400 border-yellow-400',
    glow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-lg shadow-yellow-500/50',
    neon: 'bg-yellow-500/10 text-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(240,255,0,0.5)]',
  },
  red: {
    solid: 'bg-red-500 text-white border-red-500',
    outline: 'bg-transparent text-red-400 border-red-400',
    glow: 'bg-red-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-500/50',
    neon: 'bg-red-500/10 text-red-400 border-red-400 shadow-[0_0_10px_rgba(255,0,0,0.5)]',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export const CyberBadge: React.FC<CyberBadgeProps> = ({
  children,
  color = 'cyan',
  size = 'md',
  variant = 'solid',
  dot = false,
  count,
  maxCount = 99,
  pulse = false,
  className,
}) => {
  const displayCount = count ? (count > maxCount ? `${maxCount}+` : count) : null;

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center justify-center',
        'font-semibold rounded-md border-2',
        'backdrop-blur-sm',
        sizeClasses[size],
        colorClasses[color][variant],
        pulse && 'animate-pulse',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 圆点指示器 */}
      {dot && (
        <span
          className={cn(
            'absolute -top-1 -right-1 h-3 w-3 rounded-full',
            colorClasses[color].solid.replace('border-', 'bg-').split(' ')[0],
            'ring-2 ring-gray-900',
            pulse && 'animate-ping'
          )}
        />
      )}

      {/* 计数徽章 */}
      {count !== undefined && (
        <span className="min-w-[1.5rem] text-center">{displayCount}</span>
      )}

      {/* 内容 */}
      {!count && children}
    </motion.div>
  );
};

// 状态徽章
export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  size?: BadgeSize;
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  pulse = true,
  className,
}) => {
  const statusConfig = {
    online: { color: 'green' as BadgeColor, label: '在线' },
    offline: { color: 'gray' as BadgeColor, label: '离线' },
    busy: { color: 'red' as BadgeColor, label: '忙碌' },
    away: { color: 'yellow' as BadgeColor, label: '离开' },
  };

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'relative flex h-3 w-3',
          pulse && 'animate-pulse'
        )}
      >
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            `bg-${config.color}-500`
          )}
        />
        <span
          className={cn(
            'relative inline-flex rounded-full h-3 w-3',
            `bg-${config.color}-400`
          )}
        />
      </span>
      <span className="text-sm font-medium text-gray-300">{config.label}</span>
    </div>
  );
};

// 标签徽章
export interface TagBadgeProps {
  tags: string[];
  color?: BadgeColor;
  size?: BadgeSize;
  removable?: boolean;
  onRemove?: (index: number) => void;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tags,
  color = 'cyan',
  size = 'sm',
  removable = false,
  onRemove,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <CyberBadge color={color} size={size} variant="outline">
            {tag}
          </CyberBadge>
          {removable && (
            <button
              onClick={() => onRemove?.(index)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CyberBadge;
