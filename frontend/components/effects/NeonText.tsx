'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonTextProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  flicker?: boolean;
}

export function NeonText({
  children,
  color = 'cyan',
  size = 'md',
  className = '',
  flicker = false,
}: NeonTextProps) {
  const colorMap = {
    cyan: {
      textShadow:
        '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
      color: 'text-cyber-cyan',
    },
    purple: {
      textShadow:
        '0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 40px #9d00ff',
      color: 'text-cyber-purple',
    },
    pink: {
      textShadow:
        '0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 40px #ff0080',
      color: 'text-cyber-pink',
    },
    yellow: {
      textShadow:
        '0 0 5px #f0ff00, 0 0 10px #f0ff00, 0 0 20px #f0ff00, 0 0 40px #f0ff00',
      color: 'text-cyber-yellow',
    },
  };

  const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const styles = colorMap[color];
  const sizeClass = sizeMap[size];

  const Wrapper = flicker ? motion.span : 'span';
  const wrapperProps = flicker
    ? {
        animate: {
          opacity: [1, 0.8, 1, 0.9, 1],
        },
        transition: {
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: Math.random() * 2,
        },
      }
    : {};

  return (
    <Wrapper
      className={cn(
        'font-bold',
        styles.color,
        sizeClass,
        className
      )}
      style={{
        textShadow: styles.textShadow,
      }}
      {...wrapperProps}
    >
      {children}
    </Wrapper>
  );
}

export default NeonText;
