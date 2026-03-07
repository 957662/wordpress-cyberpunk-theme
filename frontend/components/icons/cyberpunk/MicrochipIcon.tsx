'use client';

import React from 'react';

export interface MicrochipIconProps {
  size?: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'green';
  animated?: boolean;
}

/**
 * 微芯片图标 - 赛博朋克风格
 * 展示电路和连接点效果
 */
export const MicrochipIcon: React.FC<MicrochipIconProps> = ({
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
        <filter id={`chipGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <radialGradient id={`nodeGlow-${color}`}>
          <stop offset="0%" stopColor={primaryColor} stopOpacity="1"/>
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Chip Body */}
      <rect
        x="30"
        y="30"
        width="40"
        height="40"
        fill="none"
        stroke={primaryColor}
        strokeWidth="2"
        filter={`url(#chipGlow-${color})`}
      />

      {/* Inner Circuit Lines */}
      <g stroke={primaryColor} strokeWidth="0.5" opacity="0.6">
        {/* Horizontal lines */}
        <line x1="35" y1="38" x2="65" y2="38"/>
        <line x1="35" y1="50" x2="65" y2="50"/>
        <line x1="35" y1="62" x2="65" y2="62"/>

        {/* Vertical lines */}
        <line x1="42" y1="35" x2="42" y2="65"/>
        <line x1="50" y1="35" x2="50" y2="65"/>
        <line x1="58" y1="35" x2="58" y2="65"/>
      </g>

      {/* Connection Pins - Left */}
      <g>
        {[38, 46, 54, 62].map((y, i) => (
          <line
            key={`left-${i}`}
            x1="20"
            y1={y}
            x2="30"
            y2={y}
            stroke={primaryColor}
            strokeWidth="1.5"
            opacity="0.8"
          >
            {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite"/>}
          </line>
        ))}
      </g>

      {/* Connection Pins - Right */}
      <g>
        {[38, 46, 54, 62].map((y, i) => (
          <line
            key={`right-${i}`}
            x1="70"
            y1={y}
            x2="80"
            y2={y}
            stroke={primaryColor}
            strokeWidth="1.5"
            opacity="0.8"
          >
            {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.7 + i * 0.2}s`} repeatCount="indefinite"/>}
          </line>
        ))}
      </g>

      {/* Connection Pins - Top */}
      <g>
        {[38, 46, 54, 62].map((x, i) => (
          <line
            key={`top-${i}`}
            x1={x}
            y1="20"
            x2={x}
            y2="30"
            stroke={primaryColor}
            strokeWidth="1.5"
            opacity="0.8"
          >
            {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite"/>}
          </line>
        ))}
      </g>

      {/* Connection Pins - Bottom */}
      <g>
        {[38, 46, 54, 62].map((x, i) => (
          <line
            key={`bottom-${i}`}
            x1={x}
            y1="70"
            x2={x}
            y2="80"
            stroke={primaryColor}
            strokeWidth="1.5"
            opacity="0.8"
          >
            {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite"/>}
          </line>
        ))}
      </g>

      {/* Connection Nodes */}
      {[
        { x: 38, y: 38 }, { x: 50, y: 38 }, { x: 62, y: 38 },
        { x: 42, y: 50 }, { x: 58, y: 50 },
        { x: 38, y: 62 }, { x: 50, y: 62 }, { x: 62, y: 62 },
      ].map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r="3"
          fill={`url(#nodeGlow-${color})`}
          stroke={primaryColor}
          strokeWidth="0.5"
        >
          {animated && (
            <animate
              attributeName="r"
              values="2.5;3.5;2.5"
              dur={`${2 + i * 0.1}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}

      {/* Central Core */}
      <circle
        cx="50"
        cy="50"
        r="6"
        fill={primaryColor}
        opacity="0.2"
      >
        {animated && <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/>}
      </circle>

      <circle
        cx="50"
        cy="50"
        r="3"
        fill={primaryColor}
        filter={`url(#chipGlow-${color})`}
      />

      {/* Data Flow Particles */}
      {animated && (
        <g fill={primaryColor} opacity="0.8">
          <circle r="1">
            <animateMotion dur="2s" repeatCount="indefinite" path="M20,38 L30,38"/>
          </circle>
          <circle r="1">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M70,54 L80,54"/>
          </circle>
          <circle r="1">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M38,20 L38,30"/>
          </circle>
          <circle r="1">
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M62,70 L62,80"/>
          </circle>
        </g>
      )}
    </svg>
  );
};

export default MicrochipIcon;
