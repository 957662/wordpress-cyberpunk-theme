import React from 'react';
interface TwitterIconProps {
  size?: number;
  className?: string;
}

export const TwitterIcon = ({ size = 24, className = '' }: TwitterIconProps) => {
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
        <linearGradient id="twitterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
        <filter id="twitterGlow">
          <feGaussianBlur stdDeviation="0.3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Twitter X shape */}
      <path
        d="M 4 4 L 10.5 12.5 L 4 20 L 6 20 L 11.5 13.5 L 16 20 L 20 20 L 13.5 11.5 L 20 4 L 18 4 L 12.5 10.5 L 8 4 Z"
        fill="url(#twitterGradient)"
        filter="url(#twitterGlow)"
      />

      {/* Tech accents */}
      <rect x="2" y="2" width="3" height="1" fill="#00f0ff" opacity="0.5"/>
      <rect x="19" y="21" width="3" height="1" fill="#ff0080" opacity="0.5"/>
      <circle cx="4" cy="4" r="0.5" fill="#00f0ff"/>
      <circle cx="20" cy="20" r="0.5" fill="#ff0080"/>
    </svg>
  );
};
