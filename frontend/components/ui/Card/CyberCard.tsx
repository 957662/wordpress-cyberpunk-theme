'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'neon' | 'holographic';
  hover?: boolean;
  glow?: boolean;
  scanlines?: boolean;
  onClick?: () => void;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  glow = false,
  scanlines = false,
  onClick,
}) => {
  const baseStyles = 'relative overflow-hidden rounded-lg border bg-deep-black/80 backdrop-blur-sm';
  
  const variantStyles = {
    default: 'border-cyber-cyan/30',
    glass: 'border-white/10 bg-white/5 backdrop-blur-md',
    neon: 'border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    holographic: 'border-transparent bg-gradient-to-br from-cyber-cyan/10 via-cyber-purple/10 to-cyber-pink/10',
  };
  
  const hoverStyles = hover
    ? 'hover:border-cyber-cyan/60 hover:shadow-lg hover:shadow-cyber-cyan/20 transition-all duration-300'
    : '';
  
  const glowStyles = glow
    ? 'shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]'
    : '';

  return (
    <motion.div
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        glowStyles,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -4 } : {}}
    >
      {/* Scanlines Effect */}
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.1) 2px, rgba(0, 240, 255, 0.1) 4px)',
            }}
          />
        </div>
      )}
      
      {/* Glow Border */}
      {variant === 'neon' && (
        <div className="absolute inset-0 rounded-lg border border-cyber-cyan/50 animate-pulse" />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
      
      {/* Corner Decorations */}
      {(variant === 'default' || variant === 'neon') && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan" />
        </>
      )}
    </motion.div>
  );
};

export default CyberCard;
