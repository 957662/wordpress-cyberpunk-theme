/**
 * DataStreamDecoration - 数据流装饰组件
 * 模拟数据流动的装饰效果
 */

import React from 'react';

export interface DataStreamDecorationProps {
  width?: number | string;
  height?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  animated?: boolean;
  density?: 'low' | 'medium' | 'high';
}

export const DataStreamDecoration: React.FC<DataStreamDecorationProps> = ({
  width = '100%',
  height = 50,
  className = '',
  variant = 'cyan',
  animated = true,
  density = 'medium',
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colors[variant];

  const getParticleCount = () => {
    switch (density) {
      case 'low': return 5;
      case 'medium': return 10;
      case 'high': return 15;
      default: return 10;
    }
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`stream-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`stream-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景线 */}
      <line
        x1="0"
        y1="25"
        x2="400"
        y2="25"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.2"
        strokeDasharray="2 2"
      />

      {/* 粒子 */}
      {Array.from({ length: getParticleCount() }).map((_, i) => {
        const delay = (i * 0.2) % 3;
        const duration = 2 + (i * 0.1);
        const yPos = 15 + (i % 3) * 10;

        return animated ? (
          <circle
            key={i}
            r="1.5"
            fill={color}
            filter={`url(#stream-glow-${variant})`}
            opacity="0.8"
          >
            <animate
              attributeName="cx"
              values="-5;405"
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
              keyTimes="0;0.1;0.9;1"
            />
          </circle>
        ) : (
          <circle
            key={i}
            cx={30 + i * 35}
            cy={yPos}
            r="1.5"
            fill={color}
            opacity={0.3 + (i * 0.05)}
          />
        );
      })}

      {/* 数据包 */}
      {animated ? (
        <>
          <rect
            x="0"
            y="23"
            width="8"
            height="4"
            rx="1"
            fill={color}
            opacity="0.9"
          >
            <animate
              attributeName="x"
              values="-10;410"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="3s"
              repeatCount="indefinite"
              keyTimes="0;0.1;0.9;1"
            />
          </rect>
          <rect
            x="0"
            y="23"
            width="8"
            height="4"
            rx="1"
            fill={color}
            opacity="0.9"
          >
            <animate
              attributeName="x"
              values="-10;410"
              dur="3s"
              begin="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="3s"
              begin="1.5s"
              repeatCount="indefinite"
              keyTimes="0;0.1;0.9;1"
            />
          </rect>
        </>
      ) : (
        <>
          <rect x="50" y="23" width="8" height="4" rx="1" fill={color} opacity="0.6" />
          <rect x="150" y="23" width="8" height="4" rx="1" fill={color} opacity="0.4" />
          <rect x="250" y="23" width="8" height="4" rx="1" fill={color} opacity="0.2" />
        </>
      )}

      {/* 节点 */}
      <circle cx="10" cy="25" r="2" fill={color} opacity="0.5" />
      <circle cx="390" cy="25" r="2" fill={color} opacity="0.5" />
    </svg>
  );
};

export default DataStreamDecoration;
