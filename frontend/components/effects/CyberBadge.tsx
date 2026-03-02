'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CyberBadgeProps {
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'glow';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}

export function CyberBadge({
  children,
  variant = 'solid',
  color = 'cyan',
  size = 'md',
  className = '',
  dot = false,
  pulse = false,
}: CyberBadgeProps) {
  const colorMap = {
    cyan: {
      solid: 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/30',
      outline: 'bg-transparent text-cyber-cyan border-cyber-cyan',
      glow: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan shadow-neon-cyan',
    },
    purple: {
      solid: 'bg-cyber-purple/20 text-cyber-purple border-cyber-purple/30',
      outline: 'bg-transparent text-cyber-purple border-cyber-purple',
      glow: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple shadow-neon-purple',
    },
    pink: {
      solid: 'bg-cyber-pink/20 text-cyber-pink border-cyber-pink/30',
      outline: 'bg-transparent text-cyber-pink border-cyber-pink',
      glow: 'bg-cyber-pink/10 text-cyber-pink border-cyber-pink shadow-neon-pink',
    },
    yellow: {
      solid: 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/30',
      outline: 'bg-transparent text-cyber-yellow border-cyber-yellow',
      glow: 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow shadow-neon-yellow',
    },
    green: {
      solid: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30',
      outline: 'bg-transparent text-cyber-green border-cyber-green',
      glow: 'bg-cyber-green/10 text-cyber-green border-cyber-green shadow-[0_0_20px_rgba(0,255,136,0.5)]',
    },
    orange: {
      solid: 'bg-cyber-orange/20 text-cyber-orange border-cyber-orange/30',
      outline: 'bg-transparent text-cyber-orange border-cyber-orange',
      glow: 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange shadow-[0_0_20px_rgba(255,102,0,0.5)]',
    },
  };

  const sizeMap = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center gap-2 rounded-full border font-mono font-medium transition-all duration-300',
        colorMap[color][variant],
        sizeMap[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {dot && (
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            pulse && 'animate-pulse'
          )}
          style={{
            backgroundColor: color === 'cyan'
              ? '#00f0ff'
              : color === 'purple'
              ? '#9d00ff'
              : color === 'pink'
              ? '#ff0080'
              : color === 'yellow'
              ? '#f0ff00'
              : color === 'green'
              ? '#00ff88'
              : '#ff6600',
            boxShadow: `0 0 10px ${
              color === 'cyan'
                ? '#00f0ff'
                : color === 'purple'
                ? '#9d00ff'
                : color === 'pink'
                ? '#ff0080'
                : color === 'yellow'
                ? '#f0ff00'
                : color === 'green'
                ? '#00ff88'
                : '#ff6600'
            }`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

export default CyberBadge;
