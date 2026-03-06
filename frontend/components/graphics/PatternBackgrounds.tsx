/**
 * CyberPress Pattern Backgrounds
 *
 * 赛博朋克风格图案背景组件
 *
 * @example
 * ```tsx
 * import { GridPattern, CircuitPattern, HexPattern } from '@/components/graphics/PatternBackgrounds';
 *
 * <GridPattern className="absolute inset-0" />
 * <CircuitPattern />
 * ```
 */

import React from 'react';

// 图案背景基础属性
export interface PatternProps {
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用动画 */
  animated?: boolean;
  /** 自定义颜色 */
  color?: string;
  /** 透明度 */
  opacity?: number;
}

/**
 * 网格图案 - 赛博网格背景
 */
export const GridPattern: React.FC<PatternProps> = ({
  className = '',
  animated = false,
  opacity = 0.1
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="cyberGrid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          {/* 水平线 */}
          <line
            x1="0"
            y1="0"
            x2="40"
            y2="0"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity={opacity}
          />
          {/* 垂直线 */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="40"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity={opacity}
          />
          {/* 交叉点装饰 */}
          <circle
            cx="0"
            cy="0"
            r="1"
            fill="currentColor"
            opacity={opacity * 1.5}
          />
        </pattern>

        {animated && (
          <>
            <linearGradient id="gridScanline" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="gridClip">
              <rect width="100%" height="100%" />
            </clipPath>
          </>
        )}
      </defs>

      {/* 基础网格 */}
      <rect width="100%" height="100%" fill="url(#cyberGrid)" />

      {/* 扫描线动画 */}
      {animated && (
        <rect
          width="100%"
          height="20"
          fill="url(#gridScanline)"
          clipPath="url(#gridClip)"
        >
          <animate
            attributeName="y"
            from="-20"
            to="100%"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </svg>
  );
};

/**
 * 电路图案 - 电路板纹理
 */
export const CircuitPattern: React.FC<PatternProps> = ({
  className = '',
  animated = false,
  opacity = 0.15
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="circuitBoard"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* 水平电路线 */}
          <path
            d="M0 20 H20 L25 15 L35 15 L40 20 H80"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity={opacity}
          />
          {/* 垂直电路线 */}
          <path
            d="M20 0 V20 L25 25 L25 35 L20 40 V80"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity={opacity}
          />
          {/* 节点 */}
          <circle
            cx="20"
            cy="20"
            r="2"
            fill="currentColor"
            opacity={opacity * 1.5}
          />
          <circle
            cx="25"
            cy="15"
            r="1.5"
            fill="currentColor"
            opacity={opacity * 1.5}
          />
          <circle
            cx="35"
            cy="15"
            r="1.5"
            fill="currentColor"
            opacity={opacity * 1.5}
          />
          <circle
            cx="40"
            cy="20"
            r="2"
            fill="currentColor"
            opacity={opacity * 1.5}
          />
          <circle
            cx="25"
            cy="35"
            r="1.5"
            fill="currentColor"
            opacity={opacity * 1.5}
          />
        </pattern>

        {animated && (
          <radialGradient id="circuitPulse">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      {/* 基础电路 */}
      <rect width="100%" height="100%" fill="url(#circuitBoard)" />

      {/* 脉冲动画 */}
      {animated && (
        <>
          <circle cx="20" cy="20" r="5" fill="url(#circuitPulse)">
            <animate attributeName="r" values="5;15;5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="20" r="5" fill="url(#circuitPulse)">
            <animate attributeName="r" values="5;15;5" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="100" r="5" fill="url(#circuitPulse)">
            <animate attributeName="r" values="5;15;5" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};

/**
 * 六边形图案 - 蜂窝结构
 */
export const HexPattern: React.FC<PatternProps> = ({
  className = '',
  animated = false,
  opacity = 0.08
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="hexGrid"
          width="60"
          height="52"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(30)"
        >
          {/* 六边形 */}
          <path
            d="M30 0 L56 15 V45 L30 60 L4 45 V15 Z"
            transform="translate(-2, -4) scale(0.5)"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity={opacity}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#hexGrid)" />
    </svg>
  );
};

/**
 * 点阵图案 - 科技点阵
 */
export const DotPattern: React.FC<PatternProps> = ({
  className = '',
  animated = false,
  opacity = 0.2
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="dotMatrix"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="10"
            cy="10"
            r="1.5"
            fill="currentColor"
            opacity={opacity}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#dotMatrix)" />

      {animated && (
        <>
          <circle cx="10" cy="10" r="2" fill="#00f0ff">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="30" r="2" fill="#9d00ff">
            <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="90" cy="50" r="2" fill="#ff0080">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};

/**
 * 扫描线图案 - CRT 效果
 */
export const ScanlinePattern: React.FC<PatternProps> = ({
  className = '',
  animated = false,
  opacity = 0.03
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="scanlines"
          width="100%"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect
            width="100%"
            height="2"
            fill="currentColor"
            opacity={opacity}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#scanlines)" />

      {animated && (
        <rect
          width="100%"
          height="100%"
          fill="url(#scanlines)"
          style={{
            animation: 'scanlineMove 8s linear infinite'
          }}
        >
          <animate
            attributeName="y"
            from="0"
            to="4"
            dur="8s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </svg>
  );
};

/**
 * 噪声图案 - 数字噪声
 */
export const NoisePattern: React.FC<PatternProps> = ({
  className = '',
  opacity = 0.02
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope={opacity} />
        </feComponentTransfer>
      </filter>

      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  );
};

/**
 * 渐变网格 - 渐变透视图
 */
export const PerspectiveGrid: React.FC<PatternProps> = ({
  className = '',
  animated = false,
  opacity = 0.1
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={opacity} />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 水平线（透视效果） */}
      {[...Array(10)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 10}
          x2="100"
          y2={i * 10}
          stroke="url(#fadeGradient)"
          strokeWidth="0.5"
          opacity={1 - i * 0.1}
        />
      ))}

      {/* 垂直线（从中心发散） */}
      {[...Array(10)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 10 + 5}
          y1="100"
          x2={50}
          y2="0"
          stroke="url(#fadeGradient)"
          strokeWidth="0.5"
        />
      ))}

      {animated && (
        <circle cx="50" cy="50" r="2" fill="#00f0ff">
          <animate attributeName="cy" values="0;100;0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
};

export default {
  GridPattern,
  CircuitPattern,
  HexPattern,
  DotPattern,
  ScanlinePattern,
  NoisePattern,
  PerspectiveGrid,
};
