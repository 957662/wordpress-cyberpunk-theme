'use client';

import React from 'react';

export interface AnchorIconProps {
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

export const AnchorIcon: React.FC<AnchorIconProps> = ({
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
        <filter id="anchor-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 锚环 */}
      <circle
        cx="12"
        cy="5"
        r="3"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter="url(#anchor-glow)"
      />

      {/* 锚杆 */}
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#anchor-glow)"
      />

      {/* 横杆 */}
      <line
        x1="6"
        y1="14"
        x2="18"
        y2="14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#anchor-glow)"
      />

      {/* 锚臂 */}
      <path
        d="M7 21C7 21 9 17 12 17C15 17 17 21 17 21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#anchor-glow)"
      />

      {/* 装饰点 */}
      <circle cx="6" cy="14" r="1" fill={color} filter="url(#anchor-glow)" />
      <circle cx="18" cy="14" r="1" fill={color} filter="url(#anchor-glow)" />
    </svg>
  );
};

export default AnchorIcon;
