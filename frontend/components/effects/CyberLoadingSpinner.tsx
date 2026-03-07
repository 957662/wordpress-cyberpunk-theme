'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HTMLMotionProps } from 'framer-motion';

interface CyberLoadingSpinnerProps extends HTMLMotionProps<'div'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  text?: string;
  showPercentage?: boolean;
  duration?: number;
}

const sizeMap = {
  sm: { width: 24, height: 24, borderWidth: 2 },
  md: { width: 48, height: 48, borderWidth: 3 },
  lg: { width: 72, height: 72, borderWidth: 4 },
  xl: { width: 96, height: 96, borderWidth: 5 },
};

const colorMap = {
  cyan: {
    primary: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.5)',
  },
  purple: {
    primary: '#9d00ff',
    glow: 'rgba(157, 0, 255, 0.5)',
  },
  pink: {
    primary: '#ff0080',
    glow: 'rgba(255, 0, 128, 0.5)',
  },
  green: {
    primary: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.5)',
  },
  yellow: {
    primary: '#f0ff00',
    glow: 'rgba(240, 255, 0, 0.5)',
  },
};

export function CyberLoadingSpinner({
  size = 'md',
  color = 'cyan',
  text,
  showPercentage = false,
  duration = 1.5,
  className = '',
  ...props
}: CyberLoadingSpinnerProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showPercentage) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [showPercentage]);

  const currentSize = sizeMap[size];
  const currentColor = colorMap[color];

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`} {...props}>
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: currentSize.width,
            height: currentSize.height,
            border: `${currentSize.borderWidth}px solid ${currentColor.glow}`,
            boxShadow: `0 0 20px ${currentColor.glow}`,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: currentSize.width * 0.75,
            height: currentSize.height * 0.75,
            left: (currentSize.width - currentSize.width * 0.75) / 2,
            top: (currentSize.height - currentSize.height * 0.75) / 2,
            border: `${currentSize.borderWidth - 1}px solid ${currentColor.glow}`,
            boxShadow: `0 0 15px ${currentColor.glow}`,
          }}
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            rotate: { duration: duration * 1.5, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: currentSize.width * 0.5,
            height: currentSize.height * 0.5,
            left: (currentSize.width - currentSize.width * 0.5) / 2,
            top: (currentSize.height - currentSize.height * 0.5) / 2,
            border: `${currentSize.borderWidth - 1}px solid ${currentColor.primary}`,
            boxShadow: `0 0 10px ${currentColor.primary}`,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: duration * 0.5, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          }}
        />

        {/* Center Dot */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: currentSize.width * 0.15,
            height: currentSize.height * 0.15,
            left: (currentSize.width - currentSize.width * 0.15) / 2,
            top: (currentSize.height - currentSize.height * 0.15) / 2,
            backgroundColor: currentColor.primary,
            boxShadow: `0 0 15px ${currentColor.primary}, 0 0 30px ${currentColor.primary}`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Loading Text */}
      {(text || showPercentage) && (
        <div className="flex flex-col items-center gap-2">
          {text && (
            <motion.p
              className="text-sm font-medium tracking-wider"
              style={{
                color: currentColor.primary,
                textShadow: `0 0 10px ${currentColor.glow}`,
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {text}
            </motion.p>
          )}

          {showPercentage && (
            <motion.div
              className="text-2xl font-bold"
              style={{
                color: currentColor.primary,
                textShadow: `0 0 10px ${currentColor.glow}`,
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {Math.round(progress)}%
            </motion.div>
          )}
        </div>
      )}

      {/* Progress Bar (if showing percentage) */}
      {showPercentage && (
        <div className="w-full max-w-xs mt-2">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{
              backgroundColor: `${currentColor.glow}20`,
              border: `1px solid ${currentColor.glow}40`,
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: currentColor.primary,
                boxShadow: `0 0 10px ${currentColor.primary}`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CyberLoadingSpinner;
