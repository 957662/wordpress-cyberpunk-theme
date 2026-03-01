import React from 'react';
/**
 * Sync Icon - 赛博朋克风格
 *
 * Usage:
 * <SyncIcon size={24} variant="cyan" />
 * <SyncIcon size={32} variant="purple" animated={true} />
 */

interface SyncIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const SyncIcon: React.FC<SyncIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-spin-slow' : '';

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
        <filter id={`sync-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Top arrow arc  */}
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        filter={`url(#sync-glow-${variant}-${size})`}
      />

      {/*  Top arrow head  */}
      <path
        d="M21 12V8M21 12H17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/*  Bottom arrow arc  */}
      <path
        d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/*  Bottom arrow head  */}
      <path
        d="M3 12V16M3 12H7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />

      {/*  Tech accents  */}
      <circle cx="21" cy="12" r="0.5" fill={color} opacity="0.8" />
      <circle cx="3" cy="12" r="0.5" fill={color} opacity="0.6" />
    </svg>
  );
};

export default SyncIcon;
