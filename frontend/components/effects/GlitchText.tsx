'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  speed?: number;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className,
  speed = 2,
  intensity = 'medium',
}) => {
  const intensityValues = {
    low: { x: 2, opacity: 0.8 },
    medium: { x: 4, opacity: 0.9 },
    high: { x: 8, opacity: 1 },
  };

  const values = intensityValues[intensity];

  return (
    <div className={cn('relative inline-block', className)}>
      <motion.span
        className="relative inline-block"
        animate={{
          x: [-values.x, values.x, -values.x],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <span className="absolute -left-0.5 top-0 text-cyber-cyan opacity-50">
          {text}
        </span>
        <span className="absolute left-0.5 top-0 text-cyber-pink opacity-50">
          {text}
        </span>
      </motion.span>
      <span className="relative z-10">{text}</span>
    </div>
  );
};

export default GlitchText;
