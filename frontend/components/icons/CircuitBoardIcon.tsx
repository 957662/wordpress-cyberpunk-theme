/**
 * CircuitBoardIcon - 电路板图标
 * 精致的电路板线路设计图标
 */

import React from 'react';

export interface CircuitBoardIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  animated?: boolean;
}

export const CircuitBoardIcon: React.FC<CircuitBoardIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
  animated = false,
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
    green: '#00ff88',
  };

  const color = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`circuit-glow-${variant}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 主芯片 */}
      <rect
        x="24"
        y="24"
        width="16"
        height="16"
        rx="2"
        fill={color}
        opacity="0.2"
        stroke={color}
        strokeWidth="1.5"
      />

      {/* 芯片内部细节 */}
      <rect
        x="28"
        y="28"
        width="8"
        height="8"
        fill={color}
        opacity="0.6"
      />
      <circle cx="32" cy="32" r="2" fill={color} opacity="0.9" />

      {/* 左侧线路 */}
      <g stroke={color} strokeWidth="1" fill="none" opacity="0.7">
        <path d="M24 28 L12 28 L12 16" />
        <path d="M24 32 L8 32" />
        <path d="M24 36 L12 36 L12 48" />
      </g>

      {/* 右侧线路 */}
      <g stroke={color} strokeWidth="1" fill="none" opacity="0.7">
        <path d="M40 28 L52 28 L52 16" />
        <path d="M40 32 L56 32" />
        <path d="M40 36 L52 36 L52 48" />
      </g>

      {/* 上方线路 */}
      <g stroke={color} strokeWidth="1" fill="none" opacity="0.7">
        <path d="M28 24 L28 12 L20 12" />
        <path d="M32 24 L32 8" />
        <path d="M36 24 L36 12 L44 12" />
      </g>

      {/* 下方线路 */}
      <g stroke={color} strokeWidth="1" fill="none" opacity="0.7">
        <path d="M28 40 L28 52 L20 52" />
        <path d="M32 40 L32 56" />
        <path d="M36 40 L36 52 L44 52" />
      </g>

      {/* 节点 */}
      <circle cx="12" cy="16" r="2" fill={color} opacity="0.9" />
      <circle cx="12" cy="48" r="2" fill={color} opacity="0.9" />
      <circle cx="52" cy="16" r="2" fill={color} opacity="0.9" />
      <circle cx="52" cy="48" r="2" fill={color} opacity="0.9" />
      <circle cx="8" cy="32" r="2" fill={color} opacity="0.9" />
      <circle cx="56" cy="32" r="2" fill={color} opacity="0.9" />
      <circle cx="20" cy="12" r="2" fill={color} opacity="0.9" />
      <circle cx="44" cy="12" r="2" fill={color} opacity="0.9" />
      <circle cx="20" cy="52" r="2" fill={color} opacity="0.9" />
      <circle cx="44" cy="52" r="2" fill={color} opacity="0.9" />
      <circle cx="32" cy="8" r="2" fill={color} opacity="0.9" />
      <circle cx="32" cy="56" r="2" fill={color} opacity="0.9" />

      {/* 脉冲动画 */}
      {animated && (
        <>
          <circle r="1.5" fill={color} filter={`url(#circuit-glow-${variant})`}>
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M12,16 L24,28 L32,32"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="1.5" fill={color} filter={`url(#circuit-glow-${variant})`}>
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M56,32 L40,32 L32,32"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>
          <circle r="1.5" fill={color} filter={`url(#circuit-glow-${variant})`}>
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M32,8 L32,24 L32,32"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </>
      )}
    </svg>
  );
};

export default CircuitBoardIcon;
