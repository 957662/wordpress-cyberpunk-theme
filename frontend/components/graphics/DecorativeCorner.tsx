'use client';

import React from 'react';

interface DecorativeCornerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  variant?: 'default' | 'glow' | 'minimal';
  className?: string;
}

/**
 * 装饰性角标组件
 *
 * 用于卡片、区块的四角装饰
 *
 * @example
 * <DecorativeCorner position="top-left" />
 * <DecorativeCorner position="bottom-right" variant="glow" />
 */
export const DecorativeCorner: React.FC<DecorativeCornerProps> = ({
  position = 'top-left',
  size = 100,
  variant = 'default',
  className = '',
}) => {
  const rotationMap = {
    'top-left': '0deg',
    'top-right': '90deg',
    'bottom-right': '180deg',
    'bottom-left': '270deg',
  };

  const rotation = rotationMap[position];

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation})`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`cornerGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity={variant === 'glow' ? 1 : 0.8} />
            <stop offset="100%" stopColor="#9d00ff" stopOpacity={variant === 'glow' ? 1 : 0.6} />
          </linearGradient>
          {variant === 'glow' && (
            <filter id={`cornerGlow-${size}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Main corner bracket */}
        <path
          d="M5 5 L5 40 M5 5 L40 5"
          stroke={`url(#cornerGradient-${variant})`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={variant === 'glow' ? `url(#cornerGlow-${size})` : undefined}
          className={variant === 'glow' ? 'animate-pulse' : ''}
        />

        {/* Inner accent line */}
        {variant !== 'minimal' && (
          <path
            d="M12 12 L12 30 M12 12 L30 12"
            stroke="#ff0080"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        )}

        {/* Circuit nodes */}
        <circle cx="5" cy="5" r="3" fill="#00f0ff" />
        {variant !== 'minimal' && (
          <>
            <circle cx="20" cy="5" r="2" fill="#9d00ff" opacity="0.8" />
            <circle cx="5" cy="20" r="2" fill="#ff0080" opacity="0.8" />
          </>
        )}

        {/* Tech decoration */}
        {variant !== 'minimal' && (
          <>
            <rect x="45" y="8" width="8" height="2" fill="#00f0ff" opacity="0.5">
              <animate
                attributeName="opacity"
                values="0.3;0.7;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="45" y="13" width="5" height="2" fill="#9d00ff" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="8" y="45" width="2" height="8" fill="#00f0ff" opacity="0.5">
              <animate
                attributeName="opacity"
                values="0.3;0.7;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="13" y="45" width="2" height="5" fill="#9d00ff" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </rect>
          </>
        )}
      </svg>
    </div>
  );
};

export default DecorativeCorner;
