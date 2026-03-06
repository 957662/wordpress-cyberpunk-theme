'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'neon' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  pulse?: boolean;
  className?: string;
}

export function CyberBadge({
  children,
  variant = 'default',
  size = 'md',
  glow = false,
  pulse = false,
  className,
}: CyberBadgeProps) {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border border-gray-600',
    neon: 'bg-black text-cyan-400 border-2 border-cyan-500',
    success: 'bg-green-900/30 text-green-400 border border-green-500',
    warning: 'bg-yellow-900/30 text-yellow-400 border border-yellow-500',
    error: 'bg-red-900/30 text-red-400 border border-red-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <motion.span
      className={cn(
        'inline-flex items-center justify-center font-mono font-medium rounded-full',
        variants[variant],
        sizes[size],
        glow && 'shadow-lg',
        variant === 'neon' && glow && 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
        className
      )}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity } : {}}
    >
      {children}
    </motion.span>
  );
}

export default CyberBadge;
