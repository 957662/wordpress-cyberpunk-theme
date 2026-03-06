import React from 'react';

interface ThumbsDownIconProps {
  size?: number;
  className?: string;
  filled?: boolean;
}

export const ThumbsDownIcon = ({ size = 24, className = '', filled = false }: ThumbsDownIconProps) => {
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
        <linearGradient id="thumbsDownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0080"/>
          <stop offset="100%" stopColor="#ff6600"/>
        </linearGradient>
      </defs>

      {/* Hand */}
      <path
        d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"
        stroke={filled ? 'url(#thumbsDownGradient)' : 'url(#thumbsDownGradient)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? 'url(#thumbsDownGradient)' : 'none'}
        fillOpacity={filled ? 0.2 : 0}
      />

      {/* Glow effect */}
      {filled && (
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#thumbsDownGradient)"
          strokeWidth="1"
          opacity="0.3"
        />
      )}
    </svg>
  );
};
