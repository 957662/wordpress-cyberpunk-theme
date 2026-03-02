'use client';

import React from 'react';

interface HexagonFrameProps {
  size?: number;
  children?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'glow';
  color?: 'cyan' | 'purple' | 'pink' | 'multi';
  animated?: boolean;
  className?: string;
}

/**
 * 六边形框架组件
 *
 * 用于展示内容或作为装饰边框
 *
 * @example
 * <HexagonFrame size={200}>
 *   <span>Content</span>
 * </HexagonFrame>
 * <HexagonFrame variant="glow" animated />
 */
export const HexagonFrame: React.FC<HexagonFrameProps> = ({
  size = 200,
  children,
  variant = 'default',
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

  const points = `${size / 2},${size * 0.05} ${size * 0.95},${size * 0.275} ${size * 0.95},${size * 0.725} ${size / 2},${size * 0.95} ${size * 0.05},${size * 0.725} ${size * 0.05},${size * 0.275}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        className="absolute inset-0"
      >
        <defs>
          {currentColor === 'gradient' && (
            <linearGradient id={`hexGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#9d00ff" />
              <stop offset="100%" stopColor="#ff0080" />
            </linearGradient>
          )}
          {variant === 'glow' && (
            <filter id={`hexGlow-${size}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Outer hexagon */}
        <polygon
          points={points}
          stroke={currentColor === 'gradient' ? `url(#hexGradient-${size})` : currentColor}
          strokeWidth="3"
          strokeLinejoin="round"
          fill={
            variant === 'filled'
              ? (currentColor === 'gradient' ? `url(#hexGradient-${size})` : currentColor)
              : variant === 'default'
              ? 'rgba(0, 240, 255, 0.02)'
              : 'transparent'
          }
          fillOpacity={variant === 'filled' ? 0.2 : 1}
          filter={variant === 'glow' ? `url(#hexGlow-${size})` : undefined}
          className={animated ? 'animate-pulse' : ''}
        />

        {/* Inner hexagon for default variant */}
        {variant === 'default' && (
          <polygon
            points={`${size / 2},${size * 0.15} ${size * 0.85},${size * 0.325} ${size * 0.85},${size * 0.675} ${size / 2},${size * 0.85} ${size * 0.15},${size * 0.675} ${size * 0.15},${size * 0.325}`}
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.5"
            className={animated ? 'animate-spin-slow' : ''}
            style={{ animationDuration: '20s' }}
          />
        )}

        {/* Corner accents */}
        {variant !== 'minimal' && (
          <>
            <circle cx={size / 2} cy={size * 0.05} r="4" fill="#00f0ff" />
            <circle cx={size * 0.95} cy={size * 0.275} r="4" fill="#9d00ff" />
            <circle cx={size * 0.95} cy={size * 0.725} r="4" fill="#ff0080" />
            <circle cx={size / 2} cy={size * 0.95} r="4" fill="#f0ff00" />
            <circle cx={size * 0.05} cy={size * 0.725} r="4" fill="#00ff88" />
            <circle cx={size * 0.05} cy={size * 0.275} r="4" fill="#00f0ff" />
          </>
        )}

        {/* Floating particles */}
        {animated && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r="2"
            fill="#00f0ff"
            opacity="0.6"
            className="animate-pulse"
          >
            <animate
              attributeName="r"
              values="2;3;2"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>

      {/* Content */}
      {children && (
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default HexagonFrame;
