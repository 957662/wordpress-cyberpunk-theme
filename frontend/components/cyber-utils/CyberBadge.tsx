'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  glow?: boolean;
  pulse?: boolean;
  className?: string;
}

/**
 * CyberBadge Component
 * 赛博朋克风格的徽章组件
 */
export function CyberBadge({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  glow = true,
  pulse = false,
  className,
}: CyberBadgeProps) {
  const variantStyles = {
    default: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-300 dark:border-gray-700',
      glow: 'shadow-[0_0_10px_rgba(156,163,175,0.3)]',
    },
    success: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-300 dark:border-green-700',
      glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-700',
      glow: 'shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    },
    error: {
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      text: 'text-pink-700 dark:text-pink-300',
      border: 'border-pink-300 dark:border-pink-700',
      glow: 'shadow-[0_0_10px_rgba(236,72,153,0.3)]',
    },
    info: {
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-300 dark:border-cyan-700',
      glow: 'shadow-[0_0_10px_rgba(6,182,212,0.3)]',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-all',
        styles.bg,
        styles.text,
        styles.border,
        glow && styles.glow,
        pulse && 'animate-pulse',
        sizeStyles[size],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}

/**
 * 状态徽章
 */
export function StatusBadge({
  status,
  className,
}: {
  status: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}) {
  const statusConfig = {
    online: { variant: 'success' as const, label: '在线', icon: true },
    offline: { variant: 'default' as const, label: '离线', icon: false },
    away: { variant: 'warning' as const, label: '离开', icon: true },
    busy: { variant: 'error' as const, label: '忙碌', icon: true },
  };

  const config = statusConfig[status];

  return (
    <CyberBadge
      variant={config.variant}
      pulse={config.icon}
      className={className}
    >
      {config.label}
    </CyberBadge>
  );
}

/**
 * 计数徽章
 */
export function CountBadge({
  count,
  max = 99,
  className,
}: {
  count: number;
  max?: number;
  className?: string;
}) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <CyberBadge
      variant="error"
      size="sm"
      glow
      className={className}
    >
      {displayCount}
    </CyberBadge>
  );
}

/**
 * 标签徽章
 */
export function TagBadge({
  children,
  removable = false,
  onRemove,
  className,
}: {
  children: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <CyberBadge variant="info" className={className}>
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </CyberBadge>
  );
}

export default CyberBadge;
