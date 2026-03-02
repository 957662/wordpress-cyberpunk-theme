'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  helperText?: string;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CyberSwitch: React.FC<CyberSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  helperText,
  variant = 'default',
  disabled = false,
  size = 'md',
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const variantStyles = {
    default: {
      track: checked ? 'bg-cyan-500/30 border-cyan-500' : 'bg-gray-800/50 border-gray-600',
      thumb: checked ? 'bg-cyan-400 shadow-cyan-500/50' : 'bg-gray-600',
    },
    glow: {
      track: checked ? 'bg-fuchsia-500/30 border-fuchsia-500' : 'bg-gray-800/50 border-gray-600',
      thumb: checked ? 'bg-fuchsia-400 shadow-fuchsia-500/50' : 'bg-gray-600',
    },
    neon: {
      track: checked ? 'bg-pink-500/30 border-pink-500' : 'bg-gray-800/50 border-gray-600',
      thumb: checked ? 'bg-pink-400 shadow-pink-500/50' : 'bg-gray-600',
    },
    hologram: {
      track: checked ? 'bg-purple-500/30 border-purple-500' : 'bg-gray-800/50 border-gray-600',
      thumb: checked ? 'bg-purple-400 shadow-purple-500/50' : 'bg-gray-600',
    },
  };

  const sizeStyles = {
    sm: { track: 'w-10 h-5', thumb: 'w-3 h-3' },
    md: { track: 'w-12 h-6', thumb: 'w-4 h-4' },
    lg: { track: 'w-14 h-7', thumb: 'w-5 h-5' },
  };

  const styles = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  const handleChange = () => {
    if (disabled) return;
    const newChecked = !checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  return (
    <div className="flex items-start">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleChange}
        className={cn(
          'relative inline-flex flex-shrink-0 border-2 rounded-full transition-colors duration-300',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-black',
          styles.track,
          sizeClass.track,
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow transform transition-transform duration-300',
            sizeClass.thumb,
            styles.thumb,
            checked ? 'translate-x-full' : 'translate-x-0',
            'shadow-lg'
          )}
        />
      </button>
      {(label || helperText) && (
        <div className="ml-3">
          {label && (
            <span className="block text-sm font-medium text-gray-300">{label}</span>
          )}
          {helperText && (
            <span className="block text-sm text-gray-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CyberSwitch;
