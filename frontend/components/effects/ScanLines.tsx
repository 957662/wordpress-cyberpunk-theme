'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface ScanLinesProps {
  className?: string;
  opacity?: number;
  speed?: number;
  color?: string;
  animated?: boolean;
}

export function ScanLines({
  className,
  opacity = 0.1,
  speed = 8,
  color = '#00f0ff',
  animated = true,
}: ScanLinesProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
      style={{ opacity }}
    >
      {/* Static lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${color}10 2px,
            ${color}10 4px
          )`,
        }}
      />

      {/* Moving scan line */}
      {animated && (
        <motion.div
          className="absolute inset-x-0 h-px"
          style={{ backgroundColor: color }}
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}

export function CRTScreen({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <ScanLines opacity={0.15} speed={10} />
      <div className="relative">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}

export default ScanLines;
