/**
 * HolographicIcon - 全息投影图标
 * 3D 全息投影效果图标
 */

import React from 'react';

export interface HolographicIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  animated?: boolean;
}

export const HolographicIcon: React.FC<HolographicIconProps> = ({
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
        <linearGradient id={`holo-grad-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`holo-grad-2-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* 基座 */}
      <ellipse
        cx="32"
        cy="56"
        rx="20"
        ry="4"
        fill={color}
        opacity="0.3"
      />
      <ellipse
        cx="32"
        cy="56"
        rx="12"
        ry="2"
        fill={color}
        opacity="0.6"
      />

      {/* 全息光束 */}
      <path
        d="M32 56 L20 20 L44 20 Z"
        fill={`url(#holo-grad-${variant})`}
        opacity="0.2"
      />
      <path
        d="M32 56 L24 28 L40 28 Z"
        fill={`url(#holo-grad-${variant})`}
        opacity="0.3"
      />

      {/* 主体 - 3D 立方体效果 */}
      <g stroke={color} strokeWidth="1" fill="none">
        {/* 前平面 */}
        <rect x="22" y="24" width="20" height="20" opacity="0.8" />

        {/* 后平面 */}
        <rect x="26" y="20" width="20" height="20" opacity="0.4" />

        {/* 连接线 */}
        <line x1="22" y1="24" x2="26" y2="20" opacity="0.5" />
        <line x1="42" y1="24" x2="46" y2="20" opacity="0.5" />
        <line x1="22" y1="44" x2="26" y2="40" opacity="0.5" />
        <line x1="42" y1="44" x2="46" y2="40" opacity="0.5" />
      </g>

      {/* 内部网格 */}
      <g stroke={color} strokeWidth="0.5" opacity="0.3">
        {/* 前平面网格 */}
        <line x1="27" y1="24" x2="27" y2="44" />
        <line x1="32" y1="24" x2="32" y2="44" />
        <line x1="37" y1="24" x2="37" y2="44" />
        <line x1="22" y1="29" x2="42" y2="29" />
        <line x1="22" y1="34" x2="42" y2="34" />
        <line x1="22" y1="39" x2="42" y2="39" />

        {/* 后平面网格 */}
        <line x1="31" y1="20" x2="31" y2="40" />
        <line x1="36" y1="20" x2="36" y2="40" />
        <line x1="41" y1="20" x2="41" y2="40" />
        <line x1="26" y1="25" x2="46" y2="25" />
        <line x1="26" y1="30" x2="46" y2="30" />
        <line x1="26" y1="35" x2="46" y2="35" />
      </g>

      {/* 扫描线效果 */}
      {animated && (
        <>
          <rect
            x="18"
            y="16"
            width="28"
            height="2"
            fill={color}
            opacity="0.6"
          >
            <animate
              attributeName="y"
              values="16;44;16"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur="3s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="22"
            y="20"
            width="20"
            height="1"
            fill={color}
            opacity="0.4"
          >
            <animate
              attributeName="y"
              values="20;44;20"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </rect>
        </>
      )}

      {/* 粒子效果 */}
      {animated && (
        <>
          <circle r="0.5" fill={color}>
            <animate
              attributeName="cy"
              values="56;24"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values="28;32;36;32"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="0.5" fill={color}>
            <animate
              attributeName="cy"
              values="56;28"
              dur="2.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="cx"
              values="30;34;38;34"
              dur="2.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* 顶部光点 */}
      <circle cx="32" cy="20" r="2" fill={color} opacity="0.8" />
      <circle cx="26" cy="24" r="1" fill={color} opacity="0.6" />
      <circle cx="38" cy="24" r="1" fill={color} opacity="0.6" />
    </svg>
  );
};

export default HolographicIcon;
