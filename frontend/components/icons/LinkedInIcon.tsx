import React from 'react';

/**
 * LinkedIn Icon - LinkedIn 社交图标
 * 赛博朋克风格
 *
 * Usage:
 * <LinkedInIcon size={24} />
 * <LinkedInIcon size={32} variant="cyan" />
 */

interface LinkedInIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  filled?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const LinkedInIcon: React.FC<LinkedInIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
  filled = false,
}) => {
  const color = colorMap[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`linkedin-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer rounded rect */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="3"
        stroke={color}
        strokeWidth="1.5"
        fill={filled ? color : 'none'}
        filter={`url(#linkedin-glow-${variant})`}
      />

      {/* 'in' text */}
      {/* Letter i */}
      <circle cx="7.5" cy="7.5" r="1.5" fill={filled ? '#0a0a0f' : color}/>
      <line x1="6" y1="10.5" x2="6" y2="18" stroke={filled ? '#0a0a0f' : color} strokeWidth="2" strokeLinecap="round"/>

      {/* Letter n */}
      <path
        d="M10 18 L10 12.5 C10 11 11 10 12.5 10 C14 10 15 11 15 12.5 L15 18"
        stroke={filled ? '#0a0a0f' : color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="10" y1="10" x2="10" y2="18" stroke={filled ? '#0a0a0f' : color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

export default LinkedInIcon;
