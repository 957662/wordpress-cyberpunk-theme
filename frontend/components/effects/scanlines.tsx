'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ScanlinesProps {
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

export const Scanlines: React.FC<ScanlinesProps> = ({
  className = '',
  color = 'cyan',
  intensity = 'medium',
  animated = true,
}) => {
  const colors = {
    cyan: 'rgba(0, 240, 255',
    purple: 'rgba(157, 0, 255',
    pink: 'rgba(255, 0, 128',
    green: 'rgba(0, 255, 136',
  };

  const intensityValues = {
    low: 0.03,
    medium: 0.05,
    high: 0.08,
  };

  const opacity = intensityValues[intensity];
  const baseColor = colors[color];

  return (
    <motion.div
      className={cn('fixed inset-0 pointer-events-none z-50', className)}
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          ${baseColor}, ${opacity}) 2px,
          ${baseColor}, ${opacity}) 4px
        )`,
      }}
      animate={
        animated
          ? {
              backgroundPosition: ['0px 0px', '0px 4px', '0px 0px'],
            }
          : {}
      }
      transition={
        animated
          ? {
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }
          : {}
      }
    />
  );
};

export default Scanlines;
