'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
}

export const CyberRadio = React.forwardRef<HTMLInputElement, CyberRadioProps>(
  (
    {
      className,
      label,
      error,
      variant = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'border-cyan-500/50 checked:border-cyan-500',
      glow: 'border-fuchsia-500/50 checked:border-fuchsia-500',
      neon: 'border-pink-500/50 checked:border-pink-500',
      hologram: 'border-purple-500/50 checked:border-purple-500',
    };

    return (
      <div className="flex items-center">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="radio"
            disabled={disabled}
            className={cn(
              'w-5 h-5 bg-black/40 border-2 rounded-full',
              'transition-all duration-300',
              'cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'appearance-none checked:border-current',
              variantStyles[variant],
              error && 'border-red-500',
              className
            )}
            {...props}
          />
          {props.checked && (
            <div
              className={cn(
                'absolute w-2.5 h-2.5 rounded-full bg-current',
                variant === 'default' && 'text-cyan-500',
                variant === 'glow' && 'text-fuchsia-500',
                variant === 'neon' && 'text-pink-500',
                variant === 'hologram' && 'text-purple-500'
              )}
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            />
          )}
        </div>
        {label && (
          <label className="ml-3 text-sm text-gray-300 cursor-pointer">
            {label}
          </label>
        )}
        {error && (
          <p className="ml-3 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

CyberRadio.displayName = 'CyberRadio';

export default CyberRadio;
