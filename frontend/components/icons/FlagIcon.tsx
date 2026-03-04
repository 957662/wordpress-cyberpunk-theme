'use client';

import React from 'react';

export interface FlagIconProps {
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

export const FlagIcon: React.FC<FlagIconProps> = ({
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
        <filter id="flag-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 旗杆 */}
      <path
        d="M4 22V4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#flag-glow)"
      />

      {/* 旗面 */}
      <path
        d="M4 4H16L20 8L16 12H4V4Z"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(0, 240, 255, 0.1)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#flag-glow)"
      />

      {/* 旗面装饰 */}
      <path
        d="M8 4V12"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.3"
      />

      <path
        d="M12 4V12"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.3"
      />

      {/* 装饰点 */}
      <circle cx="4" cy="22" r="1.5" fill={color} filter="url(#flag-glow)" />
      <circle cx="4" cy="4" r="1.5" fill={color} filter="url(#flag-glow)" />
    </svg>
  );
};

export default FlagIcon;
