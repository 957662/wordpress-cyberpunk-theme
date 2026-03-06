'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  backgroundColor?: string;
  showValue?: boolean;
  label?: string;
  className?: string;
}

const colorClasses = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  green: '#00ff88',
  yellow: '#f0ff00',
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  backgroundColor = '#1a1a2e',
  showValue = true,
  label,
  className,
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  const strokeColor = colorClasses[color];

  // Calculate SVG properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex', className)} style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />

        {/* Glow Effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference - (percentage / 100) * circumference,
            filter: `blur(8px)`,
            opacity: 0.5,
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            {Math.round(percentage)}%
          </motion.span>
        )}
        {label && (
          <span className="text-sm text-gray-400 mt-1">{label}</span>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: strokeColor }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: strokeColor }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>
    </div>
  );
};

export default CircularProgress;
