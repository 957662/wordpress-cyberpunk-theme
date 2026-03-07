'use client';

import React from 'react';

export interface DataStreamIconProps {
  size?: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'green';
  animated?: boolean;
}

/**
 * 数据流图标 - 赛博朋克风格
 * 展示数据流动和传输效果
 */
export const DataStreamIcon: React.FC<DataStreamIconProps> = ({
  size = 100,
  className = '',
  color = 'cyan',
  animated = true,
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    green: '#00ff88',
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
        <linearGradient id={`streamGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0"/>
          <stop offset="50%" stopColor={primaryColor} stopOpacity="1"/>
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0"/>
        </linearGradient>

        <filter id={`streamGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background Grid */}
      <g stroke={primaryColor} strokeWidth="0.3" opacity="0.2">
        <line x1="10" y1="20" x2="90" y2="20"/>
        <line x1="10" y1="40" x2="90" y2="40"/>
        <line x1="10" y1="60" x2="90" y2="60"/>
        <line x1="10" y1="80" x2="90" y2="80"/>

        <line x1="20" y1="10" x2="20" y2="90"/>
        <line x1="40" y1="10" x2="40" y2="90"/>
        <line x1="60" y1="10" x2="60" y2="90"/>
        <line x1="80" y1="10" x2="80" y2="90"/>
      </g>

      {/* Data Stream Lines */}
      {animated ? (
        <>
          {/* Stream 1 */}
          <rect
            x="10"
            y="20"
            width="20"
            height="2"
            fill={`url(#streamGradient-${color})`}
            filter={`url(#streamGlow-${color})`}
          >
            <animate attributeName="x" values="10;70;10" dur="3s" repeatCount="indefinite"/>
          </rect>

          {/* Stream 2 */}
          <rect
            x="70"
            y="40"
            width="20"
            height="2"
            fill={`url(#streamGradient-${color})`}
            filter={`url(#streamGlow-${color})`}
          >
            <animate attributeName="x" values="70;10;70" dur="2.5s" repeatCount="indefinite"/>
          </rect>

          {/* Stream 3 */}
          <rect
            x="10"
            y="60"
            width="20"
            height="2"
            fill={`url(#streamGradient-${color})`}
            filter={`url(#streamGlow-${color})`}
          >
            <animate attributeName="x" values="10;70;10" dur="2s" repeatCount="indefinite"/>
          </rect>

          {/* Stream 4 */}
          <rect
            x="70"
            y="80"
            width="20"
            height="2"
            fill={`url(#streamGradient-${color})`}
            filter={`url(#streamGlow-${color})`}
          >
            <animate attributeName="x" values="70;10;70" dur="2.8s" repeatCount="indefinite"/>
          </rect>

          {/* Vertical Stream */}
          <rect
            x="49"
            y="10"
            width="2"
            height="20"
            fill={`url(#streamGradient-${color})`}
            filter={`url(#streamGlow-${color})`}
          >
            <animate attributeName="y" values="10;70;10" dur="3.5s" repeatCount="indefinite"/>
          </rect>
        </>
      ) : (
        <>
          {/* Static streams */}
          <rect x="20" y="20" width="30" height="2" fill={primaryColor} opacity="0.6"/>
          <rect x="50" y="40" width="30" height="2" fill={primaryColor} opacity="0.6"/>
          <rect x="20" y="60" width="30" height="2" fill={primaryColor} opacity="0.6"/>
          <rect x="50" y="80" width="30" height="2" fill={primaryColor} opacity="0.6"/>
        </>
      )}

      {/* Data Packets */}
      {animated && (
        <g fill={primaryColor}>
          {[...Array(8)].map((_, i) => (
            <circle key={i} r="1.5">
              <animateMotion
                dur={`${2 + Math.random()}s`}
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              >
                <mpath href={`#streamPath-${i % 4}-${color}`}/>
              </animateMotion>
            </circle>
          ))}

          {/* Stream paths */}
          <path id={`streamPath-0-${color}`} d="M10,20 L90,20" fill="none"/>
          <path id={`streamPath-1-${color}`} d="M90,40 L10,40" fill="none"/>
          <path id={`streamPath-2-${color}`} d="M10,60 L90,60" fill="none"/>
          <path id={`streamPath-3-${color}`} d="M90,80 L10,80" fill="none"/>
        </g>
      )}

      {/* Center Hub */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill={primaryColor}
        opacity="0.3"
      >
        {animated && <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite"/>}
      </circle>

      <circle
        cx="50"
        cy="50"
        r="4"
        fill={primaryColor}
        filter={`url(#streamGlow-${color})`}
      />
    </svg>
  );
};

export default DataStreamIcon;
