import React from 'react';

/**
 * Save Icon - 保存图标
 * 赛博朋克风格
 *
 * Usage:
 * <SaveIcon size={24} />
 * <SaveIcon size={32} variant="cyan" />
 */

interface SaveIconProps {
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

export const SaveIcon: React.FC<SaveIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
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
        <filter id={`save-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer frame */}
      <path
        d="M4 2 L4 22 L20 22 L20 8 L14 2 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#save-glow-${variant})`}
      />

      {/* Corner flap */}
      <path
        d="M14 2 L14 8 L20 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Inner rectangle (disk) */}
      <rect
        x="8"
        y="12"
        width="8"
        height="6"
        rx="0.5"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Center hole */}
      <circle
        cx="12"
        cy="15"
        r="1.5"
        stroke={color}
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Corner dots */}
      <circle cx="4" cy="2" r="1" fill={color} opacity="0.6"/>
      <circle cx="20" cy="22" r="1" fill={color} opacity="0.6"/>
    </svg>
  );
};

export default SaveIcon;
