'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberGlowProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  animated?: boolean;
}

export function CyberGlow({
  children,
  color = 'cyan',
  intensity = 'medium',
  className = '',
  animated = false,
}: CyberGlowProps) {
  const colorMap = {
    cyan: {
      shadow: '0 0 20px rgba(0, 240, 255, 0.5)',
      textShadow: '0 0 10px rgba(0, 240, 255, 0.8)',
      borderColor: 'border-cyber-cyan',
    },
    purple: {
      shadow: '0 0 20px rgba(157, 0, 255, 0.5)',
      textShadow: '0 0 10px rgba(157, 0, 255, 0.8)',
      borderColor: 'border-cyber-purple',
    },
    pink: {
      shadow: '0 0 20px rgba(255, 0, 128, 0.5)',
      textShadow: '0 0 10px rgba(255, 0, 128, 0.8)',
      borderColor: 'border-cyber-pink',
    },
    yellow: {
      shadow: '0 0 20px rgba(240, 255, 0, 0.5)',
      textShadow: '0 0 10px rgba(240, 255, 0, 0.8)',
      borderColor: 'border-cyber-yellow',
    },
  };

  const intensityMap = {
    low: 0.3,
    medium: 0.5,
    high: 0.8,
  };

  const styles = colorMap[color];
  const opacity = intensityMap[intensity];

  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? {
        initial: { boxShadow: styles.shadow },
        animate: {
          boxShadow: [
            styles.shadow,
            `0 0 ${30 * opacity}px rgba(${color === 'cyan' ? '0, 240, 255' : color === 'purple' ? '157, 0, 255' : color === 'pink' ? '255, 0, 128' : '240, 255, 0'}, ${opacity * 1.2})`,
            styles.shadow,
          ],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  return (
    <Wrapper
      className={cn('relative', className)}
      style={{
        boxShadow: styles.shadow,
      }}
      {...wrapperProps}
    >
      {children}
    </Wrapper>
  );
}

export default CyberGlow;
