'use client';

import React from 'react';

export interface PaperclipIconProps {
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

export const PaperclipIcon: React.FC<PaperclipIconProps> = ({
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
        <filter id="paperclip-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 回形针路径 */}
      <path
        d="M21.44 11.05L12.25 20.25C10.9879 21.5121 9.26549 22.2254 7.46997 22.2254C5.67445 22.2254 3.95206 21.5121 2.68997 20.25C1.42787 18.9879 0.714577 17.2655 0.714577 15.47C0.714577 13.6745 1.42787 11.9521 2.68997 10.69L11.59 1.79C12.44 0.94 13.59 0.5 14.75 0.5C15.91 0.5 17.06 0.94 17.91 1.79C18.76 2.64 19.2 3.79 19.2 4.95C19.2 6.11 18.76 7.26 17.91 8.11L9.00997 17.01C8.58497 17.435 8.00697 17.675 7.40997 17.675C6.81297 17.675 6.23497 17.435 5.80997 17.01C5.38497 16.585 5.14497 16.007 5.14497 15.41C5.14497 14.813 5.38497 14.235 5.80997 13.81L14.3 5.32"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#paperclip-glow)"
      />

      {/* 装饰点 */}
      <circle cx="21.44" cy="11.05" r="1.2" fill={color} filter="url(#paperclip-glow)" />
    </svg>
  );
};

export default PaperclipIcon;
