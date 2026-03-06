/**
 * Spacer - 间距组件
 * 用于调整元素间距
 */

'use client';

import { cn } from '@/lib/utils/cn';

export interface SpacerProps {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  axis?: 'x' | 'y';
  className?: string;
}

export function Spacer({
  size = 'md',
  axis = 'y',
  className,
}: SpacerProps) {
  const sizes = {
    xs: axis === 'y' ? 'h-2' : 'w-2',
    sm: axis === 'y' ? 'h-4' : 'w-4',
    md: axis === 'y' ? 'h-8' : 'w-8',
    lg: axis === 'y' ? 'h-12' : 'w-12',
    xl: axis === 'y' ? 'h-16' : 'w-16',
  };

  const customSize = typeof size === 'number' ? (axis === 'y' ? `h-[${size}px]` : `w-[${size}px]`) : sizes[size];

  return <div className={cn(customSize, className)} />;
}
