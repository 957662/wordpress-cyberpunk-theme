'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  border?: boolean;
  variant?: 'default' | 'gradient' | 'glass';
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  glow = true,
  border = true,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-gray-900 to-gray-800',
    glass: 'bg-gray-900/50 backdrop-blur-md',
  };

  const borderClasses = border
    ? 'border-cyan-500/20'
    : '';

  const glowClasses = glow
    ? 'hover:shadow-lg hover:shadow-cyan-500/20'
    : 'hover:shadow-xl';

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={cn(
        'relative overflow-hidden rounded-xl transition-all duration-300',
        variantClasses[variant],
        borderClasses && borderClasses,
        hover && glowClasses,
        hover && 'hover:border-cyan-400/50',
        className
      )}
    >
      {/* 背景动画效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {/* 扫描线效果 */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,240,255,0.03)_50%,transparent_100%)] bg-[length:100%_4px] opacity-50" />

      {/* 内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
