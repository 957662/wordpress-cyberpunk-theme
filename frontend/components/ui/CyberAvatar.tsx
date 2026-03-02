'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export const CyberAvatar: React.FC<CyberAvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  variant = 'default',
  status,
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusStyles = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const variantStyles = {
    default: 'border-cyan-500/50 shadow-cyan-500/30',
    glow: 'border-fuchsia-500/50 shadow-fuchsia-500/30',
    neon: 'border-pink-500/50 shadow-pink-500/30',
    hologram: 'border-purple-500/50 shadow-purple-500/30',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const showFallback = !src || imageError;

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-full border-2 bg-gray-900 flex items-center justify-center font-medium text-white',
          sizeStyles[size],
          variantStyles[variant]
        )}
        style={{
          boxShadow: `0 0 20px ${variant === 'default' ? 'rgba(0, 240, 255, 0.3)' :
                          variant === 'glow' ? 'rgba(157, 0, 255, 0.3)' :
                          variant === 'neon' ? 'rgba(255, 0, 128, 0.3)' :
                          'rgba(157, 0, 255, 0.3)'}`,
        }}
      >
        {showFallback ? (
          <span className={cn('text-white', variant === 'default' && 'text-cyan-400')}>
            {fallback || getInitials(alt)}
          </span>
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900',
            statusStyles[status]
          )}
        />
      )}
    </div>
  );
};

export default CyberAvatar;
