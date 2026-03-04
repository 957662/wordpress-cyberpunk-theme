'use client';

import React from 'react';

export interface MedalIconProps {
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

export const MedalIcon: React.FC<MedalIconProps> = ({
  size = 24,
  variant = 'yellow',
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
        <filter id="medal-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 奖章丝带 */}
      <path
        d="M12 2L12 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#medal-glow)"
      />

      <path
        d="M8 2L8 6L12 8L16 6L16 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(240, 255, 0, 0.2)"
        filter="url(#medal-glow)"
      />

      {/* 奖章圆圈 */}
      <circle
        cx="12"
        cy="15"
        r="6"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(240, 255, 0, 0.1)"
        filter="url(#medal-glow)"
      />

      {/* 内圈装饰 */}
      <circle
        cx="12"
        cy="15"
        r="4"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
        filter="url(#medal-glow)"
      />

      {/* 星星 */}
      <path
        d="M12 12L12.75 13.5H14.25L13.125 14.4375L13.625 16L12 15.0625L10.375 16L10.875 14.4375L9.75 13.5H11.25L12 12Z"
        fill={color}
        filter="url(#medal-glow)"
      />
    </svg>
  );
};

export default MedalIcon;
