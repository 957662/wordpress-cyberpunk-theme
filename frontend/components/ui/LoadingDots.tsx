'use client';

import { motion } from 'framer-motion';

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function LoadingDots({ size = 'md', color = '#00f0ff' }: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} rounded-full`}
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}
