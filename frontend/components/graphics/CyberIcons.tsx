/**
 * CyberPress Cyberpunk Icons
 *
 * 赛博朋克风格图标组件
 *
 * @example
 * ```tsx
 * import { NeuralNetworkIcon, QuantumCoreIcon } from '@/components/graphics/CyberIcons';
 *
 * <NeuralNetworkIcon size={100} />
 * <QuantumCoreIcon size={80} className="text-cyber-cyan" />
 * ```
 */

import React from 'react';

// ==================== 基础属性 ====================

export interface CyberIconProps {
  /** 图标尺寸 */
  size?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 自定义颜色 (默认使用 currentColor) */
  color?: string;
  /** 是否启用发光效果 */
  glow?: boolean;
}

// ==================== 神经网络图标 ====================

/**
 * 神经网络图标 - AI 神经网络可视化
 */
export const NeuralNetworkIcon: React.FC<CyberIconProps> = ({
  size = 100,
  className = '',
  color,
  glow = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        {glow && (
          <filter id="neuralGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}

        <radialGradient id="nodeGlow1">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0"/>
        </radialGradient>

        <radialGradient id="nodeGlow2">
          <stop offset="0%" stopColor="#9d00ff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0"/>
        </radialGradient>

        <radialGradient id="nodeGlow3">
          <stop offset="0%" stopColor="#ff0080" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Neural Connections */}
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.4" filter={glow ? 'url(#neuralGlow)' : undefined}>
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
        <circle cx="15" cy="20" r="6" fill="url(#nodeGlow1)" stroke="#00f0ff" strokeWidth="1">
          <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="15" cy="50" r="6" fill="url(#nodeGlow1)" stroke="#00f0ff" strokeWidth="1">
          <animate attributeName="r" values="6;7;6" dur="2.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="15" cy="80" r="6" fill="url(#nodeGlow1)" stroke="#00f0ff" strokeWidth="1">
          <animate attributeName="r" values="6;7;6" dur="2.6s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Hidden Layer Nodes (Middle) */}
      <g>
        <circle cx="40" cy="15" r="5" fill="url(#nodeGlow2)" stroke="#9d00ff" strokeWidth="1">
          <animate attributeName="r" values="5;6;5" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="35" r="5" fill="url(#nodeGlow2)" stroke="#9d00ff" strokeWidth="1">
          <animate attributeName="r" values="5;6;5" dur="2.1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="55" r="5" fill="url(#nodeGlow2)" stroke="#9d00ff" strokeWidth="1">
          <animate attributeName="r" values="5;6;5" dur="2.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="75" r="5" fill="url(#nodeGlow2)" stroke="#9d00ff" strokeWidth="1">
          <animate attributeName="r" values="5;6;5" dur="1.9s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="95" r="5" fill="url(#nodeGlow2)" stroke="#9d00ff" strokeWidth="1">
          <animate attributeName="r" values="5;6;5" dur="2.2s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Hidden Layer 2 Nodes */}
      <g>
        <circle cx="65" cy="25" r="5" fill="url(#nodeGlow3)" stroke="#ff0080" strokeWidth="1">
          <animate attributeName="r" values="5;6;5" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="65" cy="50" r="5" fill="url(#nodeGlow3)" stroke="#ff0080" strokeWidth="1">
          <animate attributeName="r" values="5;6;5" dur="1.7s" repeatCount="indefinite"/>
        </circle>
        <circle cx="65" cy="75" r="5" fill="url(#nodeGlow3)" stroke="#ff0080" strokeWidth="1">
          <animate attributeName="r" values="5;6;5" dur="2.0s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Output Node (Right) */}
      <g>
        <circle cx="90" cy="50" r="8" fill="url(#nodeGlow1)" stroke="#00f0ff" strokeWidth="1.5" filter={glow ? 'url(#neuralGlow)' : undefined}>
          <animate attributeName="r" values="8;9;8" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.7;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Data Flow Particles */}
      <g fill="#00f0ff" opacity="0.8">
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
    </svg>
  );
};

// ==================== 量子核心图标 ====================

/**
 * 量子核心图标 - 量子计算核心
 */
export const QuantumCoreIcon: React.FC<CyberIconProps> = ({
  size = 100,
  className = '',
  color,
  glow = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        {glow && (
          <filter id="quantumGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}

        <radialGradient id="coreGradient">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="50%" stopColor="#9d00ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </radialGradient>

        <linearGradient id="beamGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0"/>
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Central Core */}
      <g filter={glow ? 'url(#quantumGlow)' : undefined}>
        <circle cx="50" cy="50" r="20" fill="url(#coreGradient)" opacity="0.3">
          <animate attributeName="r" values="20;22;20" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite"/>
        </circle>

        <circle cx="50" cy="50" r="12" fill="url(#coreGradient)" opacity="0.6">
          <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite"/>
        </circle>

        <circle cx="50" cy="50" r="6" fill="#00f0ff">
          <animate attributeName="r" values="6;7;6" dur="1s" repeatCount="indefinite"/>
          <animate attributeName="fill" values="#00f0ff;#9d00ff;#00f0ff" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Orbiting Particles */}
      <g filter={glow ? 'url(#quantumGlow)' : undefined}>
        {/* Inner Orbit */}
        <g>
          <circle r="2" fill="#00f0ff">
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href="#innerOrbit"/>
            </animateMotion>
          </circle>
          <circle r="2" fill="#9d00ff">
            <animateMotion dur="2s" repeatCount="indefinite" begin="1s">
              <mpath href="#innerOrbit"/>
            </animateMotion>
          </circle>
        </g>
        <path id="innerOrbit" d="M50 50 A 25 25 0 1 1 50 50.01" fill="none"/>

        {/* Middle Orbit */}
        <g>
          <circle r="2.5" fill="#ff0080">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#middleOrbit"/>
            </animateMotion>
          </circle>
          <circle r="2.5" fill="#00f0ff">
            <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s">
              <mpath href="#middleOrbit"/>
            </animateMotion>
          </circle>
          <circle r="2.5" fill="#9d00ff">
            <animateMotion dur="3s" repeatCount="indefinite" begin="0.75s">
              <mpath href="#middleOrbit"/>
            </animateMotion>
          </circle>
        </g>
        <path id="middleOrbit" d="M50 50 A 35 35 0 1 1 50 50.01" fill="none"/>

        {/* Outer Orbit */}
        <g>
          <circle r="1.5" fill="#00f0ff">
            <animateMotion dur="4s" repeatCount="indefinite">
              <mpath href="#outerOrbit"/>
            </animateMotion>
          </circle>
          <circle r="1.5" fill="#ff0080">
            <animateMotion dur="4s" repeatCount="indefinite" begin="1s">
              <mpath href="#outerOrbit"/>
            </animateMotion>
          </circle>
          <circle r="1.5" fill="#9d00ff">
            <animateMotion dur="4s" repeatCount="indefinite" begin="2s">
              <mpath href="#outerOrbit"/>
            </animateMotion>
          </circle>
          <circle r="1.5" fill="#00f0ff">
            <animateMotion dur="4s" repeatCount="indefinite" begin="3s">
              <mpath href="#outerOrbit"/>
            </animateMotion>
          </circle>
        </g>
        <path id="outerOrbit" d="M50 50 A 45 45 0 1 1 50 50.01" fill="none"/>
      </g>

      {/* Energy Beams */}
      <g opacity="0.4">
        <line x1="50" y1="0" x2="50" y2="100" stroke="url(#beamGradient1)" strokeWidth="1">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite"/>
        </line>
        <line x1="0" y1="50" x2="100" y2="50" stroke="url(#beamGradient1)" strokeWidth="1">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" begin="0.5s"/>
        </line>
        <line x1="15" y1="15" x2="85" y2="85" stroke="url(#beamGradient1)" strokeWidth="1">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" begin="1s"/>
        </line>
        <line x1="85" y1="15" x2="15" y2="85" stroke="url(#beamGradient1)" strokeWidth="1">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" begin="1.5s"/>
        </line>
      </g>

      {/* Quantum Field Rings */}
      <g filter={glow ? 'url(#quantumGlow)' : undefined} opacity="0.3">
        <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#00f0ff" strokeWidth="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#9d00ff" strokeWidth="0.5">
          <animateTransform attributeName="transform" type="rotate" from="90 50 50" to="450 50 50" dur="10s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#ff0080" strokeWidth="0.5">
          <animateTransform attributeName="transform" type="rotate" from="45 50 50" to="405 50 50" dur="10s" repeatCount="indefinite"/>
        </ellipse>
      </g>
    </svg>
  );
};

// ==================== 数据流装饰 ====================

/**
 * 数据流装饰 - 动态数据流动画
 */
export const DataStreamDecoration: React.FC<CyberIconProps> = ({
  size = 200,
  className = '',
  color,
  glow = true
}) => {
  return (
    <svg
      width={size}
      height={size / 2}
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        {glow && (
          <filter id="streamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}

        <linearGradient id="streamGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0"/>
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="1"/>
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0"/>
        </linearGradient>

        <linearGradient id="streamGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9d00ff" stopOpacity="0"/>
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="1"/>
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0"/>
        </linearGradient>

        <linearGradient id="streamGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0080" stopOpacity="0"/>
          <stop offset="50%" stopColor="#ff0080" stopOpacity="1"/>
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Stream 1 - Cyan */}
      <g filter={glow ? 'url(#streamGlow)' : undefined}>
        <path d="M 0 30 L 40 30 L 50 25 L 60 35 L 70 30 L 100 30"
              stroke="url(#streamGradient1)"
              strokeWidth="2"
              fill="none"
              opacity="0.8">
          <animate attributeName="d"
                   values="M 0 30 L 40 30 L 50 25 L 60 35 L 70 30 L 100 30;
                           M 0 30 L 40 30 L 50 35 L 60 25 L 70 30 L 100 30;
                           M 0 30 L 40 30 L 50 25 L 60 35 L 70 30 L 100 30"
                   dur="3s"
                   repeatCount="indefinite"/>
        </path>
        <circle cx="70" cy="30" r="2" fill="#00f0ff">
          <animate attributeName="cx" values="70;100;70" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Stream 2 - Purple */}
      <g filter={glow ? 'url(#streamGlow)' : undefined}>
        <path d="M 20 50 L 60 50 L 70 45 L 80 55 L 90 50 L 120 50"
              stroke="url(#streamGradient2)"
              strokeWidth="2"
              fill="none"
              opacity="0.7">
          <animate attributeName="d"
                   values="M 20 50 L 60 50 L 70 45 L 80 55 L 90 50 L 120 50;
                           M 20 50 L 60 50 L 70 55 L 80 45 L 90 50 L 120 50;
                           M 20 50 L 60 50 L 70 45 L 80 55 L 90 50 L 120 50"
                   dur="2.5s"
                   repeatCount="indefinite"/>
        </path>
        <circle cx="90" cy="50" r="2" fill="#9d00ff">
          <animate attributeName="cx" values="90;120;90" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Stream 3 - Pink */}
      <g filter={glow ? 'url(#streamGlow)' : undefined}>
        <path d="M 10 70 L 50 70 L 60 65 L 70 75 L 80 70 L 110 70"
              stroke="url(#streamGradient3)"
              strokeWidth="2"
              fill="none"
              opacity="0.6">
          <animate attributeName="d"
                   values="M 10 70 L 50 70 L 60 65 L 70 75 L 80 70 L 110 70;
                           M 10 70 L 50 70 L 60 75 L 70 65 L 80 70 L 110 70;
                           M 10 70 L 50 70 L 60 65 L 70 75 L 80 70 L 110 70"
                   dur="2s"
                   repeatCount="indefinite"/>
        </path>
        <circle cx="80" cy="70" r="2" fill="#ff0080">
          <animate attributeName="cx" values="80;110;80" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  );
};

// ==================== 导出 ====================

export default {
  NeuralNetworkIcon,
  QuantumCoreIcon,
  DataStreamDecoration,
};
