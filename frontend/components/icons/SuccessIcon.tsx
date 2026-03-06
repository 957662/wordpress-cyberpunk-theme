import React from 'react';

interface SuccessIconProps {
  size?: number;
  className?: string;
}

export const SuccessIcon = ({ size = 24, className = '' }: SuccessIconProps) => {
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
        <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88"/>
          <stop offset="100%" stopColor="#00f0ff"/>
        </linearGradient>
        <filter id="successGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Circle background */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="url(#successGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#successGlow)"
      />

      {/* Checkmark */}
      <path
        d="M8 12l2 2 4-4"
        stroke="url(#successGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#successGlow)"
      />

      {/* Decorative dots */}
      <circle cx="12" cy="3" r="1" fill="#00ff88" opacity="0.8"/>
      <circle cx="12" cy="21" r="1" fill="#00f0ff" opacity="0.8"/>
    </svg>
  );
};
