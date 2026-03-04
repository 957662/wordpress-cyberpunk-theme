'use client';

import React from 'react';

export interface MinimizeIconProps {
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

export const MinimizeIcon: React.FC<MinimizeIconProps> = ({
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
        <filter id="minimize-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 箭头向内 */}
      <path
        d="M8 3V8C8 8.53043 7.78929 9.03914 7.41421 9.41421C7.03914 9.78929 6.53043 10 6 10H3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#minimize-glow)"
      />

      <path
        d="M21 8V3H16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#minimize-glow)"
      />

      <path
        d="M3 16V21H8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#minimize-glow)"
      />

      <path
        d="M16 21V16C16 15.4696 16.2107 14.9609 16.5858 14.5858C16.9609 14.2107 17.4696 14 18 14H21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#minimize-glow)"
      />

      {/* 装饰点 */}
      <circle cx="12" cy="12" r="1" fill={color} opacity="0.5" filter="url(#minimize-glow)" />
    </svg>
  );
};

export default MinimizeIcon;
