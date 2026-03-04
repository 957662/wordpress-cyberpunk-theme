'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square' | 'rounded';
  glow?: boolean;
  border?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export const CyberAvatar: React.FC<CyberAvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  variant = 'circle',
  glow = true,
  border = true,
  status,
  className,
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const variantStyles = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const statusColors = {
    online: 'bg-cyber-green',
    offline: 'bg-white/40',
    away: 'bg-cyber-yellow',
    busy: 'bg-cyber-pink',
  };

  const MotionDiv = motion.div;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <MotionDiv
        className={cn(
          'relative overflow-hidden',
          'bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20',
          'flex items-center justify-center',
          'font-semibold text-white',
          sizeStyles[size],
          variantStyles[variant],
          border && 'border-2 border-cyber-cyan/50',
          glow && 'shadow-[0_0_20px_rgba(0,240,255,0.3)]'
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{fallback || getInitials(alt)}</span>
        )}

        {/* Cyber overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/10 to-transparent pointer-events-none" />
      </MotionDiv>

      {/* Status indicator */}
      {status && (
        <MotionDiv
          className={cn(
            'absolute bottom-0 right-0',
            'w-3 h-3 rounded-full',
            'border-2 border-black',
            statusColors[status]
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}
    </div>
  );
};
