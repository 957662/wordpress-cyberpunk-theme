import React from 'react';
interface ErrorIconProps {
  size?: number;
  className?: string;
}

export const ErrorIcon = ({ size = 24, className = '' }: ErrorIconProps) => {
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
        <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0080"/>
          <stop offset="100%" stopColor="#ff6600"/>
        </linearGradient>
        <filter id="errorGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="url(#errorGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#errorGlow)"
      />

      {/* X shape */}
      <line
        x1="9"
        y1="9"
        x2="15"
        y2="15"
        stroke="url(#errorGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="9"
        x2="9"
        y2="15"
        stroke="url(#errorGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Tech circuit points */}
      <circle cx="12" cy="2" r="0.5" fill="url(#errorGradient)" opacity="0.6"/>
      <circle cx="12" cy="22" r="0.5" fill="url(#errorGradient)" opacity="0.6"/>
      <circle cx="2" cy="12" r="0.5" fill="url(#errorGradient)" opacity="0.4"/>
      <circle cx="22" cy="12" r="0.5" fill="url(#errorGradient)" opacity="0.4"/>
    </svg>
  );
};
