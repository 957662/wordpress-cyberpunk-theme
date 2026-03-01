import React from 'react';
/**
 * Database Icon - 赛博朋克风格
 *
 * Usage:
 * <DatabaseIcon size={48} variant="purple" />
 * <DatabaseIcon size={64} variant="cyan" animated={true} />
 */

interface DatabaseIconProps {
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

export const DatabaseIcon: React.FC<DatabaseIconProps> = ({
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
        <filter id={`db-glow-${variant}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`db-gradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
        </linearGradient>
      </defs>

      {/*  Top disk  */}
      <ellipse cx="24" cy="10" rx="16" ry="5"
               stroke={color}
               strokeWidth="1.5"
               fill="none"
               filter={`url(#db-glow-${variant})`}/>
      <ellipse cx="24" cy="10" rx="12" ry="3"
               fill={color}
               opacity="0.3"/>

      {/*  Middle section  */}
      <path d="M8 10 L8 22 Q8 27 24 27 Q40 27 40 22 L40 10"
            stroke={color}
            strokeWidth="1.5"
            fill={`url(#db-gradient-${variant})`}
            opacity="0.8"/>
      <ellipse cx="24" cy="22" rx="16" ry="5"
               stroke={color}
               strokeWidth="1"
               fill="none"
               opacity="0.6"/>

      {/*  Bottom section  */}
      <path d="M8 22 L8 34 Q8 39 24 39 Q40 39 40 34 L40 22"
            stroke={color}
            strokeWidth="1.5"
            fill={`url(#db-gradient-${variant})`}
            opacity="0.6"/>
      <ellipse cx="24" cy="34" rx="16" ry="5"
               stroke={color}
               strokeWidth="1.5"
               fill="none"
               filter={`url(#db-glow-${variant})`}/>
      <ellipse cx="24" cy="34" rx="12" ry="3"
               fill={color}
               opacity="0.3"/>

      {/*  Data lines  */}
      <line x1="24" y1="10" x2="24" y2="34" stroke={color} strokeWidth="0.5" opacity="0.4"/>
      <line x1="16" y1="12" x2="16" y2="32" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="32" y1="12" x2="32" y2="32" stroke={color} strokeWidth="0.5" opacity="0.3"/>

      {/*  Data nodes  */}
      <circle cx="24" cy="14" r="1" fill={color} opacity="0.8"/>
      <circle cx="24" cy="27" r="1" fill={color} opacity="0.8"/>
      <circle cx="16" cy="14" r="0.5" fill={color} opacity="0.6"/>
      <circle cx="32" cy="14" r="0.5" fill={color} opacity="0.6"/>
      <circle cx="16" cy="30" r="0.5" fill={color} opacity="0.6"/>
      <circle cx="32" cy="30" r="0.5" fill={color} opacity="0.6"/>
    </svg>
  );
};

export default DatabaseIcon;
