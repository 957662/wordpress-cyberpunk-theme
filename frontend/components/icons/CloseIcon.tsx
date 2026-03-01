import React from 'react';
interface CloseIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'pink' | 'yellow';
}

export const CloseIcon = ({ size = 24, className = '', variant = 'pink' }: CloseIconProps) => {
  const colorMap = {
    cyan: '#00f0ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colorMap[variant];

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
        <filter id={`closeGlow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* X shape */}
      <line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#closeGlow-${variant})`}
      />
      <line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#closeGlow-${variant})`}
      />

      {/* Tech circle accent */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.2"
      />

      {/* Corner dots */}
      <circle cx="6" cy="6" r="0.5" fill={color} opacity="0.5"/>
      <circle cx="18" cy="18" r="0.5" fill={color} opacity="0.5"/>
    </svg>
  );
};
