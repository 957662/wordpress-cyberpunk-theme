/**
 * NeuralNetworkIcon - 神经网络图标
 * AI 神经网络连接的可视化图标
 */

import React from 'react';

export interface NeuralNetworkIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  animated?: boolean;
}

export const NeuralNetworkIcon: React.FC<NeuralNetworkIconProps> = ({
  size = 24,
  className = '',
  variant = 'purple',
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
        <linearGradient id={`neural-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
        {animated && (
          <>
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </>
        )}
      </defs>

      {/* 输入层节点 */}
      <circle cx="12" cy="16" r="4" fill={color} opacity="0.9" />
      <circle cx="12" cy="32" r="4" fill={color} opacity="0.9" />
      <circle cx="12" cy="48" r="4" fill={color} opacity="0.9" />

      {/* 隐藏层节点 */}
      <circle cx="32" cy="12" r="4" fill={color} opacity="0.7" />
      <circle cx="32" cy="24" r="4" fill={color} opacity="0.7" />
      <circle cx="32" cy="40" r="4" fill={color} opacity="0.7" />
      <circle cx="32" cy="52" r="4" fill={color} opacity="0.7" />

      {/* 输出层节点 */}
      <circle cx="52" cy="20" r="4" fill={color} opacity="0.9" />
      <circle cx="52" cy="44" r="4" fill={color} opacity="0.9" />

      {/* 连接线 - 输入到隐藏 */}
      <g stroke={color} strokeWidth="1" opacity="0.4">
        <line x1="12" y1="16" x2="32" y2="12" />
        <line x1="12" y1="16" x2="32" y2="24" />
        <line x1="12" y1="32" x2="32" y2="24" />
        <line x1="12" y1="32" x2="32" y2="40" />
        <line x1="12" y1="48" x2="32" y2="40" />
        <line x1="12" y1="48" x2="32" y2="52" />
        <line x1="12" y1="16" x2="32" y2="40" opacity="0.5" />
        <line x1="12" y1="48" x2="32" y2="24" opacity="0.5" />
      </g>

      {/* 连接线 - 隐藏到输出 */}
      <g stroke={color} strokeWidth="1" opacity="0.4">
        <line x1="32" y1="12" x2="52" y2="20" />
        <line x1="32" y1="24" x2="52" y2="20" />
        <line x1="32" y1="24" x2="52" y2="44" />
        <line x1="32" y1="40" x2="52" y2="20" />
        <line x1="32" y1="40" x2="52" y2="44" />
        <line x1="32" y1="52" x2="52" y2="44" />
      </g>

      {/* 脉冲动画效果 */}
      {animated && (
        <>
          <circle r="2" fill={color}>
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M12,16 L32,12 L52,20"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2" fill={color}>
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              path="M12,32 L32,24 L52,20"
              begin="0.3s"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1.8s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>
          <circle r="2" fill={color}>
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M12,48 L32,40 L52,44"
              begin="0.6s"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="2s"
              repeatCount="indefinite"
              begin="0.6s"
            />
          </circle>
        </>
      )}
    </svg>
  );
};

export default NeuralNetworkIcon;
