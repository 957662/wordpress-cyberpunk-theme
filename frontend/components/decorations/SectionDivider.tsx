/**
 * SectionDivider - 分区分隔线组件
 * 带数据流效果的分隔线
 */

import React from 'react';

export interface SectionDividerProps {
  width?: number | string;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  animated?: boolean;
  thickness?: number;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  width = '100%',
  className = '',
  variant = 'cyan',
  animated = false,
  thickness = 2,
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colors[variant];

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width, height: `${thickness + 40}px` }}
    >
      <svg
        width="100%"
        height="60"
        viewBox="0 0 400 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`divider-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="20%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="80%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${variant}`}>
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 主线 */}
        <line
          x1="0"
          y1="30"
          x2="400"
          y2="30"
          stroke={`url(#divider-grad-${variant})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          filter={`url(#glow-${variant})`}
        />

        {/* 中央装饰 */}
        <g transform="translate(200, 30)">
          {/* 外圈 */}
          <circle
            r="12"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
          {/* 内圈 */}
          <circle
            r="6"
            fill={color}
            opacity="0.8"
          />
          {/* 中心点 */}
          <circle
            r="2"
            fill="#ffffff"
            opacity="0.9"
          />

          {/* 旋转装饰 */}
          {animated && (
            <>
              <circle r="8" stroke={color} strokeWidth="0.5" fill="none" opacity="0.4">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="10" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="360"
                  to="0"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}
        </g>

        {/* 左侧装饰线 */}
        <line
          x1="80"
          y1="25"
          x2="80"
          y2="35"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        <circle
          cx="80"
          cy="30"
          r="2"
          fill={color}
          opacity="0.7"
        />

        {/* 右侧装饰线 */}
        <line
          x1="320"
          y1="25"
          x2="320"
          y2="35"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        <circle
          cx="320"
          cy="30"
          r="2"
          fill={color}
          opacity="0.7"
        />

        {/* 数据流动画 */}
        {animated && (
          <>
            <circle r="1.5" fill={color} opacity="0.9">
              <animate
                attributeName="cx"
                values="50;180"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="1.5" fill={color} opacity="0.9">
              <animate
                attributeName="cx"
                values="350;220"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
};

export default SectionDivider;
