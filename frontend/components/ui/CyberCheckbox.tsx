'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
}

export const CyberCheckbox = forwardRef<HTMLInputElement, CyberCheckboxProps>(
  (
    {
      className,
      label,
      error,
      variant = 'default',
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'border-cyan-500/50 checked:border-cyan-500 checked:bg-cyan-500/20',
      glow: 'border-fuchsia-500/50 checked:border-fuchsia-500 checked:bg-fuchsia-500/20',
      neon: 'border-pink-500/50 checked:border-pink-500 checked:bg-pink-500/20',
      hologram: 'border-purple-500/50 checked:border-purple-500 checked:bg-purple-500/20',
    };

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            className={cn(
              'w-5 h-5 bg-black/40 border-2 rounded-sm',
              'transition-all duration-300',
              'cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'appearance-none checked:bg-gradient-to-br checked:from-cyan-500/20 checked:to-blue-500/20',
              variantStyles[variant],
              error && 'border-red-500',
              checked && 'relative',
              className
            )}
            {...props}
          />
          {checked && (
            <svg
              className="absolute w-3 h-3 text-cyan-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ marginLeft: '-15px', marginTop: '2px' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
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

CyberCheckbox.displayName = 'CyberCheckbox';

export default CyberCheckbox;
