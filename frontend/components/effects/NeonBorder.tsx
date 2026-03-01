/**
 * 霓虹边框效果
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NeonBorderProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  animate?: boolean;
}

export function NeonBorder({
  children,
  color = 'cyan',
  intensity = 'medium',
  className,
  animate = true,
}: NeonBorderProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const intensities = {
    low: { blur: '10px', spread: '5px', opacity: 0.3 },
    medium: { blur: '20px', spread: '10px', opacity: 0.5 },
    high: { blur: '30px', spread: '15px', opacity: 0.7 },
  };

  const colorValue = colors[color];
  const { blur, spread, opacity } = intensities[intensity];

  return (
    <motion.div
      className={cn('relative', className)}
      style={{
        boxShadow: animate
          ? `0 0 ${blur} ${spread} ${colorValue}`
          : `0 0 ${blur} ${spread} ${colorValue}`,
      }}
      animate={
        animate
          ? {
              boxShadow: [
                `0 0 ${blur} ${spread} ${colorValue}`,
                `0 0 ${parseInt(blur) + 10}px ${spread} ${colorValue}`,
                `0 0 ${blur} ${spread} ${colorValue}`,
              ],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
