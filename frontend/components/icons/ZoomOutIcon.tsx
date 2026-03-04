'use client';

import React from 'react';

export interface ZoomOutIconProps {
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

export const ZoomOutIcon: React.FC<ZoomOutIconProps> = ({
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
        <filter id="zoom-out-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 放大镜圆圈 */}
      <circle
        cx="11"
        cy="11"
        r="8"
        stroke={color}
        strokeWidth="1.5"
        filter="url(#zoom-out-glow)"
      />

      {/* 减号 */}
      <line
        x1="8"
        y1="11"
        x2="14"
        y2="11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#zoom-out-glow)"
      />

      {/* 放大镜手柄 */}
      <line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#zoom-out-glow)"
      />

      {/* 装饰点 */}
      <circle cx="21" cy="21" r="1" fill={color} filter="url(#zoom-out-glow)" />
    </svg>
  );
};

export default ZoomOutIcon;
