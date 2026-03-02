'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CyberCardProps {
  children: ReactNode;
  variant?: 'default' | 'neon' | 'holographic' | 'glass';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function CyberCard({
  children,
  variant = 'default',
  color = 'cyan',
  size = 'md',
  className = '',
  hover = true,
  clickable = false,
  onClick,
}: CyberCardProps) {
  const colorMap = {
    cyan: {
      border: 'border-cyber-cyan',
      shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
      text: 'text-cyber-cyan',
    },
    purple: {
      border: 'border-cyber-purple',
      shadow: 'shadow-[0_0_20px_rgba(157,0,255,0.3)]',
      text: 'text-cyber-purple',
    },
    pink: {
      border: 'border-cyber-pink',
      shadow: 'shadow-[0_0_20px_rgba(255,0,128,0.3)]',
      text: 'text-cyber-pink',
    },
    yellow: {
      border: 'border-cyber-yellow',
      shadow: 'shadow-[0_0_20px_rgba(240,255,0,0.3)]',
      text: 'text-cyber-yellow',
    },
  };

  const sizeMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: `bg-cyber-card border border-cyber-border`,
    neon: `bg-cyber-card ${colorMap[color].border} ${colorMap[color].shadow}`,
    holographic: `bg-gradient-to-br from-cyber-card to-cyber-muted border border-cyber-border relative overflow-hidden`,
    glass: `bg-cyber-card/60 backdrop-blur-md border border-cyber-border/50`,
  };

  const cardContent = (
    <>
      {variant === 'holographic' && (
        <>
          {/* 全息背景 */}
          <div className="absolute inset-0 bg-[url('/patterns/holographic.svg')] opacity-10" />
          {/* 扫描线 */}
          <div className="absolute inset-0 bg-[url('/patterns/scanlines.svg')] opacity-5 pointer-events-none" />
        </>
      )}
      <div className={`relative z-10 ${sizeMap[size]}`}>{children}</div>
    </>
  );

  const baseClasses = cn(
    'rounded-xl transition-all duration-300',
    variantStyles[variant],
    sizeMap[size],
    clickable && 'cursor-pointer',
    className
  );

  if (clickable || onClick) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={hover ? { scale: 1.02, y: -5 } : {}}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
    >
      {cardContent}
    </motion.div>
  );
}

export default CyberCard;
