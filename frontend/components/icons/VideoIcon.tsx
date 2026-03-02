import React from 'react';

/**
 * Video Icon - 视频图标
 * 赛博朋克风格
 *
 * Usage:
 * <VideoIcon size={24} />
 * <VideoIcon size={32} variant="purple" />
 */

interface VideoIconProps {
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

export const VideoIcon: React.FC<VideoIconProps> = ({
  size = 24,
  className = '',
  variant = 'purple',
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
        <filter id={`video-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Camera body */}
      <rect
        x="2"
        y="6"
        width="14"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        filter={`url(#video-glow-${variant})`}
      />

      {/* Lens */}
      <circle
        cx="9"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Lens center */}
      <circle
        cx="9"
        cy="12"
        r="1"
        fill={color}
        opacity="0.6"
      />

      {/* Viewfinder triangle */}
      <path
        d="M20 5 L20 11 L24 8 Z"
        fill={color}
        opacity="0.8"
      />

      {/* Recording dot */}
      <circle
        cx="14"
        cy="8"
        r="1"
        fill={color}
        opacity={animated ? '1' : '0.5'}
      />

      {/* Corner accents */}
      <circle cx="2" cy="6" r="0.75" fill={color} opacity="0.6"/>
      <circle cx="16" cy="6" r="0.75" fill={color} opacity="0.6"/>
      <circle cx="2" cy="18" r="0.75" fill={color} opacity="0.6"/>
      <circle cx="16" cy="18" r="0.75" fill={color} opacity="0.6"/>
    </svg>
  );
};

export default VideoIcon;
