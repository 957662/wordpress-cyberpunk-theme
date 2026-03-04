'use client';

import React from 'react';

export interface FireIconProps {
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

export const FireIcon: React.FC<FireIconProps> = ({
  size = 24,
  variant = 'pink',
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
        <filter id="fire-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff0080" stopOpacity="1" />
          <stop offset="50%" stopColor="#ff8000" stopOpacity="1" />
          <stop offset="100%" stopColor="#f0ff00" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* 火焰主体 */}
      <path
        d="M8.5 14.5C8.5 14.5 9 12 12 12C15 12 15.5 14.5 15.5 14.5C15.5 14.5 17 16 17 18C17 20 15 22 12 22C9 22 7 20 7 18C7 16 8.5 14.5 8.5 14.5Z"
        stroke="url(#fireGradient)"
        strokeWidth="1.5"
        fill="rgba(255, 0, 128, 0.1)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#fire-glow)"
      />

      {/* 内部火焰 */}
      <path
        d="M12 2C12 2 8 6 8 10C8 12 9 13 10 13C10 13 9 11 10 9C11 7 12 6 12 6C12 6 13 7 14 9C15 11 14 13 14 13C15 13 16 12 16 10C16 6 12 2 12 2Z"
        fill="url(#fireGradient)"
        filter="url(#fire-glow)"
      />

      {/* 装饰点 */}
      <circle cx="12" cy="18" r="1.5" fill="#ff0080" filter="url(#fire-glow)" />
    </svg>
  );
};

export default FireIcon;
