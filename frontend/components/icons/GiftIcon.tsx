'use client';

import React from 'react';

export interface GiftIconProps {
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

export const GiftIcon: React.FC<GiftIconProps> = ({
  size = 24,
  variant = 'pink',
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
        <filter id="gift-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 礼物盒 */}
      <rect
        x="3"
        y="8"
        width="18"
        height="13"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(255, 0, 128, 0.1)"
        filter="url(#gift-glow)"
      />

      {/* 礼物盖 */}
      <path
        d="M3 8C3 6.34315 4.34315 5 6 5H18C19.6569 5 21 6.34315 21 8V8H3V8Z"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(255, 0, 128, 0.2)"
        filter="url(#gift-glow)"
      />

      {/* 丝带竖线 */}
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="21"
        stroke={color}
        strokeWidth="1.5"
        filter="url(#gift-glow)"
      />

      {/* 丝带横线 */}
      <line
        x1="3"
        y1="11"
        x2="21"
        y2="11"
        stroke={color}
        strokeWidth="1.5"
        filter="url(#gift-glow)"
      />

      {/* 蝴蝶结左 */}
      <path
        d="M12 5C12 5 10.5 3.5 8.5 3.5C6.5 3.5 5.5 5 5.5 6C5.5 7 6.5 8 8 8L12 5Z"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(255, 0, 128, 0.2)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#gift-glow)"
      />

      {/* 蝴蝶结右 */}
      <path
        d="M12 5C12 5 13.5 3.5 15.5 3.5C17.5 3.5 18.5 5 18.5 6C18.5 7 17.5 8 16 8L12 5Z"
        stroke={color}
        strokeWidth="1.5"
        fill="rgba(255, 0, 128, 0.2)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#gift-glow)"
      />

      {/* 装饰点 */}
      <circle cx="12" cy="5" r="1" fill={color} filter="url(#gift-glow)" />
    </svg>
  );
};

export default GiftIcon;
