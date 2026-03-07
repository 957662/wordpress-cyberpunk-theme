'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberCardProps {
  children: React.ReactNode;
  variant?: 'neon' | 'hologram' | 'glass' | 'minimal';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  variant = 'neon',
  padding = 'md',
  hover = true,
  glow = false,
  className,
  onClick,
}) => {
  const baseStyles = 'relative overflow-hidden rounded-lg backdrop-blur-sm transition-all duration-300';

  const variantStyles = {
    neon: cn(
      'bg-gradient-to-br from-[#0a0a0f] to-[#16162a]',
      'border border-cyber-cyan/30',
      hover && 'hover:border-cyber-cyan/60',
      glow && 'shadow-[0_0_30px_rgba(0,240,255,0.2)]'
    ),
    hologram: cn(
      'bg-gradient-to-br from-cyber-purple/10 to-cyber-cyan/10',
      'border border-cyber-purple/30',
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyber-purple/20 before:to-transparent before:opacity-0',
      hover && 'hover:border-cyber-purple/60 hover:before:opacity-100'
    ),
    glass: cn(
      'bg-white/5 dark:bg-black/50',
      'border border-white/10 dark:border-white/5',
      'shadow-lg'
    ),
    minimal: cn(
      'bg-gray-900/50',
      'border border-gray-800',
      hover && 'hover:border-gray-700'
    ),
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Scanlines overlay */}
      <div className="absolute inset-0 bg-[url('/public/patterns/scanlines.svg')] opacity-5 pointer-events-none" />

      {/* Glowing border effect */}
      {glow && (
        <div className={cn(
          'absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300',
          'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink',
          'group-hover:opacity-20 blur-md -z-10'
        )} />
      )}

      {/* Corner decorations */}
      {variant === 'neon' && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan/50" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan/50" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan/50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan/50" />
        </>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

export default CyberCard;
