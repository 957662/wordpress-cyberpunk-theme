/**
 * Badge Component
 *
 * Small status and label badges with cyberpunk styling
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
}

const variantStyles = {
  default: 'bg-cyber-muted text-gray-300 border border-cyber-border',
  primary: 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30',
  secondary: 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30',
  success: 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30',
  warning: 'bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/30',
  error: 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity } : {}}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            variant === 'success' && 'bg-cyber-green',
            variant === 'error' && 'bg-cyber-pink',
            variant === 'warning' && 'bg-cyber-yellow',
            variant === 'primary' && 'bg-cyber-cyan',
            variant === 'default' && 'bg-gray-400'
          )}
        />
      )}
      {children}
    </motion.div>
  );
}

export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  showText?: boolean;
  className?: string;
}

const statusConfig = {
  online: { variant: 'success' as const, text: '在线' },
  offline: { variant: 'default' as const, text: '离线' },
  busy: { variant: 'error' as const, text: '忙碌' },
  away: { variant: 'warning' as const, text: '离开' },
};

export function StatusBadge({ status, showText = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} dot pulse={status === 'online'} className={className}>
      {showText && config.text}
    </Badge>
  );
}

export interface CountBadgeProps {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CountBadge({ count, max = 99, size = 'sm', className }: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge variant="error" size={size} className={cn('min-w-[20px] justify-center', className)}>
      {displayCount}
    </Badge>
  );
}
