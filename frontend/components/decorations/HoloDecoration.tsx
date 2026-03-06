/**
 * HoloDecoration - 全息装饰组件
 * 全息投影效果的装饰元素
 */

import React from 'react';

export interface HoloDecorationProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  animated?: boolean;
  type?: 'ring' | 'grid' | 'wave';
}

export const HoloDecoration: React.FC<HoloDecorationProps> = ({
  size = 100,
  className = '',
  variant = 'cyan',
  animated = true,
  type = 'ring',
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colors[variant];

  const renderRing = () => (
    <>
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <circle
        cx="50"
        cy="50"
        r="30"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
        strokeDasharray="4 2"
      />
      <circle
        cx="50"
        cy="50"
        r="20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <circle
        cx="50"
        cy="50"
        r="10"
        fill={color}
        opacity="0.9"
      />
      {animated && (
        <>
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke={color}
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="50"
            cy="50"
            r="25"
            stroke={color}
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </>
  );

  const renderGrid = () => (
    <>
      {/* 网格线 */}
      <g stroke={color} strokeWidth="0.5" opacity="0.4">
        {/* 垂直线 */}
        <line x1="20" y1="20" x2="20" y2="80" />
        <line x1="30" y1="20" x2="30" y2="80" />
        <line x1="40" y1="20" x2="40" y2="80" />
        <line x1="50" y1="20" x2="50" y2="80" />
        <line x1="60" y1="20" x2="60" y2="80" />
        <line x1="70" y1="20" x2="70" y2="80" />
        <line x1="80" y1="20" x2="80" y2="80" />

        {/* 水平线 */}
        <line x1="20" y1="20" x2="80" y2="20" />
        <line x1="20" y1="30" x2="80" y2="30" />
        <line x1="20" y1="40" x2="80" y2="40" />
        <line x1="20" y1="50" x2="80" y2="50" />
        <line x1="20" y1="60" x2="80" y2="60" />
        <line x1="20" y1="70" x2="80" y2="70" />
        <line x1="20" y1="80" x2="80" y2="80" />
      </g>

      {/* 中心点 */}
      <circle cx="50" cy="50" r="3" fill={color} opacity="0.8" />

      {animated && (
        <>
          {/* 扫描效果 */}
          <rect
            x="20"
            y="0"
            width="60"
            height="2"
            fill={color}
            opacity="0.6"
          >
            <animate
              attributeName="y"
              values="20;80;20"
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
        </>
      )}
    </>
  );

  const renderWave = () => (
    <>
      <path
        d="M20 50 Q35 30, 50 50 T80 50"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M20 50 Q35 70, 50 50 T80 50"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <circle cx="50" cy="50" r="4" fill={color} opacity="0.9" />
      {animated && (
        <>
          <circle r="2" fill={color} opacity="0.6">
            <animate
              attributeName="r"
              values="2;25"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </>
  );

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
        <radialGradient id={`holo-${variant}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 背景光晕 */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill={`url(#holo-${variant})`}
      />

      {/* 根据类型渲染不同的装饰 */}
      {type === 'ring' && renderRing()}
      {type === 'grid' && renderGrid()}
      {type === 'wave' && renderWave()}
    </svg>
  );
};

export default HoloDecoration;
