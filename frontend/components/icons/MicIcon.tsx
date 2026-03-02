import React from 'react';

/**
 * Mic Icon - 麦克风图标
 * 赛博朋克风格
 *
 * Usage:
 * <MicIcon size={24} />
 * <MicIcon size={32} variant="pink" />
 */

interface MicIconProps {
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

export const MicIcon: React.FC<MicIconProps> = ({
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
        <filter id={`mic-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Mic head - top rounded rect */}
      <rect
        x="8"
        y="2"
        width="8"
        height="12"
        rx="4"
        stroke={color}
        strokeWidth="1.5"
        filter={`url(#mic-glow-${variant})`}
      />

      {/* Mic head horizontal lines */}
      <line x1="8" y1="6" x2="16" y2="6" stroke={color} strokeWidth="1" opacity="0.3"/>
      <line x1="8" y1="10" x2="16" y2="10" stroke={color} strokeWidth="1" opacity="0.3"/>

      {/* Mic stand */}
      <line x1="12" y1="14" x2="12" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>

      {/* Base */}
      <line x1="8" y1="20" x2="16" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>

      {/* Sound waves - left */}
      <path
        d="M5 9 Q3 12, 5 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Sound waves - right */}
      <path
        d="M19 9 Q21 12, 19 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Corner dots */}
      <circle cx="8" cy="2" r="0.75" fill={color} opacity="0.6"/>
      <circle cx="16" cy="2" r="0.75" fill={color} opacity="0.6"/>
    </svg>
  );
};

export default MicIcon;
