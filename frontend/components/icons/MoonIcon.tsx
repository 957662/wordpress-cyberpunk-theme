'use client';

import React from 'react';

export interface MoonIconProps {
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

export const MoonIcon: React.FC<MoonIconProps> = ({
  size = 24,
  variant = 'purple',
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
        <filter id="moon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 月亮 */}
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(157, 0, 255, 0.2)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#moon-glow)"
      />

      {/* 星星装饰 */}
      <circle cx="17" cy="5" r="0.8" fill={color} filter="url(#moon-glow)" />
      <circle cx="19" cy="8" r="0.5" fill={color} opacity="0.6" />
      <circle cx="5" cy="18" r="0.6" fill={color} opacity="0.5" />
    </svg>
  );
};

export default MoonIcon;
