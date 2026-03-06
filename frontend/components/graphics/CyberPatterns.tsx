'use client';

/**
 * CyberPatterns - 赛博朋克背景图案集合
 * 可用作背景或装饰的 SVG 图案
 */

import React from 'react';

/**
 * CyberGridBackground - 赛博网格背景
 */
export const CyberGridBackground: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 40, color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={`cyberGrid-${size}`} x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            stroke={color}
            strokeWidth="0.5"
            fill="none"
            opacity="0.1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#cyberGrid-${size})`} />
    </svg>
  );
};

/**
 * DotMatrixPattern - 点阵图案
 */
export const DotMatrixPattern: React.FC<{
  className?: string;
  spacing?: number;
  dotSize?: number;
  color?: string;
}> = ({ className = '', spacing = 20, dotSize = 2, color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={`dotMatrix-${spacing}`} x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <circle cx={spacing / 2} cy={spacing / 2} r={dotSize} fill={color} opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dotMatrix-${spacing})`} />
    </svg>
  );
};

/**
 * DiagonalStripesPattern - 斜条纹图案
 */
export const DiagonalStripesPattern: React.FC<{
  className?: string;
  spacing?: number;
  strokeWidth?: number;
  color?: string;
}> = ({ className = '', spacing = 10, strokeWidth = 2, color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={`diagonalStripes-${spacing}`}
          x="0"
          y="0"
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={spacing}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity="0.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#diagonalStripes-${spacing})`} />
    </svg>
  );
};

/**
 * NoiseTexture - 噪点纹理
 */
export const NoiseTexture: React.FC<{
  className?: string;
  opacity?: number;
}> = ({ className = '', opacity = 0.05 }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope={opacity} />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  );
};

/**
 * CircuitLinesPattern - 电路线路图案
 */
export const CircuitLinesPattern: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="circuitLines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* 水平线 */}
          <line x1="0" y1="25" x2="40" y2="25" stroke={color} strokeWidth="1" opacity="0.2" />
          <circle cx="40" cy="25" r="2" fill={color} opacity="0.3" />

          <line x1="50" y1="75" x2="100" y2="75" stroke={color} strokeWidth="1" opacity="0.2" />
          <circle cx="50" cy="75" r="2" fill={color} opacity="0.3" />

          {/* 垂直线 */}
          <line x1="75" y1="0" x2="75" y2="50" stroke={color} strokeWidth="1" opacity="0.2" />
          <circle cx="75" cy="50" r="2" fill={color} opacity="0.3" />

          <line x1="25" y1="50" x2="25" y2="100" stroke={color} strokeWidth="1" opacity="0.2" />
          <circle cx="25" cy="50" r="2" fill={color} opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuitLines)" />
    </svg>
  );
};

/**
 * HexPattern - 六边形图案
 */
export const HexPattern: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 60, color = '#00f0ff' }) => {
  const height = size * Math.sqrt(3);

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox={`0 0 ${size * 2} ${height * 2}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={`hexPattern-${size}`} x="0" y="0" width={size * 2} height={height * 2} patternUnits="userSpaceOnUse">
          <path
            d={`M${size/2} 0 L${size * 1.5} 0 L${size * 2} ${height/2} L${size * 1.5} ${height} L${size/2} ${height} L0 ${height/2} Z`}
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.15"
          />
          <path
            d={`M${size * 1.5} ${height} L${size * 2.5} ${height} L${size * 3} ${height * 1.5} L${size * 2.5} ${height * 2} L${size * 1.5} ${height * 2} L${size} ${height * 1.5} Z`}
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.15"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#hexPattern-${size})`} />
    </svg>
  );
};

/**
 * WavesPattern - 波浪图案
 */
export const WavesPattern: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="wavesPattern" x="0" y="0" width="100" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M0 25 Q25 10 50 25 T100 25"
            stroke={color}
            strokeWidth="2"
            fill="none"
            opacity="0.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wavesPattern)" />
    </svg>
  );
};

/**
 * TechGridPattern - 科技网格图案
 */
export const TechGridPattern: React.FC<{
  className?: string;
  gridSize?: number;
  color?: string;
}> = ({ className = '', gridSize = 40, color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={`techGrid-${gridSize}`} x="0" y="0" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
          {/* 外框 */}
          <rect x="0" y="0" width={gridSize} height={gridSize} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
          {/* 交叉线 */}
          <line x1="0" y1="0" x2={gridSize} y2={gridSize} stroke={color} strokeWidth="0.3" opacity="0.1" />
          <line x1={gridSize} y1="0" x2="0" y2={gridSize} stroke={color} strokeWidth="0.3" opacity="0.1" />
          {/* 中心点 */}
          <circle cx={gridSize / 2} cy={gridSize / 2} r="1.5" fill={color} opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#techGrid-${gridSize})`} />
    </svg>
  );
};

export default {
  CyberGridBackground,
  DotMatrixPattern,
  DiagonalStripesPattern,
  NoiseTexture,
  CircuitLinesPattern,
  HexPattern,
  WavesPattern,
  TechGridPattern,
};
