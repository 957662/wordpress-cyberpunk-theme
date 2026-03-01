import React from 'react';
interface StarIconProps {
  size?: number;
  className?: string;
  filled?: boolean;
  variant?: 'yellow' | 'cyan' | 'pink';
}

export const StarIcon = ({ size = 24, className = '', filled = false, variant = 'yellow' }: StarIconProps) => {
  const colorMap = {
    yellow: '#f0ff00',
    cyan: '#00f0ff',
    pink: '#ff0080',
  };

  const color = colorMap[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`starGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color}/>
          <stop offset="100%" stopColor={variant === 'yellow' ? '#ff6600' : variant === 'cyan' ? '#00ff88' : '#ff6600'}/>
        </linearGradient>
        <filter id={`starGlow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Star shape */}
      <path
        d="M 12 2 L 15.09 8.26 L 22 9.27 L 17 14.14 L 18.18 21.02 L 12 17.77 L 5.82 21.02 L 7 14.14 L 2 9.27 L 8.91 8.26 Z"
        fill={filled ? `url(#starGradient-${variant})` : 'none'}
        stroke={`url(#starGradient-${variant})`}
        strokeWidth="2"
        strokeLinejoin="round"
        filter={`url(#starGlow-${variant})`}
      />

      {/* Tech accent center */}
      {!filled && (
        <circle cx="12" cy="12" r="2" fill={color} opacity="0.3"/>
      )}
    </svg>
  );
};
