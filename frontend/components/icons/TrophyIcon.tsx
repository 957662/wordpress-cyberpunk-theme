'use client';

import React from 'react';

export interface TrophyIconProps {
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

export const TrophyIcon: React.FC<TrophyIconProps> = ({
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
        <filter id="trophy-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 奖杯杯身 */}
      <path
        d="M8 21H16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#trophy-glow)"
      />

      <path
        d="M12 21V17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#trophy-glow)"
      />

      <path
        d="M12 17C8 17 5 15 5 11C5 9 6 7 7 5H17C18 7 19 9 19 11C19 15 16 17 12 17Z"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(240, 255, 0, 0.1)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#trophy-glow)"
      />

      {/* 奖杯把手 */}
      <path
        d="M7 5V3H17V5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#trophy-glow)"
      />

      <path
        d="M5 8C3.5 8 2 9 2 11C2 13 3.5 14 5 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#trophy-glow)"
      />

      <path
        d="M19 8C20.5 8 22 9 22 11C22 13 20.5 14 19 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#trophy-glow)"
      />

      {/* 星星装饰 */}
      <path
        d="M12 7L13 9H15L13.5 10.5L14 12.5L12 11.5L10 12.5L10.5 10.5L9 9H11L12 7Z"
        fill={color}
        filter="url(#trophy-glow)"
      />
    </svg>
  );
};

export default TrophyIcon;
