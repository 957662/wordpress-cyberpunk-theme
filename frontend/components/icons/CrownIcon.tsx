'use client';

import React from 'react';

export interface CrownIconProps {
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

export const CrownIcon: React.FC<CrownIconProps> = ({
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
        <filter id="crown-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 皇冠底座 */}
      <path
        d="M4 20H20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#crown-glow)"
      />

      {/* 皇冠主体 */}
      <path
        d="M2 20L6 12L10 17L14 10L18 17L22 20"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(240, 255, 0, 0.1)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#crown-glow)"
      />

      {/* 皇冠齿 */}
      <circle
        cx="6"
        cy="12"
        r="2"
        fill={color}
        filter="url(#crown-glow)"
      />

      <circle
        cx="14"
        cy="10"
        r="2"
        fill={color}
        filter="url(#crown-glow)"
      />

      <circle
        cx="18"
        cy="17"
        r="2"
        fill={color}
        filter="url(#crown-glow)"
      />

      {/* 装饰点 */}
      <circle cx="10" cy="17" r="1" fill={color} opacity="0.5" filter="url(#crown-glow)" />
      <circle cx="22" cy="20" r="1" fill={color} filter="url(#crown-glow)" />
    </svg>
  );
};

export default CrownIcon;
