'use client';

import React from 'react';

export interface HologramDisplayIconProps {
  size?: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'blue';
  animated?: boolean;
}

/**
 * 全息显示图标 - 赛博朋克风格
 * 展示全息投影和扫描线效果
 */
export const HologramDisplayIcon: React.FC<HologramDisplayIconProps> = ({
  size = 100,
  className = '',
  color = 'cyan',
  animated = true,
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    blue: '#0066ff',
  };

  const primaryColor = colorMap[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`hologramGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8"/>
          <stop offset="50%" stopColor={primaryColor} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.8"/>
        </linearGradient>

        <pattern id={`gridPattern-${color}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke={primaryColor} strokeWidth="0.3" opacity="0.3"/>
        </pattern>

        <filter id={`hologramGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Base Platform */}
      <ellipse
        cx="50"
        cy="85"
        rx="35"
        ry="8"
        fill="none"
        stroke={primaryColor}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Grid Lines on Base */}
      <g opacity="0.3">
        <line x1="20" y1="82" x2="20" y2="88" stroke={primaryColor} strokeWidth="0.5"/>
        <line x1="35" y1="83" x2="35" y2="87" stroke={primaryColor} strokeWidth="0.5"/>
        <line x1="50" y1="83" x2="50" y2="87" stroke={primaryColor} strokeWidth="0.5"/>
        <line x1="65" y1="83" x2="65" y2="87" stroke={primaryColor} strokeWidth="0.5"/>
        <line x1="80" y1="82" x2="80" y2="88" stroke={primaryColor} strokeWidth="0.5"/>
      </g>

      {/* Projection Cone */}
      <polygon
        points="30,85 50,25 70,85"
        fill={`url(#hologramGradient-${color})`}
        opacity="0.1"
      />

      {/* Hologram Display */}
      <g filter={`url(#hologramGlow-${color})`}>
        {/* Frame */}
        <rect
          x="32"
          y="30"
          width="36"
          height="45"
          fill={`url(#gridPattern-${color})`}
          stroke={primaryColor}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Corner Brackets */}
        <polyline points="32,35 32,30 37,30" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
        <polyline points="68,35 68,30 63,30" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
        <polyline points="32,70 32,75 37,75" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
        <polyline points="68,70 68,75 63,75" fill="none" stroke={primaryColor} strokeWidth="1.5"/>

        {/* Content Lines */}
        <g opacity="0.7">
          <rect x="36" y="38" width="20" height="2" fill={primaryColor}>
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>}
          </rect>
          <rect x="36" y="44" width="28" height="2" fill={primaryColor}>
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="0.3s"/>}
          </rect>
          <rect x="36" y="50" width="24" height="2" fill={primaryColor}>
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="0.6s"/>}
          </rect>
          <rect x="36" y="56" width="18" height="2" fill={primaryColor}>
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="0.9s"/>}
          </rect>
          <rect x="36" y="62" width="22" height="2" fill={primaryColor}>
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="1.2s"/>}
          </rect>
        </g>
      </g>

      {/* Scan Line */}
      {animated && (
        <rect
          x="32"
          y="30"
          width="36"
          height="2"
          fill={primaryColor}
          opacity="0.5"
        >
          <animate attributeName="y" values="30;75;30" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite"/>
        </rect>
      )}

      {/* Projection Beams */}
      <g stroke={primaryColor} strokeWidth="0.5" opacity="0.3">
        <line x1="30" y1="85" x2="32" y2="75">
          {animated && <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>}
        </line>
        <line x1="70" y1="85" x2="68" y2="75">
          {animated && <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" begin="0.5s"/>}
        </line>
        <line x1="50" y1="85" x2="50" y2="75">
          {animated && <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" begin="1s"/>}
        </line>
      </g>

      {/* Floating Particles */}
      {animated && (
        <g fill={primaryColor} opacity="0.6">
          {[...Array(6)].map((_, i) => (
            <circle key={i} r="1">
              <animateMotion
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
                begin={`${i * 0.4}s`}
              >
                <mpath href={`#floatPath-${i % 2}-${color}`}/>
              </animateMotion>
              <animate attributeName="opacity" values="0;1;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite"/>
            </circle>
          ))}

          {/* Float paths */}
          <path id={`floatPath-0-${color}`} d="M30,85 Q40,50 50,25 T70,85" fill="none"/>
          <path id={`floatPath-1-${color}`} d="M70,85 Q60,50 50,25 T30,85" fill="none"/>
        </g>
      )}
    </svg>
  );
};

export default HologramDisplayIcon;
