'use client';

import React from 'react';

export interface SparkleIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};

export const SparkleIcon: React.FC<SparkleIconProps> = ({
  size = 24,
  variant = 'yellow',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-spin-slow' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id="sparkle-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 主星芒 */}
      <path
        d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
        fill={color}
        filter="url(#sparkle-glow)"
      />

      {/* 小星芒 */}
      <circle cx="12" cy="12" r="3" fill={color} opacity="0.6" filter="url(#sparkle-glow)" />
    </svg>
  );
};

export default SparkleIcon;
