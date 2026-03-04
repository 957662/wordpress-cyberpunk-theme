'use client';

import React from 'react';

export interface TargetIconProps {
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

export const TargetIcon: React.FC<TargetIconProps> = ({
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
        <filter id="target-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 外圈 */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter="url(#target-glow)"
      />

      {/* 中圈 */}
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(0, 240, 255, 0.1)"
        filter="url(#target-glow)"
      />

      {/* 内圈 */}
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(0, 240, 255, 0.2)"
        filter="url(#target-glow)"
      />

      {/* 中心点 */}
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill={color}
        filter="url(#target-glow)"
      />

      {/* 十字线 */}
      <line
        x1="12"
        y1="0"
        x2="12"
        y2="4"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="12"
        y1="20"
        x2="12"
        y2="24"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="0"
        y1="12"
        x2="4"
        y2="12"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="20"
        y1="12"
        x2="24"
        y2="12"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.5"
      />
    </svg>
  );
};

export default TargetIcon;
