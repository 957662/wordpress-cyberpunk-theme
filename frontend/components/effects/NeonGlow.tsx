'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonGlowProps {
  children: ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  animate?: boolean;
}

const colorStyles = {
  cyan: {
    shadow: '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3), 0 0 60px rgba(0, 240, 255, 0.1)',
    textShadow: '0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.3)',
  },
  purple: {
    shadow: '0 0 20px rgba(157, 0, 255, 0.5), 0 0 40px rgba(157, 0, 255, 0.3), 0 0 60px rgba(157, 0, 255, 0.1)',
    textShadow: '0 0 10px rgba(157, 0, 255, 0.8), 0 0 20px rgba(157, 0, 255, 0.5), 0 0 30px rgba(157, 0, 255, 0.3)',
  },
  pink: {
    shadow: '0 0 20px rgba(255, 0, 128, 0.5), 0 0 40px rgba(255, 0, 128, 0.3), 0 0 60px rgba(255, 0, 128, 0.1)',
    textShadow: '0 0 10px rgba(255, 0, 128, 0.8), 0 0 20px rgba(255, 0, 128, 0.5), 0 0 30px rgba(255, 0, 128, 0.3)',
  },
  yellow: {
    shadow: '0 0 20px rgba(240, 255, 0, 0.5), 0 0 40px rgba(240, 255, 0, 0.3), 0 0 60px rgba(240, 255, 0, 0.1)',
    textShadow: '0 0 10px rgba(240, 255, 0, 0.8), 0 0 20px rgba(240, 255, 0, 0.5), 0 0 30px rgba(240, 255, 0, 0.3)',
  },
};

const intensityModifiers = {
  low: { scale: 0.5 },
  medium: { scale: 1 },
  high: { scale: 1.5 },
};

export default function NeonGlow({
  children,
  color = 'cyan',
  intensity = 'medium',
  className = '',
  animate = true,
}: NeonGlowProps) {
  const styles = colorStyles[color];
  const modifier = intensityModifiers[intensity];

  return (
    <motion.div
      className={className}
      animate={
        animate
          ? {
              filter: [
                `brightness(1) drop-shadow(0 0 5px rgba(0, 240, 255, 0.3))`,
                `brightness(1.2) drop-shadow(0 0 20px rgba(0, 240, 255, 0.6))`,
                `brightness(1) drop-shadow(0 0 5px rgba(0, 240, 255, 0.3))`,
              ],
            }
          : {}
      }
      transition={
        animate
          ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : {}
      }
      style={
        !animate
          ? {
              boxShadow: styles.shadow,
              textShadow: styles.textShadow,
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
