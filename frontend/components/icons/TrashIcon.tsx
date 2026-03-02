import React from 'react';

/**
 * Trash Icon - 删除图标
 * 赛博朋克风格
 *
 * Usage:
 * <TrashIcon size={24} />
 * <TrashIcon size={32} variant="pink" />
 */

interface TrashIconProps {
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

export const TrashIcon: React.FC<TrashIconProps> = ({
  size = 24,
  className = '',
  variant = 'pink',
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
        <filter id={`trash-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Lid */}
      <path
        d="M4 6 L20 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#trash-glow-${variant})`}
      />

      {/* Handle */}
      <path
        d="M10 6 L10 4 L14 4 L14 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Body */}
      <path
        d="M6 6 L6 20 C6 21, 7 22, 8 22 L16 22 C17 22, 18 21, 18 20 L18 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Vertical lines */}
      <line x1="9" y1="10" x2="9" y2="18" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="12" y1="10" x2="12" y2="18" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="15" y1="10" x2="15" y2="18" stroke={color} strokeWidth="1" opacity="0.4"/>

      {/* Corner dots */}
      <circle cx="4" cy="6" r="1" fill={color} opacity="0.6"/>
      <circle cx="20" cy="6" r="1" fill={color} opacity="0.6"/>
    </svg>
  );
};

export default TrashIcon;
