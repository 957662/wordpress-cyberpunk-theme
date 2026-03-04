'use client';

import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'neon' | 'holographic' | 'glass';
  hover?: boolean;
  glow?: boolean;
  scanLine?: boolean;
  cornerAccent?: boolean;
}

export const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      hover = true,
      glow = false,
      scanLine = false,
      cornerAccent = true,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'relative overflow-hidden rounded-lg border bg-white/5 backdrop-blur-sm';

    const variantStyles = {
      default: 'border-white/10',
      neon: 'border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]',
      holographic: 'border-cyber-purple/50 shadow-[0_0_20px_rgba(157,0,255,0.2)]',
      glass: 'border-white/20 bg-white/10 backdrop-blur-md',
    };

    const hoverStyles = hover
      ? 'transition-all duration-300 hover:border-cyber-cyan/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]'
      : '';

    const MotionDiv = motion.div;

    return (
      <MotionDiv
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          hoverStyles,
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { scale: 1.02 } : {}}
        {...props}
      >
        {cornerAccent && (
          <>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan/50 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan/50 rounded-br-lg" />
          </>
        )}

        {scanLine && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent h-[2px] animate-scan" />
          </div>
        )}

        {glow && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 via-transparent to-cyber-purple/10 rounded-lg blur-xl" />
          </div>
        )}

        <div className="relative z-10">{children}</div>
      </MotionDiv>
    );
  }
);

CyberCard.displayName = 'CyberCard';
