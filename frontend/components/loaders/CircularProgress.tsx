/**
 * CircularProgress - 环形进度条
 * 圆形进度指示器
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useEffect, useState } from 'react';

export interface CircularProgressProps {
  progress?: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function CircularProgress({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  className,
  showPercentage = true,
  animated = true,
}: CircularProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const duration = 1000;
      const steps = 60;
      const increment = progress / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= progress) {
          setDisplayProgress(progress);
          clearInterval(timer);
        } else {
          setDisplayProgress(current);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const colors = {
    cyan: {
      stroke: '#00f0ff',
      shadow: 'shadow-neon-cyan',
    },
    purple: {
      stroke: '#9d00ff',
      shadow: 'shadow-neon-purple',
    },
    pink: {
      stroke: '#ff0080',
      shadow: 'shadow-neon-pink',
    },
    yellow: {
      stroke: '#f0ff00',
      shadow: 'shadow-neon-yellow',
    },
    green: {
      stroke: '#00ff88',
      shadow: 'shadow-[0_0_10px_#00ff88]',
    },
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayProgress / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* SVG 进度环 */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2a2a4a"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* 进度圆环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color].stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: animated ? 1 : 0 }}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 6px ${colors[color].stroke})`,
          }}
        />
      </svg>

      {/* 百分比文本 */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'text-2xl font-bold font-display',
              color === 'cyan' && 'text-cyber-cyan',
              color === 'purple' && 'text-cyber-purple',
              color === 'pink' && 'text-cyber-pink',
              color === 'yellow' && 'text-cyber-yellow',
              color === 'green' && 'text-cyber-green'
            )}
          >
            {Math.round(displayProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}
