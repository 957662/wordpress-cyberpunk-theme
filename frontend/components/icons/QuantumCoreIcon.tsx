/**
 * QuantumCoreIcon - 量子核心图标
 * 赛博朋克风格的量子处理器核心图标
 */

import React from 'react';

export interface QuantumCoreIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  animated?: boolean;
}

export const QuantumCoreIcon: React.FC<QuantumCoreIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
  animated = false,
}) => {
  const colors = {
    cyan: {
      primary: '#00f0ff',
      secondary: '#00a0aa',
      glow: 'rgba(0, 240, 255, 0.6)',
    },
    purple: {
      primary: '#9d00ff',
      secondary: '#6600aa',
      glow: 'rgba(157, 0, 255, 0.6)',
    },
    pink: {
      primary: '#ff0080',
      secondary: '#aa0055',
      glow: 'rgba(255, 0, 128, 0.6)',
    },
    yellow: {
      primary: '#f0ff00',
      secondary: '#a0aa00',
      glow: 'rgba(240, 255, 0, 0.6)',
    },
    green: {
      primary: '#00ff88',
      secondary: '#00aa55',
      glow: 'rgba(0, 255, 136, 0.6)',
    },
  };

  const colorSet = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        filter: `drop-shadow(0 0 4px ${colorSet.glow})`,
      }}
    >
      <defs>
        <radialGradient id={`quantum-core-${variant}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colorSet.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colorSet.secondary} stopOpacity="0.2" />
        </radialGradient>
        {animated && (
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 32 32"
            to="360 32 32"
            dur="8s"
            repeatCount="indefinite"
          />
        )}
      </defs>

      {/* 外圈 */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke={colorSet.primary}
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* 中圈 */}
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke={colorSet.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.6"
        strokeDasharray="4 2"
      />

      {/* 内圈 */}
      <circle
        cx="32"
        cy="32"
        r="12"
        stroke={colorSet.secondary}
        strokeWidth="2"
        fill={`url(#quantum-core-${variant})}`}
        opacity="0.9"
      />

      {/* 核心点 */}
      <circle
        cx="32"
        cy="32"
        r="6"
        fill={colorSet.primary}
        opacity="0.8"
      />

      {/* 轨道线 */}
      {animated ? (
        <>
          <ellipse
            cx="32"
            cy="32"
            rx="24"
            ry="24"
            stroke={colorSet.primary}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
            transform="rotate(45 32 32)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 32 32"
              to="360 32 32"
              dur="6s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse
            cx="32"
            cy="32"
            rx="24"
            ry="24"
            stroke={colorSet.secondary}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
            transform="rotate(-45 32 32)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 32 32"
              to="0 32 32"
              dur="8s"
              repeatCount="indefinite"
            />
          </ellipse>
        </>
      ) : (
        <>
          <ellipse
            cx="32"
            cy="32"
            rx="24"
            ry="24"
            stroke={colorSet.primary}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
            transform="rotate(45 32 32)"
          />
          <ellipse
            cx="32"
            cy="32"
            rx="24"
            ry="24"
            stroke={colorSet.secondary}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
            transform="rotate(-45 32 32)"
          />
        </>
      )}

      {/* 节点 */}
      <circle cx="32" cy="4" r="2" fill={colorSet.primary} opacity="0.9" />
      <circle cx="32" cy="60" r="2" fill={colorSet.primary} opacity="0.9" />
      <circle cx="4" cy="32" r="2" fill={colorSet.secondary} opacity="0.9" />
      <circle cx="60" cy="32" r="2" fill={colorSet.secondary} opacity="0.9" />
    </svg>
  );
};

export default QuantumCoreIcon;
