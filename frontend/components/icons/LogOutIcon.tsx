'use client';

import React from 'react';

export interface LogOutIconProps {
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

export const LogOutIcon: React.FC<LogOutIconProps> = ({
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
        <filter id="logout-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 路径 */}
      <path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logout-glow)"
      />

      {/* 箭头 */}
      <path
        d="M16 9L21 12L16 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logout-glow)"
      />

      <path
        d="M21 12H9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#logout-glow)"
      />

      {/* 装饰点 */}
      <circle cx="21" cy="12" r="1" fill={color} filter="url(#logout-glow)" />
    </svg>
  );
};

export default LogOutIcon;
