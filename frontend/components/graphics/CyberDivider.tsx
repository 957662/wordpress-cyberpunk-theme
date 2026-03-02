'use client';

import React from 'react';

interface CyberDividerProps {
  width?: number;
  thickness?: number;
  variant?: 'gradient' | 'dashed' | 'dotted' | 'glow';
  color?: 'cyan' | 'purple' | 'pink' | 'multi';
  animated?: boolean;
  className?: string;
}

/**
 * 赛博朋克风格分割线组件
 *
 * @example
 * <CyberDivider />
 * <CyberDivider variant="glow" color="cyan" animated />
 * <CyberDivider width={400} thickness={2} />
 */
export const CyberDivider: React.FC<CyberDividerProps> = ({
  width = 400,
  thickness = 2,
  variant = 'gradient',
  color = 'multi',
  animated = false,
  className = '',
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    multi: 'gradient',
  };

  const currentColor = colorMap[color];

  const renderDivider = () => {
    switch (variant) {
      case 'dashed':
        return (
          <line
            x1="0"
            y1={thickness}
            x2={width}
            y2={thickness}
            stroke={currentColor === 'gradient' ? '#9d00ff' : currentColor}
            strokeWidth={thickness}
            strokeDasharray="8,8"
            strokeLinecap="round"
            className={animated ? 'animate-pulse' : ''}
          />
        );

      case 'dotted':
        return (
          <line
            x1="0"
            y1={thickness}
            x2={width}
            y2={thickness}
            stroke={currentColor === 'gradient' ? '#9d00ff' : currentColor}
            strokeWidth={thickness}
            strokeDasharray="2,6"
            strokeLinecap="round"
            className={animated ? 'animate-pulse' : ''}
          />
        );

      case 'glow':
        return (
          <g className={animated ? 'animate-pulse' : ''}>
            <defs>
              <filter id={`glow-${width}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              x1="0"
              y1={thickness}
              x2={width}
              y2={thickness}
              stroke={currentColor === 'gradient' ? '#9d00ff' : currentColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              filter={`url(#glow-${width})`}
            />
          </g>
        );

      default: // gradient
        return (
          <g>
            <defs>
              <linearGradient id={`divider-${width}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                <stop offset="50%" stopColor="#9d00ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff0080" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line
              x1="0"
              y1={thickness}
              x2={width}
              y2={thickness}
              stroke={`url(#divider-${width})`}
              strokeWidth={thickness}
              strokeLinecap="round"
              className={animated ? 'animate-pulse' : ''}
            />
          </g>
        );
    }
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: '100%' }}
    >
      <svg
        width="100%"
        height={thickness * 4}
        viewBox={`0 0 ${width} ${thickness * 4}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {renderDivider()}

        {/* Center diamond for gradient variant */}
        {variant === 'gradient' && (
          <>
            <polygon
              points={`${width / 2},${thickness * 2 - 6} ${width / 2 + 6},${thickness * 2} ${width / 2},${thickness * 2 + 6} ${width / 2 - 6},${thickness * 2}`}
              fill="#00f0ff"
              className={animated ? 'animate-pulse' : ''}
            >
              {animated && (
                <animate
                  attributeName="opacity"
                  values="0.8;1;0.8"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </polygon>

            {/* Side accents */}
            <circle
              cx={width * 0.25}
              cy={thickness * 2}
              r="2"
              fill="#9d00ff"
              opacity="0.6"
              className={animated ? 'animate-pulse' : ''}
            >
              {animated && (
                <animate
                  attributeName="r"
                  values="2;3;2"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <circle
              cx={width * 0.75}
              cy={thickness * 2}
              r="2"
              fill="#ff0080"
              opacity="0.6"
              className={animated ? 'animate-pulse' : ''}
            >
              {animated && (
                <animate
                  attributeName="r"
                  values="2;3;2"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </>
        )}
      </svg>
    </div>
  );
};

export default CyberDivider;
