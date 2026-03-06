/**
 * CyberPress Data Flow Illustrations
 *
 * 数据流可视化插画组件
 *
 * @example
 * ```tsx
 * import { DataStream, NetworkFlow, QuantumData } from '@/components/graphics/DataFlowIllustrations';
 *
 * <DataStream />
 * <NetworkFlow />
 * ```
 */

import React from 'react';

export interface DataFlowProps {
  width?: number;
  height?: number;
  className?: string;
  animated?: boolean;
}

/**
 * 数据流动画 - 赛博朋克数据传输可视化
 */
export const DataStream: React.FC<DataFlowProps> = ({
  width = 400,
  height = 200,
  className = '',
  animated = true
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0" />
        </linearGradient>
        <filter id="streamGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect width="400" height="200" fill="#0a0a0f" opacity="0.3" />

      {/* 数据流线条 */}
      {animated ? (
        <>
          {/* 主数据流 */}
          <g filter="url(#streamGlow)">
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <line
                  x1="0"
                  y1={30 + i * 20}
                  x2="400"
                  y2={30 + i * 20}
                  stroke="url(#streamGradient)"
                  strokeWidth="2"
                  opacity={0.3 + (i * 0.1)}
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,400;400,0"
                    dur={`${2 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </line>
                {/* 数据包 */}
                <circle r="3" fill="#00f0ff">
                  <animateMotion
                    dur={`${2 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path="M0,30 L400,30"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur={`${2 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </g>

          {/* 垂直连接线 */}
          <g opacity="0.3">
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={80 + i * 60}
                y1="30"
                x2={80 + i * 60}
                y2="170"
                stroke="#9d00ff"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              />
            ))}
          </g>
        </>
      ) : (
        /* 静态版本 */
        <g>
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={30 + i * 20}
              x2="400"
              y2={30 + i * 20}
              stroke="url(#streamGradient)"
              strokeWidth="2"
              opacity={0.3 + (i * 0.1)}
            />
          ))}
        </g>
      )}

      {/* 节点装饰 */}
      <g>
        {Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={i}
            cx={80 + i * 60}
            cy="100"
            r="5"
            fill="#0a0a0f"
            stroke="#ff0080"
            strokeWidth="2"
          >
            {animated && (
              <animate
                attributeName="r"
                values="5;6;5"
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.2}s`}
              />
            )}
          </circle>
        ))}
      </g>
    </svg>
  );
};

/**
 * 网络流动画 - 节点连接可视化
 */
export const NetworkFlow: React.FC<DataFlowProps> = ({
  width = 400,
  height = 300,
  className = '',
  animated = true
}) => {
  const nodes = [
    { x: 200, y: 50 },
    { x: 100, y: 120 },
    { x: 300, y: 120 },
    { x: 80, y: 220 },
    { x: 200, y: 250 },
    { x: 320, y: 220 }
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
        <filter id="networkGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 连接线 */}
      <g filter="url(#networkGlow)">
        {animated ? (
          <>
            {/* 中心到外围 */}
            {nodes.slice(1).map((node, i) => (
              <g key={`conn-${i}`}>
                <line
                  x1={nodes[0].x}
                  y1={nodes[0].y}
                  x2={node.x}
                  y2={node.y}
                  stroke="url(#networkGradient)"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <circle r="3" fill="#00f0ff">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M${nodes[0].x},${nodes[0].y} L${node.x},${node.y}`}
                  />
                </circle>
              </g>
            ))}
            {/* 外围连接 */}
            <line x1="100" y1="120" x2="80" y2="220" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="120" x2="200" y2="250" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
            <line x1="300" y1="120" x2="320" y2="220" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
            <line x1="300" y1="120" x2="200" y2="250" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
            <line x1="80" y1="220" x2="200" y2="250" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
            <line x1="320" y1="220" x2="200" y2="250" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
          </>
        ) : (
          <>
            {nodes.slice(1).map((node, i) => (
              <line
                key={`conn-${i}`}
                x1={nodes[0].x}
                y1={nodes[0].y}
                x2={node.x}
                y2={node.y}
                stroke="url(#networkGradient)"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            <line x1="100" y1="120" x2="80" y2="220" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="120" x2="200" y2="250" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
            <line x1="300" y1="120" x2="320" y2="220" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
            <line x1="300" y1="120" x2="200" y2="250" stroke="#9d00ff" strokeWidth="1" opacity="0.3" />
          </>
        )}
      </g>

      {/* 节点 */}
      {nodes.map((node, i) => (
        <g key={`node-${i}`} filter="url(#networkGlow)">
          <circle
            cx={node.x}
            cy={node.y}
            r={i === 0 ? 12 : 8}
            fill="#0a0a0f"
            stroke={i === 0 ? "#ff0080" : "url(#networkGradient)"}
            strokeWidth="2"
          >
            {animated && (
              <animate
                attributeName="r"
                values={i === 0 ? "12;14;12" : "8;10;8"}
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.2}s`}
              />
            )}
          </circle>
          {/* 内部脉冲 */}
          {i === 0 && animated && (
            <circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill="#ff0080"
              opacity="0.5"
            >
              <animate
                attributeName="r"
                values="6;10;6"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0.2;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
};

/**
 * 量子数据可视化 - 抽象数据表示
 */
export const QuantumData: React.FC<DataFlowProps> = ({
  width = 300,
  height = 300,
  className = '',
  animated = true
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="quantumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="33%" stopColor="#9d00ff" />
          <stop offset="66%" stopColor="#ff0080" />
          <stop offset="100%" stopColor="#f0ff00" />
        </linearGradient>
        <filter id="quantumGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 中心核心 */}
      <g filter="url(#quantumGlow)">
        <circle
          cx="150"
          cy="150"
          r="40"
          fill="none"
          stroke="url(#quantumGradient)"
          strokeWidth="2"
        >
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 150 150"
              to="360 150 150"
              dur="20s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 内部轨道 */}
        <circle
          cx="150"
          cy="150"
          r="30"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="1"
          opacity="0.5"
        >
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 150 150"
              to="0 150 150"
              dur="15s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 外部轨道 */}
        <circle
          cx="150"
          cy="150"
          r="60"
          fill="none"
          stroke="#9d00ff"
          strokeWidth="1"
          strokeDasharray="10,5"
          opacity="0.3"
        >
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 150 150"
              to="-360 150 150"
              dur="25s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 量子比特 */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45) * (Math.PI / 180);
          const x1 = 150 + Math.cos(angle) * 30;
          const y1 = 150 + Math.sin(angle) * 30;
          const x2 = 150 + Math.cos(angle) * 40;
          const y2 = 150 + Math.sin(angle) * 40;

          return (
            <g key={`qubit-${i}`}>
              <circle
                cx={x1}
                cy={y1}
                r="3"
                fill="#00f0ff"
                opacity="0.8"
              >
                {animated && (
                  <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur={`${1 + i * 0.1}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ff0080"
                strokeWidth="1"
                opacity="0.5"
              />
            </g>
          );
        })}

        {/* 外部粒子 */}
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i * 90) * (Math.PI / 180);
          const x = 150 + Math.cos(angle) * 70;
          const y = 150 + Math.sin(angle) * 70;

          return (
            <circle
              key={`particle-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill="#f0ff00"
            >
              {animated && (
                <>
                  <animate
                    attributeName="cx"
                    values={`${150 + Math.cos(angle) * 60};${150 + Math.cos(angle) * 80};${150 + Math.cos(angle) * 60}`}
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                  />
                  <animate
                    attributeName="cy"
                    values={`${150 + Math.sin(angle) * 60};${150 + Math.sin(angle) * 80};${150 + Math.sin(angle) * 60}`}
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                  />
                </>
              )}
            </circle>
          );
        })}
      </g>

      {/* 波形装饰 */}
      {animated && (
        <g opacity="0.2">
          {Array.from({ length: 3 }).map((_, i) => (
            <circle
              key={`wave-${i}`}
              cx="150"
              cy="150"
              r="80"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1"
            >
              <animate
                attributeName="r"
                values="40;100"
                dur="3s"
                repeatCount="indefinite"
                begin={`${i * 1}s`}
              />
              <animate
                attributeName="opacity"
                values="0.5;0"
                dur="3s"
                repeatCount="indefinite"
                begin={`${i * 1}s`}
              />
            </circle>
          ))}
        </g>
      )}
    </svg>
  );
};

/**
 * 数据矩阵 - 数字雨效果
 */
export const DataMatrix: React.FC<DataFlowProps> = ({
  width = 300,
  height = 400,
  className = '',
  animated = true
}) => {
  const chars = '01アイウエオカキクケコサシスセソ';
  const columns = 15;
  const rows = 20;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="300" height="400" fill="#0a0a0f" opacity="0.9" />

      {Array.from({ length: columns }).map((_, col) => (
        <g key={`col-${col}`}>
          {Array.from({ length: rows }).map((_, row) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const delay = col * 0.1 + row * 0.05;

            return (
              <text
                key={`cell-${col}-${row}`}
                x={col * 20 + 10}
                y={row * 20 + 15}
                fontFamily="monospace"
                fontSize="12"
                fill="#00ff88"
                opacity={0.3 + Math.random() * 0.7}
              >
                {char}
                {animated && (
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                  />
                )}
              </text>
            );
          })}
        </g>
      ))}
    </svg>
  );
};

export default {
  DataStream,
  NetworkFlow,
  QuantumData,
  DataMatrix
};
