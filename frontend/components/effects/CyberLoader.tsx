'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'pulse' | 'dots' | 'bars';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
}

export const CyberLoader: React.FC<CyberLoaderProps> = ({
  size = 'md',
  text,
  variant = 'spinner',
  color = 'cyan',
  className,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorStyles = {
    cyan: 'border-cyan-500 shadow-cyan-500/50',
    purple: 'border-purple-500 shadow-purple-500/50',
    pink: 'border-pink-500 shadow-pink-500/50',
    yellow: 'border-yellow-500 shadow-yellow-500/50',
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div
          className={cn(
            'relative rounded-full border-4 border-t-transparent animate-spin',
            sizeStyles[size],
            colorStyles[color]
          )}
          style={{
            boxShadow: `0 0 20px ${color === 'cyan' ? 'rgba(0, 240, 255, 0.5)' :
                          color === 'purple' ? 'rgba(157, 0, 255, 0.5)' :
                          color === 'pink' ? 'rgba(255, 0, 128, 0.5)' :
                          'rgba(240, 255, 0, 0.5)'}`,
          }}
        />
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div
          className={cn(
            'rounded-full animate-pulse',
            sizeStyles[size],
            colorStyles[color]
          )}
          style={{
            background: `radial-gradient(circle, ${color === 'cyan' ? 'rgba(0, 240, 255, 0.8)' :
                          color === 'purple' ? 'rgba(157, 0, 255, 0.8)' :
                          color === 'pink' ? 'rgba(255, 0, 128, 0.8)' :
                          'rgba(240, 255, 0, 0.8)'} 0%, transparent 70%)`,
          }}
        />
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'rounded-full animate-bounce',
                size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4',
                color === 'cyan' && 'bg-cyan-500',
                color === 'purple' && 'bg-purple-500',
                color === 'pink' && 'bg-pink-500',
                color === 'yellow' && 'bg-yellow-500'
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                boxShadow: `0 0 10px ${color === 'cyan' ? 'rgba(0, 240, 255, 0.8)' :
                              color === 'purple' ? 'rgba(157, 0, 255, 0.8)' :
                              color === 'pink' ? 'rgba(255, 0, 128, 0.8)' :
                              'rgba(240, 255, 0, 0.8)'}`,
              }}
            />
          ))}
        </div>
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div className="flex gap-1 items-end">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'animate-pulse',
                size === 'sm' ? 'w-1' : size === 'md' ? 'w-2' : 'w-3',
                color === 'cyan' && 'bg-cyan-500',
                color === 'purple' && 'bg-purple-500',
                color === 'pink' && 'bg-pink-500',
                color === 'yellow' && 'bg-yellow-500'
              )}
              style={{
                height: `${size === 'sm' ? 16 : size === 'md' ? 24 : 32}px`,
                animationDelay: `${i * 0.15}s`,
                boxShadow: `0 0 10px ${color === 'cyan' ? 'rgba(0, 240, 255, 0.8)' :
                              color === 'purple' ? 'rgba(157, 0, 255, 0.8)' :
                              color === 'pink' ? 'rgba(255, 0, 128, 0.8)' :
                              'rgba(240, 255, 0, 0.8)'}`,
              }}
            />
          ))}
        </div>
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  return null;
};

export default CyberLoader;
