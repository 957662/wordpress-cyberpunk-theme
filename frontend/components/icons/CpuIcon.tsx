import React from 'react';
/**
 * CPU/Processor Icon - 赛博朋克风格
 *
 * Usage:
 * <CpuIcon size={48} variant="cyan" />
 * <CpuIcon size={64} variant="purple" animated={true} />
 */

interface CpuIconProps {
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

export const CpuIcon: React.FC<CpuIconProps> = ({
  size = 48,
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
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`cpu-glow-${variant}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`cpu-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.3"/>
        </linearGradient>
      </defs>

      {/*  Outer frame  */}
      <rect x="4" y="4" width="40" height="40" rx="2"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            filter={`url(#cpu-glow-${variant})`}/>

      {/*  Inner core  */}
      <rect x="14" y="14" width="20" height="20" rx="1"
            fill={`url(#cpu-gradient-${variant})`}
            opacity="0.5"/>

      {/*  Core detail  */}
      <rect x="18" y="18" width="12" height="12"
            fill={color}
            opacity="0.8"
            filter={`url(#cpu-glow-${variant})`}/>

      {/*  Circuit pins - top  */}
      <line x1="12" y1="4" x2="12" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="18" y1="4" x2="18" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="24" y1="4" x2="24" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="30" y1="4" x2="30" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="36" y1="4" x2="36" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>

      {/*  Circuit pins - bottom  */}
      <line x1="12" y1="40" x2="12" y2="44" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="18" y1="40" x2="18" y2="44" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="24" y1="40" x2="24" y2="44" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="30" y1="40" x2="30" y2="44" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="36" y1="40" x2="36" y2="44" stroke={color} strokeWidth="1" opacity="0.6"/>

      {/*  Circuit pins - left  */}
      <line x1="4" y1="12" x2="8" y2="12" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="4" y1="18" x2="8" y2="18" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="4" y1="24" x2="8" y2="24" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="4" y1="30" x2="8" y2="30" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="4" y1="36" x2="8" y2="36" stroke={color} strokeWidth="1" opacity="0.6"/>

      {/*  Circuit pins - right  */}
      <line x1="40" y1="12" x2="44" y2="12" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="40" y1="18" x2="44" y2="18" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="40" y1="24" x2="44" y2="24" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="40" y1="30" x2="44" y2="30" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="40" y1="36" x2="44" y2="36" stroke={color} strokeWidth="1" opacity="0.6"/>

      {/*  Corner accents  */}
      <circle cx="12" cy="12" r="1" fill={color} opacity="0.8"/>
      <circle cx="36" cy="12" r="1" fill={color} opacity="0.8"/>
      <circle cx="36" cy="36" r="1" fill={color} opacity="0.8"/>
      <circle cx="12" cy="36" r="1" fill={color} opacity="0.8"/>
    </svg>
  );
};

export default CpuIcon;
