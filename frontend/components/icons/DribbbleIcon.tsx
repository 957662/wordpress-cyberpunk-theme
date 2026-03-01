import React from 'react';
/**
 * Dribbble Icon - 赛博朋克风格
 *
 * Usage:
 * <DribbbleIcon size={24} variant="pink" />
 * <DribbbleIcon size={32} variant="cyan" animated={true} />
 */

interface DribbbleIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const DribbbleIcon: React.FC<DribbbleIconProps> = ({
  size = 24,
  variant = 'pink',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`dribbble-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Outer circle  */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter={`url(#dribbble-glow-${variant}-${size})`}
      />

      {/*  Horizontal line  */}
      <path
        d="M4.5 12C4.5 12 6 14 12 14C18 14 19.5 12 19.5 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/*  Left curve  */}
      <path
        d="M7 5C7 5 8 9 12 11C16 13 17 9 17 9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/*  Right curve  */}
      <path
        d="M7 19C7 19 8 15 12 13C16 11 17 15 17 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/*  Tech accents  */}
      <circle cx="12" cy="3" r="0.5" fill={color} opacity="0.6" />
      <circle cx="12" cy="21" r="0.5" fill={color} opacity="0.6" />
      <circle cx="3" cy="12" r="0.5" fill={color} opacity="0.6" />
      <circle cx="21" cy="12" r="0.5" fill={color} opacity="0.6" />
    </svg>
  );
};

export default DribbbleIcon;
