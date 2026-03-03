'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: 'search' | 'none';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}

const colorClasses = {
  cyan: 'focus:ring-cyan-500 focus:border-cyan-500',
  purple: 'focus:ring-purple-500 focus:border-purple-500',
  pink: 'focus:ring-pink-500 focus:border-pink-500',
  green: 'focus:ring-green-500 focus:border-green-500'
};

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ label, error, icon = 'none', color = 'cyan', className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon === 'search' && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          )}

          <motion.input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full px-4 py-3',
              'bg-gray-800/50 border border-gray-700 rounded-lg',
              'text-white placeholder-gray-500',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon === 'search' && 'pl-10',
              isPassword && 'pr-10',
              colorClasses[color],
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';
