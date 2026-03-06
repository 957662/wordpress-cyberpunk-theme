import React from 'react';

interface ThumbsUpIconProps {
  size?: number;
  className?: string;
  filled?: boolean;
}

export const ThumbsUpIcon = ({ size = 24, className = '', filled = false }: ThumbsUpIconProps) => {
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
        <linearGradient id="thumbsUpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88"/>
          <stop offset="100%" stopColor="#00f0ff"/>
        </linearGradient>
      </defs>

      {/* Hand */}
      <path
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
        stroke={filled ? 'url(#thumbsUpGradient)' : 'url(#thumbsUpGradient)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? 'url(#thumbsUpGradient)' : 'none'}
        fillOpacity={filled ? 0.2 : 0}
      />

      {/* Glow effect */}
      {filled && (
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#thumbsUpGradient)"
          strokeWidth="1"
          opacity="0.3"
        />
      )}
    </svg>
  );
};
