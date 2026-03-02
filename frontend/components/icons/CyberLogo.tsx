/**
 * CyberPress Logo 组件
 * 赛博朋克风格的主标志
 */

import React from 'react';

interface CyberLogoProps {
  className?: string;
  size?: number;
  variant?: 'default' | 'neon' | 'minimal';
}

export const CyberLogo: React.FC<CyberLogoProps> = ({
  className = '',
  size = 200,
  variant = 'default',
}) => {
  const getColor = () => {
    switch (variant) {
      case 'neon':
        return '#00f0ff';
      case 'minimal':
        return '#ffffff';
      default:
        return '#00f0ff';
    }
  };

  const getSecondaryColor = () => {
    switch (variant) {
      case 'neon':
        return '#9d00ff';
      case 'minimal':
        return '#cccccc';
      default:
        return '#9d00ff';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#9d00ff" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,240,255,0.1)" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Background Grid */}
      {variant === 'default' && <rect width="200" height="200" fill="url(#gridPattern)" />}

      {/* Hexagon Frame */}
      <path
        d="M 100 20 L 170 60 L 170 140 L 100 180 L 30 140 L 30 60 Z"
        fill="none"
        stroke={getColor()}
        strokeWidth="2"
        filter={variant === 'neon' ? 'url(#glow)' : undefined}
      />

      {/* Inner Hexagon */}
      <path
        d="M 100 35 L 155 67 L 155 133 L 100 165 L 45 133 L 45 67 Z"
        fill="rgba(0,240,255,0.05)"
        stroke={getSecondaryColor()}
        strokeWidth="1"
      />

      {/* Cyber Letter C */}
      <path
        d="M 75 75 L 75 125 L 100 125 L 110 120 L 110 100 L 95 100 L 95 115 L 85 115 L 85 85 L 110 85 L 110 80 L 100 75 Z"
        fill={variant === 'default' ? 'url(#cyberGradient)' : getColor()}
        filter={variant === 'neon' ? 'url(#glow)' : undefined}
      />

      {/* Circuit Lines */}
      <g stroke={getColor()} strokeWidth="1" fill="none">
        <line x1="115" y1="70" x2="135" y2="70" />
        <line x1="135" y1="70" x2="135" y2="85" />
        <circle cx="135" cy="85" r="2" fill={getColor()} />

        <line x1="115" y1="100" x2="150" y2="100" />
        <line x1="150" y1="100" x2="150" y2="115" />
        <circle cx="150" cy="115" r="2" fill={getColor()} />

        <line x1="115" y1="130" x2="130" y2="130" />
        <line x1="130" y1="130" x2="130" y2="145" />
        <circle cx="130" cy="145" r="2" fill={getColor()} />
      </g>

      {/* Decorative Elements */}
      {variant === 'default' && (
        <>
          <circle cx="100" cy="50" r="3" fill="#ff0080" filter="url(#glow)" />
          <circle cx="100" cy="150" r="3" fill="#ff0080" filter="url(#glow)" />
          <circle cx="50" cy="100" r="3" fill="#f0ff00" filter="url(#glow)" />
          <circle cx="150" cy="100" r="3" fill="#f0ff00" filter="url(#glow)" />
        </>
      )}

      {/* Tech Details */}
      <g fontSize="8" fill={getColor()} fontFamily="monospace">
        {variant === 'default' && (
          <>
            <text x="55" y="55">SYS</text>
            <text x="130" y="155">READY</text>
          </>
        )}
      </g>
    </svg>
  );
};

export default CyberLogo;
