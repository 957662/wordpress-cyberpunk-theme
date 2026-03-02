'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const CyberSelect = forwardRef<HTMLSelectElement, CyberSelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = 'default',
      options,
      placeholder = 'Select an option',
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'border-cyan-500/30 focus:border-cyan-500 focus:shadow-cyan-500/20',
      glow: 'border-fuchsia-500/30 focus:border-fuchsia-500 focus:shadow-fuchsia-500/30',
      neon: 'border-pink-500/30 focus:border-pink-500 focus:shadow-pink-500/30',
      hologram: 'border-purple-500/30 focus:border-purple-500 focus:shadow-purple-500/20',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-cyan-400">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 pr-10 bg-black/40 backdrop-blur-sm border',
              'text-white appearance-none cursor-pointer',
              'rounded-sm transition-all duration-300',
              'focus:outline-none focus:shadow-lg',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variantStyles[variant],
              error && 'border-red-500 focus:border-red-500 focus:shadow-red-500/20',
              className
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-gray-900 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

CyberSelect.displayName = 'CyberSelect';

export default CyberSelect;
