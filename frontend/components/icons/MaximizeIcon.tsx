'use client';

import React from 'react';

export interface MaximizeIconProps {
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

export const MaximizeIcon: React.FC<MaximizeIconProps> = ({
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
        <filter id="maximize-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 箭头向外 */}
      <path
        d="M15 3H21V9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#maximize-glow)"
      />

      <path
        d="M9 21H3V15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#maximize-glow)"
      />

      <path
        d="M21 3L14 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#maximize-glow)"
      />

      <path
        d="M3 21L10 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#maximize-glow)"
      />

      {/* 装饰点 */}
      <circle cx="12" cy="12" r="1" fill={color} opacity="0.5" filter="url(#maximize-glow)" />
    </svg>
  );
};

export default MaximizeIcon;
