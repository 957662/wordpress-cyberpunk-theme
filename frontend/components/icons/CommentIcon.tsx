import React from 'react';
interface CommentIconProps {
  size?: number;
  className?: string;
}

export const CommentIcon = ({ size = 24, className = '' }: CommentIconProps) => {
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
        <linearGradient id="commentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
        <filter id="commentGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Comment bubble */}
      <path
        d="M 21 15 C 21 17.76 18.76 20 16 20 L 5.5 20 L 2 23 L 2 15 C 2 12.24 4.24 10 7 10 L 16 10 C 18.76 10 21 12.24 21 15 Z"
        stroke="url(#commentGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#commentGlow)"
      />

      {/* Dots representing text */}
      <circle cx="7" cy="14" r="1" fill="url(#commentGradient)" opacity="0.8"/>
      <circle cx="11" cy="14" r="1" fill="url(#commentGradient)" opacity="0.6"/>
      <circle cx="15" cy="14" r="1" fill="url(#commentGradient)" opacity="0.4"/>

      {/* Tech circuit accent */}
      <line x1="21" y1="15" x2="23" y2="15" stroke="url(#commentGradient)" strokeWidth="1" opacity="0.3"/>
      <circle cx="23" cy="15" r="0.5" fill="url(#commentGradient)" opacity="0.5"/>
    </svg>
  );
};
