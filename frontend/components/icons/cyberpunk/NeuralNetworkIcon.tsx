'use client';

import React from 'react';

export interface NeuralNetworkIconProps {
  size?: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink';
  animated?: boolean;
}

/**
 * 神经网络图标 - 赛博朋克风格
 * 展示节点连接和数据流动效果
 */
export const NeuralNetworkIcon: React.FC<NeuralNetworkIconProps> = ({
  size = 100,
  className = '',
  color = 'cyan',
  animated = true,
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
  };

  const primaryColor = colorMap[color];

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
        <filter id={`neuralGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <radialGradient id={`nodeGlow1-${color}`}>
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0"/>
        </radialGradient>

        <radialGradient id={`nodeGlow2-${color}`}>
          <stop offset="0%" stopColor={colorMap.purple} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={colorMap.purple} stopOpacity="0"/>
        </radialGradient>

        <radialGradient id={`nodeGlow3-${color}`}>
          <stop offset="0%" stopColor={colorMap.pink} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={colorMap.pink} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Neural Connections */}
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.4" filter={`url(#neuralGlow-${color})`}>
        {/* Layer 1 to Layer 2 */}
        <line x1="15" y1="20" x2="40" y2="15"/>
        <line x1="15" y1="20" x2="40" y2="35"/>
        <line x1="15" y1="20" x2="40" y2="55"/>
        <line x1="15" y1="50" x2="40" y2="35"/>
        <line x1="15" y1="50" x2="40" y2="55"/>
        <line x1="15" y1="50" x2="40" y2="75"/>
        <line x1="15" y1="80" x2="40" y2="55"/>
        <line x1="15" y1="80" x2="40" y2="75"/>
        <line x1="15" y1="80" x2="40" y2="95"/>

        {/* Layer 2 to Layer 3 */}
        <line x1="40" y1="15" x2="65" y2="25"/>
        <line x1="40" y1="15" x2="65" y2="50"/>
        <line x1="40" y1="35" x2="65" y2="25"/>
        <line x1="40" y1="35" x2="65" y2="50"/>
        <line x1="40" y1="35" x2="65" y2="75"/>
        <line x1="40" y1="55" x2="65" y2="50"/>
        <line x1="40" y1="55" x2="65" y2="75"/>
        <line x1="40" y1="75" x2="65" y2="50"/>
        <line x1="40" y1="75" x2="65" y2="75"/>
        <line x1="40" y1="95" x2="65" y2="75"/>

        {/* Layer 3 to Output */}
        <line x1="65" y1="25" x2="90" y2="50"/>
        <line x1="65" y1="50" x2="90" y2="50"/>
        <line x1="65" y1="75" x2="90" y2="50"/>
      </g>

      {/* Input Nodes (Left) */}
      <g>
        <circle cx="15" cy="20" r="6" fill={`url(#nodeGlow1-${color})`} stroke={primaryColor} strokeWidth="1">
          {animated && <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="15" cy="50" r="6" fill={`url(#nodeGlow1-${color})`} stroke={primaryColor} strokeWidth="1">
          {animated && <animate attributeName="r" values="6;7;6" dur="2.3s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="15" cy="80" r="6" fill={`url(#nodeGlow1-${color})`} stroke={primaryColor} strokeWidth="1">
          {animated && <animate attributeName="r" values="6;7;6" dur="2.6s" repeatCount="indefinite"/>}
        </circle>
      </g>

      {/* Hidden Layer Nodes (Middle) */}
      <g>
        <circle cx="40" cy="15" r="5" fill={`url(#nodeGlow2-${color})`} stroke={colorMap.purple} strokeWidth="1">
          {animated && <animate attributeName="r" values="5;6;5" dur="1.8s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="40" cy="35" r="5" fill={`url(#nodeGlow2-${color})`} stroke={colorMap.purple} strokeWidth="1">
          {animated && <animate attributeName="r" values="5;6;5" dur="2.1s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="40" cy="55" r="5" fill={`url(#nodeGlow2-${color})`} stroke={colorMap.purple} strokeWidth="1">
          {animated && <animate attributeName="r" values="5;6;5" dur="2.4s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="40" cy="75" r="5" fill={`url(#nodeGlow2-${color})`} stroke={colorMap.purple} strokeWidth="1">
          {animated && <animate attributeName="r" values="5;6;5" dur="1.9s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="40" cy="95" r="5" fill={`url(#nodeGlow2-${color})`} stroke={colorMap.purple} strokeWidth="1">
          {animated && <animate attributeName="r" values="5;6;5" dur="2.2s" repeatCount="indefinite"/>}
        </circle>
      </g>

      {/* Hidden Layer 2 Nodes */}
      <g>
        <circle cx="65" cy="25" r="5" fill={`url(#nodeGlow3-${color})`} stroke={colorMap.pink} strokeWidth="1">
          {animated && <animate attributeName="r" values="5;6;5" dur="2.5s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="65" cy="50" r="5" fill={`url(#nodeGlow3-${color})`} stroke={colorMap.pink} strokeWidth="1">
          {animated && <animate attributeName="r" values="5;6;5" dur="1.7s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="65" cy="75" r="5" fill={`url(#nodeGlow3-${color})`} stroke={colorMap.pink} strokeWidth="1">
          {animated && <animate attributeName="r" values="5;6;5" dur="2.0s" repeatCount="indefinite"/>}
        </circle>
      </g>

      {/* Output Node (Right) */}
      <g>
        <circle
          cx="90"
          cy="50"
          r="8"
          fill={`url(#nodeGlow1-${color})`}
          stroke={primaryColor}
          strokeWidth="1.5"
          filter={`url(#neuralGlow-${color})`}
        >
          {animated && (
            <>
              <animate attributeName="r" values="8;9;8" dur="1.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.7;1" dur="1.5s" repeatCount="indefinite"/>
            </>
          )}
        </circle>
      </g>

      {/* Data Flow Particles */}
      {animated && (
        <g fill={primaryColor} opacity="0.8">
          <circle r="1.5">
            <animateMotion dur="3s" repeatCount="indefinite" path="M15,20 L40,15"/>
          </circle>
          <circle r="1.5">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M15,50 L40,55"/>
          </circle>
          <circle r="1.5">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M40,35 L65,50"/>
          </circle>
          <circle r="1.5">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M65,50 L90,50"/>
          </circle>
        </g>
      )}
    </svg>
  );
};

export default NeuralNetworkIcon;
