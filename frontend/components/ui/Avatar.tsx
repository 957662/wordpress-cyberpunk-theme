/**
 * Avatar Component
 *
 * User avatar with cyberpunk styling
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circle' | 'square' | 'rounded';
  fallback?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  glow?: boolean;
  className?: string;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
  '2xl': 'w-32 h-32 text-4xl',
};

const variantStyles = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

const statusColors = {
  online: 'bg-cyber-green',
  offline: 'bg-gray-400',
  busy: 'bg-cyber-pink',
  away: 'bg-cyber-yellow',
};

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  variant = 'circle',
  fallback,
  status,
  glow = false,
  className,
}: AvatarProps) {
  const [imageError, setImageError] = useState(!src);
  const initials = fallback
    ? fallback
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : alt.slice(0, 2).toUpperCase();

  return (
    <div className={cn('relative inline-block', className)}>
      <motion.div
        className={cn(
          'flex items-center justify-center bg-cyber-muted text-gray-300 overflow-hidden',
          sizeStyles[size],
          variantStyles[variant],
          glow && 'shadow-neon',
          imageError && 'border-2 border-cyber-border'
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {imageError ? (
          <span className="font-bold">{initials}</span>
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </motion.div>

      {/* Status Indicator */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-cyber-dark',
            statusColors[status],
            size === 'xs' && 'w-2 h-2',
            size === 'sm' && 'w-2 h-2',
            (size === 'xl' || size === '2xl') && 'w-4 h-4'
          )}
        />
      )}
    </div>
  );
}

/**
 * Avatar Group Component
 */
export interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 5,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-cyber-dark" style={{ zIndex: avatars.length - index }}>
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center bg-cyber-muted text-gray-400 font-bold ring-2 ring-cyber-dark',
            sizeStyles[size]
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
