'use client';

import { motion } from 'framer-motion';

interface GradientTextProps {
  children: string;
  colors?: string[];
  animate?: boolean;
  className?: string;
}

export default function GradientText({
  children,
  colors = ['#00f0ff', '#9d00ff', '#ff0080'],
  animate = true,
  className = '',
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={gradientStyle}
      animate={
        animate
          ? {
              backgroundPosition: ['0%', '100%', '0%'],
            }
          : {}
      }
      transition={
        animate
          ? {
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }
          : {}
      }
    >
      {children}
    </motion.span>
  );
}
