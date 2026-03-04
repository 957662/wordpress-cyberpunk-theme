'use client';

import React from 'react';

export interface GridIconProps {
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

export const GridIcon: React.FC<GridIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

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
        <filter id="grid-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 网格线 */}
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter="url(#grid-glow)"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter="url(#grid-glow)"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter="url(#grid-glow)"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter="url(#grid-glow)"
      />

      {/* 装饰点 */}
      <circle cx="10" cy="10" r="0.5" fill={color} opacity="0.5" />
      <circle cx="14" cy="10" r="0.5" fill={color} opacity="0.5" />
      <circle cx="10" cy="14" r="0.5" fill={color} opacity="0.5" />
      <circle cx="14" cy="14" r="0.5" fill={color} opacity="0.5" />
    </svg>
  );
};

export default GridIcon;
