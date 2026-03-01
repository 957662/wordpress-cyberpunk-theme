import React from 'react';
/**
 * Camera Icon - 赛博朋克风格
 *
 * Usage:
 * <CameraIcon size={24} variant="cyan" />
 * <CameraIcon size={32} variant="purple" animated={true} />
 */

interface CameraIconProps {
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

export const CameraIcon: React.FC<CameraIconProps> = ({
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
        <filter id={`camera-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Camera body  */}
      <path
        d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#camera-glow-${variant}-${size})`}
      />

      {/*  Lens  */}
      <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="13" r="2" stroke={color} strokeWidth="1" fill={color} opacity="0.3" />
      <circle cx="12" cy="13" r="0.5" fill={color} opacity="0.8" />

      {/*  Tech accents  */}
      <circle cx="19" cy="9" r="1" fill={color} opacity="0.6" />

      {/*  Focus points  */}
      <line x1="8" y1="13" x2="10" y2="13" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <line x1="14" y1="13" x2="16" y2="13" stroke={color} strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
};

export default CameraIcon;
