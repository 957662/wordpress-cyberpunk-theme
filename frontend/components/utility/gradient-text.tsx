'use client';

/**
 * Gradient Text Component
 * 渐变文字组件 - 用于显示渐变色文字
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GradientTextProps } from './types';

export function GradientText({
  children,
  colors = ['#00f0ff', '#9d00ff', '#ff0080'],
  className,
  direction = 'horizontal',
  animate = false,
  size = 'md',
}: GradientTextProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const directionMap = {
    horizontal: 'to right',
    vertical: 'to bottom',
    diagonal: 'to bottom right',
  };

  const gradientStyle = {
    background: `linear-gradient(${directionMap[direction]}, ${colors.join(', ')})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <span
      className={cn(
        'gradient-text font-bold',
        sizeClasses[size],
        animate && 'animate-gradient',
        className
      )}
      style={gradientStyle}
    >
      {children}
    </span>
  );
}
