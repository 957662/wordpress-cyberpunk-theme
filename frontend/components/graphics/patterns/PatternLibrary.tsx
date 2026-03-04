/**
 * CyberPress 图案库
 *
 * 完整的赛博朋克风格背景图案组件
 */

'use client';

import React from 'react';

export type PatternVariant = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
export type PatternDensity = 'low' | 'medium' | 'high';

interface PatternProps {
  width?: number;
  height?: number;
  variant?: PatternVariant;
  density?: PatternDensity;
  className?: string;
  animated?: boolean;
}

const colorMap: Record<PatternVariant, string> = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  green: '#00ff88',
  yellow: '#f0ff00',
};

/**
 * GridPattern - 网格图案
 */
export const GridPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  variant = 'cyan',
  density = 'medium',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];

  const gridSize = {
    low: 40,
    medium: 20,
    high: 10,
  }[density];

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
        <pattern id={`grid-${variant}-${density}`} patternUnits="userSpaceOnUse" width={gridSize} height={gridSize}>
          <path d={`M${gridSize} 0 L0 0 0 ${gridSize}`} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${variant}-${density})`} />

      {/* 装饰性交叉点 */}
      {density === 'low' && (
        <>
          <circle cx="0" cy="0" r="2" fill={color} opacity="0.4" />
          <circle cx={width} cy={0} r="2" fill={color} opacity="0.4" />
          <circle cx="0} cy={height}" r="2" fill={color} opacity="0.4" />
          <circle cx={width} cy={height} r="2" fill={color} opacity="0.4" />
        </>
      )}
    </svg>
  );
};

/**
 * ScanlinesPattern - 扫描线图案
 */
export const ScanlinesPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  variant = 'cyan',
  density = 'medium',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];

  const lineHeight = {
    low: 4,
    medium: 2,
    high: 1,
  }[density];

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
        <pattern
          id={`scanlines-${variant}-${density}`}
          patternUnits="userSpaceOnUse"
          width={lineHeight}
          height={lineHeight * 2}
        >
          <rect width={lineHeight} height={lineHeight} fill={color} opacity="0.03"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#scanlines-${variant}-${density})`} />
    </svg>
  );
};

/**
 * HexagonPattern - 六边形图案
 */
export const HexagonPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  variant = 'purple',
  density = 'medium',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const hexSize = density === 'low' ? 30 : density === 'medium' ? 20 : 12;

  const hexWidth = hexSize * Math.sqrt(3);
  const hexHeight = hexSize * 2;
  const vertDist = hexHeight * 0.75;

  const hexagons: JSX.Element[] = [];
  const cols = Math.ceil(width / hexWidth) + 1;
  const rows = Math.ceil(height / vertDist) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexWidth + (row % 2) * (hexWidth / 2);
      const y = row * vertDist;

      hexagons.push(
        <path
          key={`${row}-${col}`}
          d={`M${x} ${y - hexSize/2}
              L${x + hexWidth/2} ${y - hexSize/4}
              L${x + hexWidth/2} ${y + hexSize/4}
              L${x} ${y + hexSize/2}
              L${x - hexWidth/2} ${y + hexSize/4}
              L${x - hexWidth/2} ${y - hexSize/4} Z`}
          stroke={color}
          strokeWidth="0.5"
          fill="none"
          opacity="0.15"
        />
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {hexagons}
    </svg>
  );
};

/**
 * CircuitPattern - 电路图案
 */
export const CircuitPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  variant = 'cyan',
  density = 'medium',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];

  const nodeCount = density === 'low' ? 8 : density === 'medium' ? 16 : 32;
  const nodes: Array<{ x: number; y: number }> = [];

  // 生成随机节点
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
    });
  }

  // 生成连接线
  const connections: JSX.Element[] = [];
  nodes.forEach((node, i) => {
    nodes.forEach((otherNode, j) => {
      if (i < j) {
        const distance = Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
        );
        if (distance < 100) {
          connections.push(
            <line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={otherNode.x}
              y2={otherNode.y}
              stroke={color}
              strokeWidth="0.5"
              opacity={(1 - distance / 100) * 0.2}
            />
          );
        }
      }
    });
  });

  // 生成节点
  const nodeElements = nodes.map((node, i) => (
    <circle
      key={i}
      cx={node.x}
      cy={node.y}
      r="2"
      fill={color}
      opacity="0.4"
    />
  ));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {connections}
      {nodeElements}

      {animated && (
        <>
          {nodes.slice(0, 4).map((node, i) => (
            <circle key={`animated-${i}`} r="2" fill={color}>
              <animateMotion dur={`${3 + i}s`} repeatCount="indefinite">
                <mpath href={`#path-${i}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;0" dur={`${3 + i}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </>
      )}
    </svg>
  );
};

/**
 * DotPattern - 点阵图案
 */
export const DotPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  variant = 'pink',
  density = 'medium',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];

  const spacing = {
    low: 24,
    medium: 16,
    high: 8,
  }[density];

  const dots: JSX.Element[] = [];
  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing;
      const y = row * spacing;
      const delay = (row * cols + col) * 0.05;

      dots.push(
        animated ? (
          <circle
            key={`${row}-${col}`}
            cx={x}
            cy={y}
            r="1.5"
            fill={color}
            opacity="0.3"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.6;0.3"
              dur="3s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="1.5;2;1.5"
              dur="3s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ) : (
          <circle
            key={`${row}-${col}`}
            cx={x}
            cy={y}
            r="1.5"
            fill={color}
            opacity="0.3"
          />
        )
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {dots}
    </svg>
  );
};

/**
 * MatrixRainPattern - 矩阵雨图案
 */
export const MatrixRainPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  variant = 'green',
  density = 'medium',
  className = '',
  animated = true,
}) => {
  const color = colorMap[variant];

  const columnCount = density === 'low' ? 10 : density === 'medium' ? 20 : 40;
  const columnWidth = width / columnCount;

  const columns = Array.from({ length: columnCount }, (_, i) => {
    const chars = Array.from({ length: 20 }, (_, j) => ({
      char: String.fromCharCode(0x30A0 + Math.random() * 96),
      y: j * 20,
      opacity: Math.max(0, 1 - j * 0.05),
    }));

    return (
      <g key={i} transform={`translate(${i * columnWidth}, 0)`}>
        {chars.map((charData, j) => (
          <text
            key={j}
            x={columnWidth / 2}
            y={charData.y}
            fontFamily="monospace"
            fontSize="12"
            fill={color}
            opacity={charData.opacity}
            textAnchor="middle"
          >
            {charData.char}
            {animated && (
              <animate
                attributeName="y"
                values={`${charData.y};${charData.y + height};${charData.y}`}
                dur={`${5 + Math.random() * 5}s`}
                begin={`${Math.random() * 5}s`}
                repeatCount="indefinite"
              />
            )}
          </text>
        ))}
      </g>
    );
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {columns}
    </svg>
  );
};

export default {
  GridPattern,
  ScanlinesPattern,
  HexagonPattern,
  CircuitPattern,
  DotPattern,
  MatrixRainPattern,
};
