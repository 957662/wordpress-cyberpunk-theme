import React from 'react';

/**
 * 电路背景插画 - 科技感背景装饰
 *
 * 用途：
 * - 页面背景
 * - 卡片背景
 * - Hero 区域装饰
 * - 空状态背景
 *
 * @example
 * ```tsx
 * <CircuitBackground width={800} height={600} density="low" />
 * <CircuitBackground width={400} height={300} density="high" animated={true} />
 * ```
 */

interface CircuitBackgroundProps {
  width?: number;
  height?: number;
  density?: 'low' | 'medium' | 'high';
  variant?: 'cyan' | 'purple' | 'pink';
  className?: string;
  animated?: boolean;
}

export const CircuitBackground: React.FC<CircuitBackgroundProps> = ({
  width = 800,
  height = 600,
  density = 'medium',
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const colorMap = {
    cyan: { primary: '#00f0ff', secondary: '#00a0ff', glow: 'rgba(0, 240, 255, 0.3)' },
    purple: { primary: '#9d00ff', secondary: '#bd66ff', glow: 'rgba(157, 0, 255, 0.3)' },
    pink: { primary: '#ff0080', secondary: '#ff66b3', glow: 'rgba(255, 0, 128, 0.3)' },
  };

  const colors = colorMap[variant];
  const densityMap = { low: 5, medium: 10, high: 15 };
  const nodeCount = densityMap[density];

  // 生成随机节点
  const generateNodes = () => {
    const nodes: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
      });
    }
    return nodes;
  };

  const nodes = generateNodes();

  // 生成连接线（连接相近的节点）
  const generateConnections = () => {
    const connections: Array<{ from: number; to: number }> = [];
    const maxDistance = Math.min(width, height) / 3;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance && Math.random() > 0.5) {
          connections.push({ from: i, to: j });
        }
      }
    }

    return connections.slice(0, nodeCount);
  };

  const connections = generateConnections();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* 发光滤镜 */}
        <filter id="circuitGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 节点渐变 */}
        <radialGradient id="nodeGradient">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </radialGradient>

        {/* 电流动画 */}
        <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0" />
          <stop offset="50%" stopColor={colors.primary} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="#0a0a0f"
        opacity="0.5"
      />

      {/* 网格背景 */}
      <g opacity="0.1">
        {[...Array(Math.ceil(width / 50))].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 50}
            y1="0"
            x2={i * 50}
            y2={height}
            stroke={colors.primary}
            strokeWidth="0.5"
          />
        ))}
        {[...Array(Math.ceil(height / 50))].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 50}
            x2={width}
            y2={i * 50}
            stroke={colors.primary}
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* 连接线 */}
      {connections.map((conn, idx) => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];

        return (
          <g key={idx}>
            {/* 基础连接线 */}
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={colors.primary}
              strokeWidth="1"
              opacity="0.2"
            />

            {/* 电流动画 */}
            {animated && (
              <circle r="3" fill={colors.primary} filter="url(#circuitGlow)">
                <animateMotion
                  dur={`${2 + Math.random() * 2}s`}
                  repeatCount="indefinite"
                  path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
                  begin={Math.random() * 2}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur={`${2 + Math.random() * 2}s`}
                  repeatCount="indefinite"
                  begin={Math.random() * 2}
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* 节点 */}
      {nodes.map((node, idx) => (
        <g key={idx}>
          {/* 节点光晕 */}
          <circle
            cx={node.x}
            cy={node.y}
            r="12"
            fill="url(#nodeGradient)"
            opacity="0.3"
          />

          {/* 节点核心 */}
          <circle
            cx={node.x}
            cy={node.y}
            r="4"
            fill={colors.primary}
            filter="url(#circuitGlow)"
          >
            {animated && (
              <animate
                attributeName="r"
                values="4;6;4"
                dur={`${2 + Math.random()}s`}
                repeatCount="indefinite"
                begin={idx * 0.1}
              />
            )}
          </circle>

          {/* 节点亮点 */}
          <circle
            cx={node.x - 1}
            cy={node.y - 1}
            r="1.5"
            fill="#ffffff"
            opacity="0.8"
          />
        </g>
      ))}

      {/* 装饰性元素 */}
      <g opacity="0.4">
        {/* 角落装饰 */}
        <path
          d="M 20 40 L 20 20 L 40 20"
          stroke={colors.secondary}
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M ${width - 40} 20 L ${width - 20} 20 L ${width - 20} 40`}
          stroke={colors.secondary}
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M ${width - 20} ${height - 40} L ${width - 20} ${height - 20} L ${width - 40} ${height - 20}`}
          stroke={colors.secondary}
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M 40 ${height - 20} L 20 ${height - 20} L 20 ${height - 40}`}
          stroke={colors.secondary}
          strokeWidth="2"
          fill="none"
        />
      </g>

      {/* 数据标签 */}
      <g fontSize="10" fontFamily="monospace" opacity="0.3">
        <text x="25" y="35" fill={colors.primary}>
          NET_ACTIVE
        </text>
        <text x={width - 90} y={height - 15} fill={colors.secondary}>
          PWR: 100%
        </text>
      </g>
    </svg>
  );
};

export default CircuitBackground;
