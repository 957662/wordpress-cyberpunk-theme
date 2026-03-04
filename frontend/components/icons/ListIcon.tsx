'use client';

import React from 'react';

export interface ListIconProps {
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

export const ListIcon: React.FC<ListIconProps> = ({
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
        <filter id="list-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 列表线 */}
      <line
        x1="8"
        y1="6"
        x2="21"
        y2="6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#list-glow)"
      />

      <line
        x1="8"
        y1="12"
        x2="21"
        y2="12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#list-glow)"
      />

      <line
        x1="8"
        y1="18"
        x2="21"
        y2="18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#list-glow)"
      />

      {/* 列表点 */}
      <circle
        cx="4"
        cy="6"
        r="1.5"
        fill={color}
        filter="url(#list-glow)"
      />

      <circle
        cx="4"
        cy="12"
        r="1.5"
        fill={color}
        filter="url(#list-glow)"
      />

      <circle
        cx="4"
        cy="18"
        r="1.5"
        fill={color}
        filter="url(#list-glow)"
      />
    </svg>
  );
};

export default ListIcon;
