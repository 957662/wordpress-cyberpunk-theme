/**
 * Glitch Text Effect
 *
 * Cyberpunk-style glitch text animation
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlitchTextProps {
  text: string;
  className?: string;
  speed?: number;
  intensity?: 'low' | 'medium' | 'high';
}

const intensityMap = {
  low: { displacement: 2, duration: 0.3 },
  medium: { displacement: 4, duration: 0.2 },
  high: { displacement: 8, duration: 0.1 },
};

export function GlitchText({
  text,
  className,
  speed = 2000,
  intensity = 'medium',
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const config = intensityMap[intensity];

  const handleMouseEnter = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), config.duration * 1000);
  };

  return (
    <motion.span
      className={cn('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      animate={isGlitching ? 'glitch' : 'normal'}
      variants={{
        normal: { x: 0, y: 0 },
        glitch: {
          x: [0, -config.displacement, config.displacement, -config.displacement, 0],
          y: [0, config.displacement, -config.displacement, config.displacement, 0],
        },
      }}
      transition={{ duration: config.duration }}
    >
      {text}
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-cyber-cyan opacity-50"
            style={{ transform: `translate(-${config.displacement}px, ${config.displacement}px)` }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-cyber-pink opacity-50"
            style={{ transform: `translate(${config.displacement}px, -${config.displacement}px)` }}
          >
            {text}
          </span>
        </>
      )}
    </motion.span>
  );
}
