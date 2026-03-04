'use client';

import React from 'react';

export interface AboutIconProps {
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

export const AboutIcon: React.FC<AboutIconProps> = ({
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
        <filter id="about-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 信息圆圈 */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter="url(#about-glow)"
      />

      {/* 字母 i */}
      <circle
        cx="12"
        cy="7"
        r="1.5"
        fill={color}
        filter="url(#about-glow)"
      />

      {/* i 的点 */}
      <path
        d="M12 10.5 L12 16.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#about-glow)"
      />

      {/* 装饰点 */}
      <circle
        cx="17"
        cy="17"
        r="1"
        fill={color}
        opacity="0.5"
      />
      <circle
        cx="7"
        cy="17"
        r="1"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
};

export default AboutIcon;
