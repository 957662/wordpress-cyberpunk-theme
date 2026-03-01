import React from 'react';
interface WarningIconProps {
  size?: number;
  className?: string;
}

export const WarningIcon = ({ size = 24, className = '' }: WarningIconProps) => {
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
        <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0ff00"/>
          <stop offset="100%" stopColor="#ff6600"/>
        </linearGradient>
        <filter id="warningGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Triangle */}
      <path
        d="M 12 2 L 2 22 L 22 22 Z"
        stroke="url(#warningGradient)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
        filter="url(#warningGlow)"
      />

      {/* Exclamation mark */}
      <rect x="11" y="8" width="2" height="8" rx="1" fill="url(#warningGradient)"/>
      <circle cx="12" cy="19" r="1.5" fill="url(#warningGradient)"/>

      {/* Tech accent points */}
      <circle cx="12" cy="4" r="0.5" fill="url(#warningGradient)" opacity="0.6"/>
      <circle cx="4" cy="20" r="0.5" fill="url(#warningGradient)" opacity="0.4"/>
      <circle cx="20" cy="20" r="0.5" fill="url(#warningGradient)" opacity="0.4"/>
    </svg>
  );
};
