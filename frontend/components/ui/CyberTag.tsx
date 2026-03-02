'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberTagProps {
  children: React.ReactNode;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const CyberTag: React.FC<CyberTagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  className,
}) => {
  const variantStyles = {
    default: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30',
    glow: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50 hover:bg-fuchsia-500/30',
    neon: 'bg-pink-500/20 text-pink-400 border-pink-500/50 hover:bg-pink-500/30',
    hologram: 'bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border rounded-sm transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-white transition-colors"
          aria-label="Remove tag"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default CyberTag;
