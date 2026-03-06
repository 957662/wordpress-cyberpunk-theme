import React from 'react';

interface CyberCardIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
}

export const CyberCardIcon = ({ size = 24, className = '', variant = 'cyan' }: CyberCardIconProps) => {
  const colors = {
    cyan: { primary: '#00f0ff', secondary: '#00ccff' },
    purple: { primary: '#9d00ff', secondary: '#7b00cc' },
    pink: { primary: '#ff0080', secondary: '#cc0066' },
    green: { primary: '#00ff88', secondary: '#00cc6a' }
  };

  const color = colors[variant];

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
        <linearGradient id={`cardGradient${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.primary}/>
          <stop offset="100%" stopColor={color.secondary}/>
        </linearGradient>
        <filter id={`cardGlow${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Card body */}
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke={`url(#cardGradient${variant})`}
        strokeWidth="2"
        fill="none"
        filter={`url(#cardGlow${variant})`}
      />

      {/* Card chip */}
      <rect
        x="6"
        y="10"
        width="4"
        height="3"
        rx="0.5"
        stroke={`url(#cardGradient${variant})`}
        strokeWidth="1"
        fill="none"
      />

      {/* Card stripes */}
      <line x1="12" y1="11" x2="18" y2="11" stroke={`url(#cardGradient${variant})`} strokeWidth="1" opacity="0.6"/>
      <line x1="12" y1="13" x2="16" y2="13" stroke={`url(#cardGradient${variant})`} strokeWidth="1" opacity="0.6"/>

      {/* Corner decorations */}
      <circle cx="5" cy="7" r="1" fill={color.primary} opacity="0.8"/>
      <circle cx="19" cy="17" r="1" fill={color.primary} opacity="0.8"/>
    </svg>
  );
};
