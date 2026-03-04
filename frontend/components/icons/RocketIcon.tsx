'use client';

import React from 'react';

export interface RocketIconProps {
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

export const RocketIcon: React.FC<RocketIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-bounce' : '';

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
        <filter id="rocket-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 火箭主体 */}
      <path
        d="M4.5 16.5C4.5 16.5 6 15.5 8 15.5C10 15.5 11 17 12 17C13 17 14 15.5 16 15.5C18 15.5 19.5 16.5 19.5 16.5C19.5 16.5 18 21 12 21C6 21 4.5 16.5 4.5 16.5Z"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(0, 240, 255, 0.1)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#rocket-glow)"
      />

      {/* 火箭身体 */}
      <path
        d="M12 2L12 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#rocket-glow)"
      />

      <path
        d="M12 2C12 2 7 7 7 12C7 14 8 15.5 8 15.5C8 15.5 9.5 14 12 14C14.5 14 16 15.5 16 15.5C16 15.5 17 14 17 12C17 7 12 2 12 2Z"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(0, 240, 255, 0.1)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#rocket-glow)"
      />

      {/* 火箭窗 */}
      <circle
        cx="12"
        cy="9"
        r="2"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(0, 240, 255, 0.2)"
        filter="url(#rocket-glow)"
      />

      {/* 火焰 */}
      <path
        d="M10 18C10 18 9 20 9 21C9 22 10.5 23 12 23C13.5 23 15 22 15 21C15 20 14 18 14 18"
        stroke="#ff0080"
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#rocket-glow)"
      />
    </svg>
  );
};

export default RocketIcon;
