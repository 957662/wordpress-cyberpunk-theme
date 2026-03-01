import React from 'react';
/**
 * Music Icon - 赛博朋克风格
 *
 * Usage:
 * <MusicIcon size={24} variant="cyan" />
 * <MusicIcon size={32} variant="purple" animated={true} />
 */

interface MusicIconProps {
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

export const MusicIcon: React.FC<MusicIconProps> = ({
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
        <filter id={`music-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Note stem  */}
      <path
        d="M9 18V5L12 3L21 5V18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#music-glow-${variant}-${size})`}
      />

      {/*  Note heads  */}
      <ellipse cx="9" cy="18" rx="3" ry="2" stroke={color} strokeWidth="1.5" fill="none" />
      <ellipse cx="21" cy="18" rx="3" ry="2" stroke={color} strokeWidth="1.5" fill="none" />

      {/*  Tech accents  */}
      <circle cx="9" cy="18" r="1" fill={color} opacity="0.5" />
      <circle cx="21" cy="18" r="1" fill={color} opacity="0.5" />

      {/*  Cyber bars  */}
      <line x1="12" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  );
};

export default MusicIcon;
