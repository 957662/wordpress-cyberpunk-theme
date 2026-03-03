/**
 * CyberPress Special Effects Icons
 *
 * 赛博朋克特效图标库
 * 包含全息、故障、矩阵等特殊效果图标
 *
 * @example
 * ```tsx
 * import { HologramIcon, GlitchIcon, MatrixIcon } from '@/components/icons/SpecialEffectsIcons';
 *
 * <HologramIcon size={48} animated={true} />
 * <GlitchIcon size={32} />
 * <MatrixIcon size={40} />
 * ```
 */

import React from 'react';

// 基础属性
export interface EffectIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
  color?: string;
  onClick?: () => void;
}

// ==================== 全息效果图标 ====================

/**
 * 全息投影图标 - 带扫描动画效果
 */
export const HologramIcon: React.FC<EffectIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  color,
  onClick
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ color }}
    >
      <defs>
        <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0.4" />
        </linearGradient>
        <filter id="holoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 主六边形 */}
      <path
        d="M24 4L40 13V35L24 44L8 35V13L24 4Z"
        fill="url(#holoGradient)"
        fillOpacity="0.1"
        stroke="url(#holoGradient)"
        strokeWidth="1.5"
        filter="url(#holoGlow)"
      />

      {/* 扫描线动画 */}
      {animated && (
        <line x1="0" y1="0" x2="48" y2="48" stroke="#00f0ff" strokeWidth="1" opacity="0.3">
          <animate
            attributeName="y1"
            values="0;48;0"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="0;48;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </line>
      )}

      {/* 内部图案 */}
      <circle cx="24" cy="24" r="8" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="4" fill="#00f0ff" opacity="0.4">
        {animated && (
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* 装饰点 */}
      <circle cx="24" cy="8" r="1.5" fill="#00f0ff" />
      <circle cx="24" cy="40" r="1.5" fill="#ff0080" />
      <circle cx="8" cy="24" r="1.5" fill="#9d00ff" />
      <circle cx="40" cy="24" r="1.5" fill="#00f0ff" />
    </svg>
  );
};

// ==================== 故障效果图标 ====================

/**
 * 故障艺术图标 - 带RGB分离效果
 */
export const GlitchIcon: React.FC<EffectIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  onClick
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <defs>
        <linearGradient id="glitchGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0080" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
        <linearGradient id="glitchGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
      </defs>

      {/* 主形状 */}
      <rect x="12" y="12" width="24" height="24" fill="none" stroke="#00f0ff" strokeWidth="2">
        {animated && (
          <>
            <animate
              attributeName="x"
              values="12;14;12;10;12"
              dur="0.3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="width"
              values="24;20;24;28;24"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </>
        )}
      </rect>

      {/* RGB分离效果 */}
      <rect x="10" y="10" width="24" height="24" fill="none" stroke="#ff0080" strokeWidth="1" opacity="0.5">
        {animated && (
          <animate
            attributeName="x"
            values="10;8;10;12;10"
            dur="0.25s"
            repeatCount="indefinite"
          />
        )}
      </rect>

      <rect x="14" y="14" width="24" height="24" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.5">
        {animated && (
          <animate
            attributeName="x"
            values="14;16;14;12;14"
            dur="0.35s"
            repeatCount="indefinite"
          />
        )}
      </rect>

      {/* 内部X */}
      <path d="M18 18L30 30M30 18L18 30" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round">
        {animated && (
          <animate
            attributeName="stroke"
            values="#00f0ff;#ff0080;#00ff88;#00f0ff"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* 故障条 */}
      {animated && (
        <>
          <rect x="8" y="22" width="32" height="1" fill="#ff0080" opacity="0.6">
            <animate
              attributeName="x"
              values="8;16;8"
              dur="0.2s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="12" y="26" width="24" height="1" fill="#00f0ff" opacity="0.4">
            <animate
              attributeName="x"
              values="12;8;12"
              dur="0.15s"
              repeatCount="indefinite"
            />
          </rect>
        </>
      )}
    </svg>
  );
};

// ==================== 矩阵雨图标 ====================

/**
 * 矩阵雨图标 - 代码雨效果
 */
export const MatrixIcon: React.FC<EffectIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  onClick
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <defs>
        <linearGradient id="matrixGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
          <stop offset="50%" stopColor="#00ff88" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect width="48" height="48" fill="#0a0a0f" rx="4" />

      {/* 矩阵字符列 */}
      {[0, 1, 2, 3, 4, 5].map((col) => (
        <g key={col}>
          {animated ? (
            <>
              {Array.from({ length: 6 }).map((_, row) => (
                <text
                  key={row}
                  x={8 + col * 6}
                  y={8 + row * 7}
                  fontSize="6"
                  fill="url(#matrixGradient)"
                  fontFamily="monospace"
                  opacity={1 - row * 0.15}
                >
                  <animate
                    attributeName="opacity"
                    values={`0;${1 - row * 0.15};0`}
                    dur={`${2 + col * 0.3}s`}
                    begin={`${col * 0.2}s`}
                    repeatCount="indefinite"
                  />
                  {String.fromCharCode(0x30A0 + Math.random() * 96)}
                </text>
              ))}
            </>
          ) : (
            <>
              <text x="8" y="15" fontSize="6" fill="#00ff88" fontFamily="monospace">0</text>
              <text x="20" y="22" fontSize="6" fill="#00ff88" fontFamily="monospace">1</text>
              <text x="32" y="29" fontSize="6" fill="#00ff88" fontFamily="monospace">0</text>
              <text x="14" y="36" fontSize="6" fill="#00ff88" fontFamily="monospace">1</text>
              <text x="26" y="43" fontSize="6" fill="#00ff88" fontFamily="monospace">0</text>
            </>
          )}
        </g>
      ))}

      {/* 边框 */}
      <rect x="2" y="2" width="44" height="44" fill="none" stroke="#00ff88" strokeWidth="1" rx="3" opacity="0.5" />
    </svg>
  );
};

// ==================== 数据流动图标 ====================

/**
 * 数据流动图标 - 显示数据传输
 */
export const DataFlowIcon: React.FC<EffectIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  onClick
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#9d00ff" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>
      </defs>

      {/* 节点圆圈 */}
      <circle cx="8" cy="24" r="4" fill="none" stroke="#00f0ff" strokeWidth="2" />
      <circle cx="24" cy="24" r="4" fill="none" stroke="#9d00ff" strokeWidth="2" />
      <circle cx="40" cy="24" r="4" fill="none" stroke="#ff0080" strokeWidth="2" />

      {/* 连接线 */}
      <line x1="12" y1="24" x2="20" y2="24" stroke="url(#flowGradient)" strokeWidth="2" />
      <line x1="28" y1="24" x2="36" y2="24" stroke="url(#flowGradient)" strokeWidth="2" />

      {/* 数据包动画 */}
      {animated && (
        <>
          <circle r="2" fill="#00f0ff">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M12 24 L20 24"
            />
          </circle>
          <circle r="2" fill="#9d00ff">
            <animateMotion
              dur="1.5s"
              begin="0.5s"
              repeatCount="indefinite"
              path="M28 24 L36 24"
            />
          </circle>
        </>
      )}

      {/* 节点中心点 */}
      <circle cx="8" cy="24" r="2" fill="#00f0ff" />
      <circle cx="24" cy="24" r="2" fill="#9d00ff" />
      <circle cx="40" cy="24" r="2" fill="#ff0080" />
    </svg>
  );
};

// ==================== 神经网络图标 ====================

/**
 * 神经网络图标 - AI连接效果
 */
export const NeuralNetworkIcon: React.FC<EffectIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  onClick
}) => {
  const nodes = [
    { x: 24, y: 8, color: '#00f0ff' },
    { x: 8, y: 24, color: '#9d00ff' },
    { x: 40, y: 24, color: '#ff0080' },
    { x: 16, y: 40, color: '#00ff88' },
    { x: 32, y: 40, color: '#f0ff00' },
    { x: 24, y: 24, color: '#00f0ff' }
  ];

  const connections = [
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5],
    [0, 1], [0, 2], [3, 4], [1, 3], [2, 4]
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      {/* 连接线 */}
      <g opacity="0.4">
        {connections.map(([from, to], idx) => {
          const fromNode = nodes[from];
          const toNode = nodes[to];
          return (
            <line
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#00f0ff"
              strokeWidth="1"
            />
          );
        })}
      </g>

      {/* 信号传输动画 */}
      {animated && connections.slice(0, 5).map(([from, to], idx) => {
        const fromNode = nodes[from];
        const toNode = nodes[to];
        return (
          <circle key={idx} r="1.5" fill="#00f0ff">
            <animateMotion
              dur={`${1.5 + idx * 0.2}s`}
              begin={`${idx * 0.3}s`}
              repeatCount="indefinite"
              path={`M${fromNode.x} ${fromNode.y} L${toNode.x} ${toNode.y}`}
            />
          </circle>
        );
      })}

      {/* 节点 */}
      {nodes.map((node, idx) => (
        <g key={idx}>
          <circle
            cx={node.x}
            cy={node.y}
            r="5"
            fill="none"
            stroke={node.color}
            strokeWidth="1.5"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r="2"
            fill={node.color}
          >
            {animated && idx === 5 && (
              <animate
                attributeName="r"
                values="2;3;2"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>
      ))}
    </svg>
  );
};

// ==================== 能量核心图标 ====================

/**
 * 能量核心图标 - 脉冲能量效果
 */
export const EnergyCoreIcon: React.FC<EffectIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  onClick
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <defs>
        <radialGradient id="energyGradient">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 外层脉冲环 */}
      {animated && (
        <>
          <circle cx="24" cy="24" r="18" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.3">
            <animate
              attributeName="r"
              values="18;22;18"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="24" cy="24" r="18" fill="none" stroke="#9d00ff" strokeWidth="1" opacity="0.3">
            <animate
              attributeName="r"
              values="18;22;18"
              dur="2s"
              begin="0.66s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0;0.3"
              dur="2s"
              begin="0.66s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="24" cy="24" r="18" fill="none" stroke="#ff0080" strokeWidth="1" opacity="0.3">
            <animate
              attributeName="r"
              values="18;22;18"
              dur="2s"
              begin="1.33s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0;0.3"
              dur="2s"
              begin="1.33s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* 核心圆 */}
      <circle cx="24" cy="24" r="8" fill="url(#energyGradient)">
        {animated && (
          <animate
            attributeName="r"
            values="8;10;8"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* 能量束 */}
      {[
        { angle: 0, color: '#00f0ff' },
        { angle: 60, color: '#9d00ff' },
        { angle: 120, color: '#ff0080' },
        { angle: 180, color: '#00f0ff' },
        { angle: 240, color: '#9d00ff' },
        { angle: 300, color: '#ff0080' }
      ].map((beam, idx) => {
        const radians = (beam.angle * Math.PI) / 180;
        const x1 = 24 + Math.cos(radians) * 8;
        const y1 = 24 + Math.sin(radians) * 8;
        const x2 = 24 + Math.cos(radians) * 20;
        const y2 = 24 + Math.sin(radians) * 20;

        return (
          <line
            key={idx}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={beam.color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.8}
          >
            {animated && (
              <animate
                attributeName="opacity"
                values="0.8;0.3;0.8"
                dur="1.5s"
                begin={`${idx * 0.1}s`}
                repeatCount="indefinite"
              />
            )}
          </line>
        );
      })}
    </svg>
  );
};

export default {
  HologramIcon,
  GlitchIcon,
  MatrixIcon,
  DataFlowIcon,
  NeuralNetworkIcon,
  EnergyCoreIcon,
};
