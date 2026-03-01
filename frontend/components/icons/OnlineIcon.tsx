import React from 'react';
/**
 * Online Status Icon - 赛博朋克风格
 *
 * Usage:
 * <OnlineIcon size={24} variant="cyan" />
 * <OnlineIcon size={32} variant="green" animated={true} />
 */

interface OnlineIconProps {
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

export const OnlineIcon: React.FC<OnlineIconProps> = ({
  size = 24,
  variant = 'green',
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
        <filter id={`online-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Outer ring  */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
        filter={`url(#online-glow-${variant}-${size})`}
      />

      {/*  Inner ring  */}
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/*  Center dot  */}
      <circle
        cx="12"
        cy="12"
        r="3"
        fill={color}
        filter={`url(#online-glow-${variant}-${size})`}
      />

      {/*  Tech accents  */}
      <circle cx="12" cy="5" r="0.5" fill={color} opacity="0.8" />
      <circle cx="12" cy="19" r="0.5" fill={color} opacity="0.8" />
      <circle cx="5" cy="12" r="0.5" fill={color} opacity="0.8" />
      <circle cx="19" cy="12" r="0.5" fill={color} opacity="0.8" />
    </svg>
  );
};

export default OnlineIcon;
