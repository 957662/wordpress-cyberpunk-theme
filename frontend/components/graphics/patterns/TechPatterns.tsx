/**
 * CyberPress Tech Patterns
 *
 * 科技风格背景图案组件库
 *
 * @example
 * ```tsx
 * import { GridPattern, CircuitPattern, HexagonPattern } from '@/components/graphics/patterns/TechPatterns';
 *
 * <div className="relative">
 *   <GridPattern opacity={0.1} />
 *   <div className="relative z-10">内容</div>
 * </div>
 * ```
 */

import React from 'react';

// 基础图案属性
export interface PatternProps {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 透明度 */
  opacity?: number;
  /** 颜色 */
  color?: string;
  /** 是否动画 */
  animated?: boolean;
  /** CSS 类名 */
  className?: string;
}

/**
 * GridPattern - 科技网格图案
 */
export const GridPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  opacity = 0.1,
  color = '#00f0ff',
  animated = false,
  className = ''
}) => {
  const gridSize = 40;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={`grid-${width}-${height}`}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* 主网格 */}
      <rect width={width} height={height} fill={`url(#grid-${width}-${height})`} />

      {/* 装饰点 */}
      {Array.from({ length: Math.ceil(width / gridSize) }).map((_, i) =>
    Array.from({ length: Math.ceil(height / gridSize) }).map((_, j) => {
      const x = i * gridSize;
      const y = j * gridSize;

      // 随机添加一些交叉点装饰
      if ((i + j) % 3 === 0) {
        return (
          <circle
            key={`${i}-${j}`}
            cx={x}
            cy={y}
            r={1}
            fill={color}
            opacity={0.5}
          >
            {animated && (
              <animate
                attributeName="r"
                values="1;1.5;1"
                dur="2s"
                begin={`${(i + j) * 0.1}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        );
      }
      return null;
    })
  )}
    </svg>
  );
};

/**
 * CircuitPattern - 电路板图案
 */
export const CircuitPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  opacity = 0.15,
  color = '#00f0ff',
  animated = false,
  className = ''
}) => {
  const circuits: Array<{ path: string; delay: number }> = [];

  // 生成随机电路路径
  for (let i = 0; i < 15; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    let path = `M ${startX} ${startY}`;

    // 添加3-5个线段
    const segments = 3 + Math.floor(Math.random() * 3);
    let currentX = startX;
    let currentY = startY;

    for (let j = 0; j < segments; j++) {
      const direction = Math.floor(Math.random() * 4);
      const length = 20 + Math.random() * 60;

      switch (direction) {
        case 0: // 上
          currentY -= length;
          break;
        case 1: // 右
          currentX += length;
          break;
        case 2: // 下
          currentY += length;
          break;
        case 3: // 左
          currentX -= length;
          break;
      }

      path += ` L ${currentX} ${currentY}`;
    }

    circuits.push({ path, delay: i * 0.2 });
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {circuits.map((circuit, i) => (
        <g key={i}>
          <path
            d={circuit.path}
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity={0.4 + Math.random() * 0.4}
          />
          {/* 节点 */}
          {circuit.path.split('L').slice(1).map((point, j) => {
            const [x, y] = point.trim().split(' ');
            return (
              <circle
                key={j}
                cx={parseFloat(x)}
                cy={parseFloat(y)}
                r={1.5}
                fill={color}
              >
                {animated && (
                  <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur="3s"
                    begin={`${circuit.delay + j * 0.3}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            );
          })}
        </g>
      ))}
    </svg>
  );
};

/**
 * HexagonPattern - 六边形蜂窝图案
 */
export const HexagonPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  opacity = 0.1,
  color = '#00f0ff',
  animated = false,
  className = ''
}) => {
  const hexSize = 30;
  const hexWidth = hexSize * 2;
  const hexHeight = hexSize * Math.sqrt(3);

  const hexPath = `
    M ${hexSize} 0
    L ${hexSize * 2} ${hexSize / 2}
    L ${hexSize * 2} ${hexSize * 1.5}
    L ${hexSize} ${hexSize * 2}
    L 0 ${hexSize * 1.5}
    L 0 ${hexSize / 2}
    Z
  `;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={`hex-${width}-${height}`}
          width={hexWidth * 1.5}
          height={hexHeight}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={hexPath}
            stroke={color}
            strokeWidth="1"
            fill="none"
            transform={`translate(0, ${hexSize / 2})`}
          />
        </pattern>
      </defs>

      <rect width={width} height={height} fill={`url(#hex-${width}-${height})`} />

      {/* 装饰点 - 在某些六边形中心 */}
      {Array.from({ length: Math.ceil(width / (hexWidth * 1.5)) }).map((_, i) =>
    Array.from({ length: Math.ceil(height / hexHeight) }).map((_, j) => {
      if ((i + j) % 2 === 0) {
        const x = i * hexWidth * 1.5 + hexWidth * 0.75;
        const y = j * hexHeight + hexHeight / 2;

        return (
          <circle
            key={`${i}-${j}`}
            cx={x}
            cy={y}
            r={2}
            fill={color}
            opacity="0.3"
          >
            {animated && (
              <animate
                attributeName="opacity"
                values="0.3;0.6;0.3"
                dur="4s"
                begin={`${(i + j) * 0.2}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        );
      }
      return null;
    })
  )}
    </svg>
  );
};

/**
 * DotPattern - 点阵图案
 */
export const DotPattern: React.FC<PatternProps & { dotSize?: number; spacing?: number }> = ({
  width = 400,
  height = 300,
  opacity = 0.15,
  color = '#00f0ff',
  dotSize = 2,
  spacing = 20,
  animated = false,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {Array.from({ length: Math.ceil(width / spacing) }).map((_, i) =>
    Array.from({ length: Math.ceil(height / spacing) }).map((_, j) => {
      const x = i * spacing;
      const y = j * spacing;
      const baseOpacity = 0.3 + Math.random() * 0.4;

      return (
        <circle
          key={`${i}-${j}`}
          cx={x}
          cy={y}
          r={dotSize}
          fill={color}
          opacity={baseOpacity}
        >
          {animated && (
            <animate
              attributeName="opacity"
              values={`${baseOpacity};${baseOpacity * 0.5};${baseOpacity}`}
              dur="3s"
              begin={`${(i + j) * 0.1}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      );
    })
  )}
    </svg>
  );
};

/**
 * ScanlinePattern - 扫描线图案
 */
export const ScanlinePattern: React.FC<PatternProps & { lineSize?: number; spacing?: number }> = ({
  width = 400,
  height = 300,
  opacity = 0.1,
  color = '#00f0ff',
  lineSize = 1,
  spacing = 4,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={`scanline-${width}-${height}`}
          width={width}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2={width}
            y2="0"
            stroke={color}
            strokeWidth={lineSize}
          />
        </pattern>
      </defs>

      <rect width={width} height={height} fill={`url(#scanline-${width}-${height})`} />
    </svg>
  );
};

/**
 * MatrixRainPattern - 矩阵雨图案
 */
export const MatrixRainPattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  opacity = 0.2,
  color = '#00ff88',
  animated = true,
  className = ''
}) => {
  const columns = 20;
  const columnWidth = width / columns;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {Array.from({ length: columns }).map((_, i) => {
        const x = i * columnWidth + columnWidth / 2;
        const delay = i * 0.3;

        return (
          <g key={i}>
            {Array.from({ length: 15 }).map((_, j) => {
              const y = j * 25;
              const charOpacity = Math.max(0, 1 - j * 0.08);

              return (
                <text
                  key={j}
                  x={x}
                  y={y}
                  fontSize="12"
                  fill={color}
                  textAnchor="middle"
                  fontFamily="monospace"
                  opacity={charOpacity}
                >
                  {String.fromCharCode(0x30A0 + Math.random() * 96)}
                  {animated && (
                    <animate
                      attributeName="opacity"
                      values={`${charOpacity};${charOpacity * 0.3};${charOpacity}`}
                      dur="2s"
                      begin={`${delay + j * 0.1}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * NoisePattern - 噪声图案
 */
export const NoisePattern: React.FC<PatternProps> = ({
  width = 400,
  height = 300,
  opacity = 0.05,
  className = ''
}) => {
  // 生成随机噪声点
  const noiseDots = Array.from({ length: 500 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.5 + Math.random() * 1
  }));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {noiseDots.map((dot, i) => (
        <circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill="#ffffff"
        />
      ))}
    </svg>
  );
};

export default {
  GridPattern,
  CircuitPattern,
  HexagonPattern,
  DotPattern,
  ScanlinePattern,
  MatrixRainPattern,
  NoisePattern
};
