'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NeonGlowProps {
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'orange';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  children: React.ReactNode;
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  className = '',
  color = 'cyan',
  intensity = 'medium',
  animated = true,
  children,
}) => {
  const glowColors = {
    cyan: {
      low: 'shadow-[0_0_5px_rgba(0,240,255,0.3),0_0_10px_rgba(0,240,255,0.2)]',
      medium: 'shadow-[0_0_10px_rgba(0,240,255,0.5),0_0_20px_rgba(0,240,255,0.3),0_0_30px_rgba(0,240,255,0.2)]',
      high: 'shadow-[0_0_15px_rgba(0,240,255,0.7),0_0_30px_rgba(0,240,255,0.5),0_0_45px_rgba(0,240,255,0.3)]',
    },
    purple: {
      low: 'shadow-[0_0_5px_rgba(157,0,255,0.3),0_0_10px_rgba(157,0,255,0.2)]',
      medium: 'shadow-[0_0_10px_rgba(157,0,255,0.5),0_0_20px_rgba(157,0,255,0.3),0_0_30px_rgba(157,0,255,0.2)]',
      high: 'shadow-[0_0_15px_rgba(157,0,255,0.7),0_0_30px_rgba(157,0,255,0.5),0_0_45px_rgba(157,0,255,0.3)]',
    },
    pink: {
      low: 'shadow-[0_0_5px_rgba(255,0,128,0.3),0_0_10px_rgba(255,0,128,0.2)]',
      medium: 'shadow-[0_0_10px_rgba(255,0,128,0.5),0_0_20px_rgba(255,0,128,0.3),0_0_30px_rgba(255,0,128,0.2)]',
      high: 'shadow-[0_0_15px_rgba(255,0,128,0.7),0_0_30px_rgba(255,0,128,0.5),0_0_45px_rgba(255,0,128,0.3)]',
    },
    green: {
      low: 'shadow-[0_0_5px_rgba(0,255,136,0.3),0_0_10px_rgba(0,255,136,0.2)]',
      medium: 'shadow-[0_0_10px_rgba(0,255,136,0.5),0_0_20px_rgba(0,255,136,0.3),0_0_30px_rgba(0,255,136,0.2)]',
      high: 'shadow-[0_0_15px_rgba(0,255,136,0.7),0_0_30px_rgba(0,255,136,0.5),0_0_45px_rgba(0,255,136,0.3)]',
    },
    yellow: {
      low: 'shadow-[0_0_5px_rgba(240,255,0,0.3),0_0_10px_rgba(240,255,0,0.2)]',
      medium: 'shadow-[0_0_10px_rgba(240,255,0,0.5),0_0_20px_rgba(240,255,0,0.3),0_0_30px_rgba(240,255,0,0.2)]',
      high: 'shadow-[0_0_15px_rgba(240,255,0,0.7),0_0_30px_rgba(240,255,0,0.5),0_0_45px_rgba(240,255,0,0.3)]',
    },
    orange: {
      low: 'shadow-[0_0_5px_rgba(255,102,0,0.3),0_0_10px_rgba(255,102,0,0.2)]',
      medium: 'shadow-[0_0_10px_rgba(255,102,0,0.5),0_0_20px_rgba(255,102,0,0.3),0_0_30px_rgba(255,102,0,0.2)]',
      high: 'shadow-[0_0_15px_rgba(255,102,0,0.7),0_0_30px_rgba(255,102,0,0.5),0_0_45px_rgba(255,102,0,0.3)]',
    },
  };

  const glowClass = glowColors[color][intensity];

  const Component = animated ? motion.div : 'div';

  return (
    <Component
      className={cn('transition-shadow duration-300', glowClass, className)}
      animate={
        animated
          ? {
              filter: [
                'brightness(1)',
                'brightness(1.1)',
                'brightness(1)',
              ],
            }
          : {}
      }
      transition={
        animated
          ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : {}
      }
    >
      {children}
    </Component>
  );
};

export default NeonGlow;
