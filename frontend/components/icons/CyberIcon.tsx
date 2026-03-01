import React from 'react';
interface CyberIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};

export const CyberIcon = ({ size = 24, className = '', variant = 'cyan' }: CyberIconProps) => {
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
        <filter id={`glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="12" cy="12" r="3" fill={color} filter={`url(#glow-${variant})`}/>
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
      <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3"/>
    </svg>
  );
};
