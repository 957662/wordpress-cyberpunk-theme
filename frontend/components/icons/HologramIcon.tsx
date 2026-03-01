import React from 'react';

/**
 * Hologram Icon - 赛博朋克风格
 *
 * Usage:
 * <HologramIcon size={48} variant="purple" />
 * <HologramIcon size={64} variant="cyan" animated={true} />
 */

interface HologramIconProps {
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

export const HologramIcon: React.FC<HologramIconProps> = ({
  size = 48,
  variant = 'purple',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`holo-glow-${variant}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`holo-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="50%" stopColor={color} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
        </linearGradient>
      </defs>

      {/* Holographic projection base */}
      <ellipse cx="24" cy="42" rx="16" ry="3"
               stroke={color}
               strokeWidth="1"
               fill="none"
               opacity="0.5"/>

      {/* Projection cone */}
      <path d="M24 42 L10 10 L38 10 Z"
            stroke={color}
            strokeWidth="1"
            fill={`url(#holo-gradient-${variant})`}
            opacity="0.3"/>

      {/* Holographic cube */}
      <g filter={`url(#holo-glow-${variant})`}>
        {/* Top face */}
        <path d="M24 16 L30 13 L36 16 L30 19 Z"
              stroke={color}
              strokeWidth="1"
              fill="none"/>
        {/* Left face */}
        <path d="M24 16 L18 19 L18 27 L24 30 L30 27 L30 19 L24 16"
              stroke={color}
              strokeWidth="1"
              fill="none"
              opacity="0.8"/>
        {/* Right face */}
        <path d="M30 19 L36 16 L36 24 L30 27"
              stroke={color}
              strokeWidth="1"
              fill="none"
              opacity="0.6"/>
      </g>

      {/* Scan lines */}
      <line x1="12" y1="14" x2="36" y2="14" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="14" y1="18" x2="34" y2="18" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="16" y1="22" x2="32" y2="22" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="18" y1="26" x2="30" y2="26" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="20" y1="30" x2="28" y2="30" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="22" y1="34" x2="26" y2="34" stroke={color} strokeWidth="0.5" opacity="0.3"/>

      {/* Data points */}
      <circle cx="24" cy="16" r="1" fill={color} filter={`url(#holo-glow-${variant})`}/>
      <circle cx="30" cy="19" r="0.5" fill={color} opacity="0.6"/>
      <circle cx="18" cy="19" r="0.5" fill={color} opacity="0.6"/>
      <circle cx="24" cy="30" r="0.5" fill={color} opacity="0.6"/>

      {/* Projection beam particles */}
      <circle cx="20" cy="20" r="0.5" fill={color} opacity="0.3"/>
      <circle cx="28" cy="18" r="0.5" fill={color} opacity="0.3"/>
      <circle cx="22" cy="25" r="0.5" fill={color} opacity="0.3"/>
      <circle cx="26" cy="23" r="0.5" fill={color} opacity="0.3"/>
    </svg>
  );
};

export default HologramIcon;
