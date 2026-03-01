import React from 'react';
interface SearchIconProps {
  size?: number;
  className?: string;
}

export const SearchIcon = ({ size = 24, className = '' }: SearchIconProps) => {
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
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
        <filter id="searchGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Search circle */}
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="url(#searchGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#searchGlow)"
      />

      {/* Handle */}
      <rect
        x="14"
        y="14"
        width="8"
        height="2"
        rx="1"
        fill="url(#searchGradient)"
        transform="rotate(45 18 15)"
        filter="url(#searchGlow)"
      />

      {/* Tech accents */}
      <circle cx="6" cy="8" r="1" fill="#00f0ff" opacity="0.6"/>
      <circle cx="14" cy="12" r="1" fill="#ff0080" opacity="0.6"/>
    </svg>
  );
};
