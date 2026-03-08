'use client';

/**
 * CyberPress Avatar Component
 * 赛博朋克风格头像组件
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
  bordered?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CyberAvatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  bordered = false,
  glow = false,
  className,
  onClick,
}: CyberAvatarProps) {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    full: 'w-full h-full text-lg',
  };

  const shapeStyles = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const borderStyles = bordered ? 'border-2 border-cyber-cyan/50' : '';
  const glowStyles = glow ? 'shadow-lg shadow-cyber-cyan/50' : '';

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const Component = onClick ? motion.button : motion.div;

  return (
    <div className={cn('relative inline-block', className)}>
      <Component
        whileHover={onClick ? { scale: 1.05 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
        className={cn(
          'flex items-center justify-center overflow-hidden bg-cyber-dark/80',
          sizeStyles[size],
          shapeStyles[shape],
          borderStyles,
          glowStyles,
          onClick && 'cursor-pointer',
          'transition-all duration-300'
        )}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={cn('w-full h-full object-cover', shapeStyles[shape])}
          />
        ) : (
          <span className="font-semibold text-cyber-cyan">
            {fallback || getInitials(alt)}
          </span>
        )}
      </Component>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-cyber-dark',
            statusColors[status],
            size === 'lg' || size === 'xl' ? 'w-4 h-4' : ''
          )}
        />
      )}
    </div>
  );
}

/**
 * 头像组
 */
export interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({ avatars, max = 3, size = 'md', className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="relative" style={{ zIndex: avatars.length - index }}>
          <CyberAvatar
            {...avatar}
            size={size}
            bordered
            className="ring-2 ring-cyber-dark"
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center bg-cyber-dark/80 border-2 border-cyber-cyan/50 rounded-full text-cyber-cyan font-semibold',
            size === 'sm' ? 'w-8 h-8 text-xs' : size === 'md' ? 'w-12 h-12 text-sm' : 'w-16 h-16 text-base'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default CyberAvatar;
