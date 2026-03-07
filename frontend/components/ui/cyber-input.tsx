'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'neon' | 'minimal' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  type?: 'text' | 'password' | 'email' | 'search' | 'number' | 'url';
  showPasswordToggle?: boolean;
}

export const CyberInput: React.FC<CyberInputProps> = ({
  variant = 'neon',
  size = 'md',
  error,
  label,
  helperText,
  icon,
  type = 'text',
  showPasswordToggle = type === 'password',
  className,
  id,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  const baseStyles = 'w-full rounded bg-transparent border transition-all duration-300 outline-none placeholder:text-gray-500';

  const variantStyles = {
    neon: cn(
      'border-cyber-cyan/30 text-white',
      'focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
      error && 'border-cyber-pink focus:border-cyber-pink focus:shadow-[0_0_20px_rgba(255,0,128,0.3)]'
    ),
    minimal: cn(
      'border-gray-700 text-white bg-gray-900/50',
      'focus:border-gray-600',
      error && 'border-red-500 focus:border-red-600'
    ),
    ghost: cn(
      'border-transparent text-white',
      'focus:border-cyber-cyan/30 bg-cyber-cyan/5',
      error && 'focus:border-cyber-pink/30'
    ),
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block mb-2 text-sm font-medium transition-colors duration-300',
            error ? 'text-cyber-pink' : isFocused ? 'text-cyber-cyan' : 'text-gray-400'
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-colors duration-300',
            isFocused && 'text-cyber-cyan',
            iconSize[size]
          )}>
            {icon}
          </div>
        )}

        <motion.input
          id={inputId}
          type={inputType}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            icon && 'pl-10',
            (showPasswordToggle || type === 'search') && 'pr-10',
            className
          )}
          {...props}
        />

        {/* Search icon for search type */}
        {type === 'search' && !hasValue && !isFocused && (
          <div className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none',
            iconSize[size]
          )}>
            <Search />
          </div>
        )}

        {/* Password toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300 hover:text-white',
              isFocused && 'text-cyber-cyan',
              iconSize[size]
            )}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        )}

        {/* Glowing effect */}
        {isFocused && variant === 'neon' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute inset-0 rounded pointer-events-none -z-10 blur-md',
              error ? 'bg-cyber-pink/20' : 'bg-cyber-cyan/20'
            )}
          />
        )}
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-cyber-pink"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default CyberInput;
