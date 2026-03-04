'use client';

import React from 'react';

export interface MoreVerticalIconProps {
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

export const MoreVerticalIcon: React.FC<MoreVerticalIconProps> = ({
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
        <filter id="more-v-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 三个垂直点 */}
      <circle
        cx="12"
        cy="5"
        r="2"
        fill={color}
        filter="url(#more-v-glow)"
      />

      <circle
        cx="12"
        cy="12"
        r="2"
        fill={color}
        filter="url(#more-v-glow)"
      />

      <circle
        cx="12"
        cy="19"
        r="2"
        fill={color}
        filter="url(#more-v-glow)"
      />

      {/* 装饰线 */}
      <path
        d="M15 5 L19 5"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      <path
        d="M15 12 L19 12"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      <path
        d="M15 19 L19 19"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MoreVerticalIcon;
