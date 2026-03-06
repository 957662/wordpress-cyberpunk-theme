'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'neon' | 'glitch' | 'holographic';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  scanlines?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CyberCard = forwardRef<HTMLDivElement, CyberCardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      glow = false,
      scanlines = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-gray-900/50 border border-gray-700',
      neon: 'bg-black border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]',
      glitch: 'bg-purple-900/20 border border-purple-500',
      holographic: 'bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 border border-blue-400',
    };

    const sizes = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg backdrop-blur-sm',
          variants[variant],
          sizes[size],
          glow && 'shadow-lg shadow-cyan-500/20',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        {...props}
      >
        {/* 扫描线效果 */}
        {scanlines && (
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
                backgroundSize: '100% 4px',
              }}
            />
          </div>
        )}

        {/* 内容 */}
        <div className="relative z-10">{children}</div>

        {/* 发光边框效果 */}
        {variant === 'neon' && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
          </>
        )}
      </motion.div>
    );
  }
);

CyberCard.displayName = 'CyberCard';

export default CyberCard;
