'use client';

import React from 'react';

export interface LinkIconProps {
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

export const LinkIcon: React.FC<LinkIconProps> = ({
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
        <filter id="link-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 链接路径 */}
      <path
        d="M10 13C10.4295 13.4091 10.9346 13.7316 11.486 13.9499C12.0374 14.1683 12.6236 14.2783 13.2148 14.2736C13.806 14.269 14.391 14.1499 14.9405 13.9231C15.49 13.6963 15.9917 13.3658 16.42 12.95L19.95 9.45C20.7705 8.60982 21.2281 7.47524 21.2203 6.29577C21.2125 5.1163 20.7399 3.98763 19.9086 3.15811C19.0772 2.3286 17.9478 1.85838 16.7683 1.85306C15.5888 1.84774 14.4553 2.30782 13.617 3.13L11.76 4.98"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#link-glow)"
      />

      <path
        d="M14 11C13.5705 10.5909 13.0654 10.2684 12.514 10.0501C11.9626 9.83172 11.3764 9.72172 10.7852 9.72636C10.194 9.731 9.60899 9.85011 9.05949 10.0769C8.51001 10.3037 8.00831 10.6342 7.58 11.05L4.05 14.55C3.22954 15.3902 2.77187 16.5248 2.77968 17.7042C2.7875 18.8837 3.26012 20.0124 4.09142 20.8419C4.92272 21.6714 6.05221 22.1416 7.23169 22.1469C8.41118 22.1523 9.54472 21.6922 10.383 20.87L12.24 19.02"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#link-glow)"
      />

      {/* 装饰点 */}
      <circle cx="12" cy="12" r="1" fill={color} opacity="0.5" filter="url(#link-glow)" />
    </svg>
  );
};

export default LinkIcon;
