/**
 * CyberPress Background Patterns
 *
 * SVG 可缩放背景图案组件
 *
 * @example
 * ```tsx
 * import { CyberGridPattern, HexagonPattern, CircuitPattern } from '@/components/graphics/BackgroundPatterns';
 *
 * <CyberGridPattern opacity={0.1} />
 * <HexagonPattern color="#00f0ff" />
 * <CircuitPattern animated />
 * ```
 */

import React from 'react';

export interface PatternProps {
  /** 不透明度 */
  opacity?: number;
  /** 自定义颜色 */
  color?: string;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用动画 */
  animated?: boolean;
}

// ==================== 网格图案 ====================

/**
 * 赛博网格背景
 */
export const CyberGridPattern: React.FC<PatternProps> = ({
  opacity = 0.1,
  color = '#00f0ff',
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="cyberGrid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          {/* 主网格线 */}
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={opacity}
          />
          {/* 装饰点 */}
          <circle cx="0" cy="0" r="1" fill={color} opacity={opacity * 0.5} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cyberGrid)" />
    </svg>
  );
};

/**
 * 点阵背景
 */
export const DotMatrixPattern: React.FC<PatternProps> = ({
  opacity = 0.15,
  color = '#00f0ff',
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dotMatrix"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="1" fill={color} opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotMatrix)" />
    </svg>
  );
};

// ==================== 六边形图案 ====================

/**
 * 六边形网格背景
 */
export const HexagonPattern: React.FC<PatternProps> = ({
  opacity = 0.08,
  color = '#00f0ff',
  animated = false,
  className = ''
}) => {
  const hexWidth = 30;
  const hexHeight = 26; // sqrt(3) * width / 2

  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hexPattern"
          width={hexWidth}
          height={hexHeight * 2}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${hexWidth/2} 0 L${hexWidth} ${hexHeight/2} L${hexWidth} ${hexHeight * 1.5} L${hexWidth/2} ${hexHeight * 2} L0 ${hexHeight * 1.5} L0 ${hexHeight/2} Z`}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexPattern)" />
    </svg>
  );
};

/**
 * 蜂巢背景 - 填充版
 */
export const HoneycombPattern: React.FC<PatternProps> = ({
  opacity = 0.05,
  color = '#00f0ff',
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="honeycomb"
          width="50"
          height="43.3"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M25 0L50 14.43V43.3L25 57.73L0 43.3V14.43L25 0Z"
            transform="translate(0, -7.3)"
            fill={color}
            fillOpacity={opacity}
            stroke="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#honeycomb)" />
    </svg>
  );
};

// ==================== 电路图案 ====================

/**
 * 电路板图案
 */
export const CircuitPattern: React.FC<PatternProps> = ({
  opacity = 0.1,
  color = '#00f0ff',
  animated = false,
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="circuitPattern"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {/* 电路线条 */}
          <g stroke={color} strokeWidth="1" fill="none" opacity={opacity}>
            <path d="M0 50 H30 V30 H50" />
            <path d="M100 50 H70 V70 H50" />
            <path d="M50 30 V10" opacity="0.5" />
            <path d="M50 70 V90" opacity="0.5" />
          </g>
          {/* 节点 */}
          <g fill={color} opacity={opacity * 1.5}>
            <circle cx="30" cy="50" r="2" />
            <circle cx="50" cy="30" r="2" />
            <circle cx="70" cy="50" r="2" />
            <circle cx="50" cy="70" r="2" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuitPattern)" />
    </svg>
  );
};

// ==================== 波浪图案 ====================

/**
 * 波浪图案背景
 */
export const WavePattern: React.FC<PatternProps & {
  /** 波浪数量 */
  waves?: number;
  /** 振幅 */
  amplitude?: number;
}> = ({
  opacity = 0.1,
  color = '#00f0ff',
  waves = 3,
  amplitude = 20,
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="wavePattern"
          width="100%"
          height="100%"
          patternUnits="userSpaceOnUse"
        >
          {[...Array(waves)].map((_, i) => (
            <path
              key={i}
              d={`M0 ${50 + i * 30} Q25 ${50 + i * 30 - amplitude}, 50 ${50 + i * 30} T100 ${50 + i * 30}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity={opacity - i * 0.02}
              transform={`translate(0, ${i * 20})`}
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wavePattern)" />
    </svg>
  );
};

// ==================== 辐射图案 ====================

/**
 * 辐射图案背景
 */
export const RadialPattern: React.FC<PatternProps & {
  /** 线条数量 */
  rays?: number;
}> = ({
  opacity = 0.08,
  color = '#00f0ff',
  rays = 12,
  className = ''
}) => {
  const angle = 360 / rays;

  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="radialPattern"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <g stroke={color} strokeWidth="0.5" opacity={opacity}>
            {[...Array(rays)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="0"
                transform={`rotate(${i * angle} 50 50)`}
              />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#radialPattern)" />
    </svg>
  );
};

// ==================== 矩阵图案 ====================

/**
 * 矩阵代码雨图案
 */
export const MatrixPattern: React.FC<PatternProps> = ({
  opacity = 0.15,
  color = '#00ff88',
  className = ''
}) => {
  const characters = '01アイウエオカキクケコサシスセソタチツテト';

  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="matrixPattern"
          width="20"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <text
            x="10"
            y="15"
            fontSize="12"
            fill={color}
            opacity={opacity}
            fontFamily="monospace"
            textAnchor="middle"
          >
            {characters[Math.floor(Math.random() * characters.length)]}
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#matrixPattern)" />
    </svg>
  );
};

// ==================== 几何图案 ====================

/**
 * 三角形图案
 */
export const TrianglePattern: React.FC<PatternProps> = ({
  opacity = 0.08,
  color = '#00f0ff',
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="trianglePattern"
          width="40"
          height="35"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="20,0 40,35 0,35"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#trianglePattern)" />
    </svg>
  );
};

/**
 * 菱形图案
 */
export const DiamondPattern: React.FC<PatternProps> = ({
  opacity = 0.1,
  color = '#00f0ff',
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="diamondPattern"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="10"
            y="10"
            width="10"
            height="10"
            transform="rotate(45 15 15)"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamondPattern)" />
    </svg>
  );
};

// ==================== 复合图案 ====================

/**
 * 赛博网格复合图案
 */
export const CyberCompositePattern: React.FC<PatternProps> = ({
  opacity = 0.1,
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 基础网格 */}
        <pattern
          id="compositeGrid"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <g opacity={opacity}>
            {/* 网格线 */}
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="0.5"
            />
            {/* 对角线 */}
            <line
              x1="0"
              y1="0"
              x2="50"
              y2="50"
              stroke="#9d00ff"
              strokeWidth="0.3"
              opacity="0.5"
            />
            {/* 装饰点 */}
            <circle cx="0" cy="0" r="1.5" fill="#00f0ff" />
            <circle cx="50" cy="50" r="1" fill="#ff0080" />
            {/* 小六边形 */}
            <polygon
              points="25,20 30,23 30,28 25,31 20,28 20,23"
              fill="none"
              stroke="#00ff88"
              strokeWidth="0.5"
              opacity="0.6"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#compositeGrid)" />
    </svg>
  );
};

/**
 * 全息效果图案
 */
export const HologramPattern: React.FC<PatternProps> = ({
  opacity = 0.05,
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hologramPattern"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <g opacity={opacity}>
            {/* 同心圆 */}
            <circle cx="30" cy="30" r="25" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="15" fill="none" stroke="#9d00ff" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="5" fill="none" stroke="#ff0080" strokeWidth="0.5" />
            {/* 放射线 */}
            <line x1="30" y1="5" x2="30" y2="55" stroke="#00f0ff" strokeWidth="0.3" />
            <line x1="5" y1="30" x2="55" y2="30" stroke="#9d00ff" strokeWidth="0.3" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hologramPattern)" />
    </svg>
  );
};

export default {
  // 网格类
  CyberGridPattern,
  DotMatrixPattern,
  // 多边形类
  HexagonPattern,
  HoneycombPattern,
  TrianglePattern,
  DiamondPattern,
  // 电路类
  CircuitPattern,
  // 波浪类
  WavePattern,
  RadialPattern,
  // 特殊效果类
  MatrixPattern,
  CyberCompositePattern,
  HologramPattern,
};
