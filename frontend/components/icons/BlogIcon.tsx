import React from 'react';
interface BlogIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink';
}

export const BlogIcon = ({ size = 24, className = '', variant = 'cyan' }: BlogIconProps) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
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
        <filter id={`blogGlow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Document background */}
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter={`url(#blogGlow-${variant})`}
      />

      {/* Code lines */}
      <rect x="7" y="6" width="10" height="1.5" rx="0.5" fill={color} opacity="0.8"/>
      <rect x="7" y="9" width="8" height="1.5" rx="0.5" fill={color} opacity="0.6"/>
      <rect x="7" y="12" width="10" height="1.5" rx="0.5" fill={color} opacity="0.8"/>
      <rect x="7" y="15" width="6" height="1.5" rx="0.5" fill={color} opacity="0.6"/>
      <rect x="7" y="18" width="4" height="1.5" rx="0.5" fill={color} opacity="0.4"/>

      {/* Tech accents */}
      <circle cx="17" cy="5" r="1" fill={color}/>
      <circle cx="17" cy="19" r="1" fill={color} opacity="0.5"/>
    </svg>
  );
};
