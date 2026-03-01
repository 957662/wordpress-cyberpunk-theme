import React from 'react';
interface SortIconProps {
  size?: number;
  className?: string;
  direction?: 'asc' | 'desc';
}

export const SortIcon = ({ size = 24, className = '', direction = 'asc' }: SortIconProps) => {
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
        <linearGradient id="sortGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
        <filter id="sortGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Horizontal lines */}
      <line x1="4" y1="6" x2="20" y2="6" stroke="url(#sortGradient)" strokeWidth="2" filter="url(#sortGlow)"/>
      <line x1="4" y1="12" x2="16" y2="12" stroke="url(#sortGradient)" strokeWidth="2" opacity="0.7" filter="url(#sortGlow)"/>
      <line x1="4" y1="18" x2="12" y2="18" stroke="url(#sortGradient)" strokeWidth="2" opacity="0.4" filter="url(#sortGlow)"/>

      {/* Arrow indicator */}
      {direction === 'asc' ? (
        <path
          d="M 18 14 L 18 18 L 16 18"
          stroke="url(#sortGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : (
        <path
          d="M 18 10 L 18 6 L 16 6"
          stroke="url(#sortGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}

      {/* Tech dots */}
      <circle cx="2" cy="6" r="0.5" fill="url(#sortGradient)" opacity="0.6"/>
      <circle cx="2" cy="12" r="0.5" fill="url(#sortGradient)" opacity="0.6"/>
      <circle cx="2" cy="18" r="0.5" fill="url(#sortGradient)" opacity="0.6"/>
    </svg>
  );
};
