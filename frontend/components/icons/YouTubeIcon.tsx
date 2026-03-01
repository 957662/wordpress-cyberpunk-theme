import React from 'react';
/**
 * YouTube Icon - 赛博朋克风格
 *
 * Usage:
 * <YouTubeIcon size={24} variant="pink" />
 * <YouTubeIcon size={32} variant="cyan" animated={true} />
 */

interface YouTubeIconProps {
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

export const YouTubeIcon: React.FC<YouTubeIconProps> = ({
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
        <filter id={`youtube-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Rounded rectangle  */}
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="3"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter={`url(#youtube-glow-${variant}-${size})`}
      />

      {/*  Play triangle  */}
      <path
        d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/*  Inner triangle detail  */}
      <path
        d="M10.5 10L14 12L10.5 14V10Z"
        fill="#0a0a0f"
      />

      {/*  Tech accents  */}
      <circle cx="4" cy="7" r="0.5" fill={color} opacity="0.6" />
      <circle cx="20" cy="7" r="0.5" fill={color} opacity="0.6" />
      <circle cx="4" cy="17" r="0.5" fill={color} opacity="0.6" />
      <circle cx="20" cy="17" r="0.5" fill={color} opacity="0.6" />

      {/*  Corner brackets  */}
      <path
        d="M6 6L6 8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M18 6L18 8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M6 16L6 18"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M18 16L18 18"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
};

export default YouTubeIcon;
