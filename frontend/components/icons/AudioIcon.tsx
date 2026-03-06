import React from 'react';

interface AudioIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export const AudioIcon = ({ size = 24, className = '', animated = false }: AudioIconProps) => {
  const animateClass = animated ? 'animate-pulse' : '';

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
        <linearGradient id="audioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
      </defs>

      {/* Speaker */}
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="url(#audioGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Sound waves */}
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="url(#audioGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animateClass}
      />
    </svg>
  );
};
