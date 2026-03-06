/**
 * DataFlowIcon - 数据流图标
 * 展示数据在管道中流动的赛博朋克风格图标
 */

import React from 'react';

export interface DataFlowIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  animated?: boolean;
  direction?: 'left' | 'right';
}

export const DataFlowIcon: React.FC<DataFlowIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
  animated = false,
  direction = 'right',
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
    green: '#00ff88',
  };

  const color = colors[variant];
  const dir = direction === 'right' ? 1 : -1;

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
        <linearGradient id={`data-flow-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${variant}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 管道背景 */}
      <rect
        x="4"
        y="20"
        width="56"
        height="8"
        rx="4"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <rect
        x="4"
        y="36"
        width="56"
        height="8"
        rx="4"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />

      {/* 流动数据块 */}
      {animated ? (
        <>
          {/* 上管道 */}
          <rect
            x="0"
            y="21"
            width="8"
            height="6"
            rx="2"
            fill={color}
            filter={`url(#glow-${variant})`}
            opacity="0.9"
          >
            <animate
              attributeName="x"
              values={`-8;72`}
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="0"
            y="21"
            width="8"
            height="6"
            rx="2"
            fill={color}
            filter={`url(#glow-${variant})`}
            opacity="0.9"
          >
            <animate
              attributeName="x"
              values={`-8;72`}
              dur="2s"
              begin="0.7s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="0"
            y="21"
            width="8"
            height="6"
            rx="2"
            fill={color}
            filter={`url(#glow-${variant})`}
            opacity="0.9"
          >
            <animate
              attributeName="x"
              values={`-8;72`}
              dur="2s"
              begin="1.4s"
              repeatCount="indefinite"
            />
          </rect>

          {/* 下管道 */}
          <rect
            x="0"
            y="37"
            width="8"
            height="6"
            rx="2"
            fill={color}
            filter={`url(#glow-${variant})`}
            opacity="0.9"
          >
            <animate
              attributeName="x"
              values={`-8;72`}
              dur="2.5s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="0"
            y="37"
            width="8"
            height="6"
            rx="2"
            fill={color}
            filter={`url(#glow-${variant})`}
            opacity="0.9"
          >
            <animate
              attributeName="x"
              values={`-8;72`}
              dur="2.5s"
              begin="0.8s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="0"
            y="37"
            width="8"
            height="6"
            rx="2"
            fill={color}
            filter={`url(#glow-${variant})`}
            opacity="0.9"
          >
            <animate
              attributeName="x"
              values={`-8;72`}
              dur="2.5s"
              begin="1.6s"
              repeatCount="indefinite"
            />
          </rect>
        </>
      ) : (
        <>
          {/* 静态数据块 */}
          <rect
            x="12"
            y="21"
            width="8"
            height="6"
            rx="2"
            fill={color}
            opacity="0.9"
          />
          <rect
            x="28"
            y="21"
            width="8"
            height="6"
            rx="2"
            fill={color}
            opacity="0.6"
          />
          <rect
            x="44"
            y="21"
            width="8"
            height="6"
            rx="2"
            fill={color}
            opacity="0.3"
          />
          <rect
            x="20"
            y="37"
            width="8"
            height="6"
            rx="2"
            fill={color}
            opacity="0.9"
          />
          <rect
            x="36"
            y="37"
            width="8"
            height="6"
            rx="2"
            fill={color}
            opacity="0.6"
          />
        </>
      )}

      {/* 连接节点 */}
      <circle cx="8" cy="24" r="2" fill={color} opacity="0.5" />
      <circle cx="56" cy="24" r="2" fill={color} opacity="0.5" />
      <circle cx="8" cy="40" r="2" fill={color} opacity="0.5" />
      <circle cx="56" cy="40" r="2" fill={color} opacity="0.5" />

      {/* 箭头指示 */}
      {direction === 'right' ? (
        <>
          <polygon points="58,24 62,22 62,26" fill={color} opacity="0.8" />
          <polygon points="58,40 62,38 62,42" fill={color} opacity="0.8" />
        </>
      ) : (
        <>
          <polygon points="6,24 2,22 2,26" fill={color} opacity="0.8" />
          <polygon points="6,40 2,38 2,42" fill={color} opacity="0.8" />
        </>
      )}
    </svg>
  );
};

export default DataFlowIcon;
