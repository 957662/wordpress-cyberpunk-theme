'use client';

/**
 * Progress Bar Component
 * Animated progress bar with cyberpunk styling
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const COLOR_MAP = {
  cyan: 'bg-cyber-cyan',
  purple: 'bg-cyber-purple',
  pink: 'bg-cyber-pink',
  green: 'bg-cyber-green',
  yellow: 'bg-cyber-yellow',
};

const GLOW_MAP = {
  cyan: 'shadow-cyber-cyan/50',
  purple: 'shadow-cyber-purple/50',
  pink: 'shadow-cyber-pink/50',
  green: 'shadow-cyber-green/50',
  yellow: 'shadow-cyber-yellow/50',
};

const SIZE_MAP = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  color = 'cyan',
  size = 'md',
  showLabel = false,
  showPercentage = false,
  animated = true,
  striped = false,
  className = '',
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate progress on mount and value change
  useEffect(() => {
    if (animated) {
      const duration = 500;
      const steps = 60;
      const increment = (value - displayValue) / steps;
      let current = displayValue;

      const timer = setInterval(() => {
        current += increment;
        if (
          (increment > 0 && current >= value) ||
          (increment < 0 && current <= value)
        ) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated, displayValue]);

  // Calculate percentage
  const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

  return (
    <div className={className}>
      {/* Label Row */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-1">
          {showLabel && (
            <span className="text-sm text-gray-300">Progress</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={`relative w-full ${SIZE_MAP[size]} bg-gray-800 rounded-full overflow-hidden`}>
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.05) 50%)
              `,
              backgroundSize: '4px 100%',
            }}
          />
        </div>

        {/* Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
          className={`h-full ${COLOR_MAP[color]} ${GLOW_MAP[color]} relative overflow-hidden rounded-full`}
        >
          {/* Striped Pattern */}
          {striped && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.15) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.15) 50%,
                    rgba(255, 255, 255, 0.15) 75%,
                    transparent 75%,
                    transparent
                  )
                `,
                backgroundSize: '20px 20px',
              }}
            />
          )}

          {/* Animated Shine Effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>

        {/* Glow Effect */}
        {percentage > 0 && (
          <div
            className={`absolute top-0 bottom-0 w-1 ${COLOR_MAP[color]} blur-sm opacity-50`}
            style={{ left: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}
