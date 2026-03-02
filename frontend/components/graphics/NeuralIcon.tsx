import React from 'react';

/**
 * 神经网络图标 - AI/ML 主题
 *
 * 特点：
 * - 节点连接网络
 * - 数据流动效果
 * - 赛博朋克配色
 * - 脉冲动画
 *
 * @example
 * ```tsx
 * <NeuralIcon size={56} variant="cyan" animated={true} />
 * <NeuralIcon size={40} variant="purple" />
 * ```
 */

interface NeuralIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  animated?: boolean;
  nodeCount?: number;
}

const colorMap = {
  cyan: { primary: '#00f0ff', secondary: '#00a0ff', glow: 'rgba(0, 240, 255, 0.5)' },
  purple: { primary: '#9d00ff', secondary: '#bd66ff', glow: 'rgba(157, 0, 255, 0.5)' },
  pink: { primary: '#ff0080', secondary: '#ff66b3', glow: 'rgba(255, 0, 128, 0.5)' },
  green: { primary: '#00ff88', secondary: '#66ffbb', glow: 'rgba(0, 255, 136, 0.5)' },
};

export const NeuralIcon: React.FC<NeuralIconProps> = ({
  size = 56,
  variant = 'cyan',
  className = '',
  animated = false,
  nodeCount = 7,
}) => {
  const colors = colorMap[variant];

  // 定义节点位置
  const nodes = [
    { x: 28, y: 8, layer: 0 },  // 输入层
    { x: 28, y: 20, layer: 0 },
    { x: 28, y: 36, layer: 1 },  // 隐藏层
    { x: 16, y: 28, layer: 1 },
    { x: 40, y: 28, layer: 1 },
    { x: 28, y: 48, layer: 2 },  // 输出层
    { x: 16, y: 44, layer: 2 },
    { x: 40, y: 44, layer: 2 },
  ].slice(0, nodeCount);

  // 定义连接
  const connections = [
    [0, 2], [0, 3], [0, 4],
    [1, 2], [1, 3], [1, 4],
    [2, 5], [2, 6], [2, 7],
    [3, 5], [3, 6], [3, 7],
    [4, 5], [4, 6], [4, 7],
  ].filter(([, to]) => to < nodeCount);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* 节点发光滤镜 */}
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 连接线渐变 */}
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.6" />
        </linearGradient>

        {/* 数据流动画 */}
        <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0" />
          <stop offset="50%" stopColor={colors.primary} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 连接线 */}
      {connections.map(([from, to], idx) => {
        const fromNode = nodes[from];
        const toNode = nodes[to];

        return (
          <g key={idx}>
            {/* 基础连接线 */}
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              opacity="0.4"
            />

            {/* 数据流动画 */}
            {animated && (
              <circle r="2" fill={colors.primary}>
                <animateMotion
                  dur={`${2 + Math.random()}s`}
                  repeatCount="indefinite"
                  path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur={`${2 + Math.random()}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* 节点 */}
      {nodes.map((node, idx) => (
        <g key={idx}>
          {/* 节点外圈 */}
          <circle
            cx={node.x}
            cy={node.y}
            r="5"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1"
            opacity="0.5"
          />

          {/* 节点核心 */}
          <circle
            cx={node.x}
            cy={node.y}
            r="3"
            fill={colors.primary}
            filter="url(#nodeGlow)"
          >
            {animated && (
              <animate
                attributeName="r"
                values="3;4;3"
                dur={`${1.5 + Math.random()}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>

          {/* 节点亮点 */}
          <circle
            cx={node.x - 1}
            cy={node.y - 1}
            r="1"
            fill="#ffffff"
            opacity="0.8"
          />
        </g>
      ))}

      {/* 脉冲波纹 */}
      {animated && (
        <>
          <circle
            cx={nodes[0]?.x || 28}
            cy={nodes[0]?.y || 8}
            r="5"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="5;10;5"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            cx={nodes[nodes.length - 1]?.x || 28}
            cy={nodes[nodes.length - 1]?.y || 48}
            r="5"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="1"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="5;10;5"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </svg>
  );
};

export default NeuralIcon;
