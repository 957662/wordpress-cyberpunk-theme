import React from 'react';

/**
 * Refresh Icon - 刷新图标
 * 赛博朋克风格
 *
 * Usage:
 * <RefreshIcon size={24} />
 * <RefreshIcon size={32} variant="cyan" />
 */

interface RefreshIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const RefreshIcon: React.FC<RefreshIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-spin' : '';

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
        <filter id={`refresh-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Circular arrow - top */}
      <path
        d="M20 11 A 8 8 0 0 0 12 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter={`url(#refresh-glow-${variant})`}
      />

      {/* Arrow head - top */}
      <path
        d="M16 4 L12 4 L12 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#refresh-glow-${variant})`}
      />

      {/* Circular arrow - bottom */}
      <path
        d="M4 13 A 8 8 0 0 0 12 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
        fill="none"
      />

      {/* Arrow head - bottom */}
      <path
        d="M8 20 L12 20 L12 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Center dot */}
      <circle cx="12" cy="12" r="1" fill={color} opacity="0.8"/>
    </svg>
  );
};

export default RefreshIcon;
