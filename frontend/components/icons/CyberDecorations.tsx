/**
 * CyberPress - 赛博朋克装饰图标
 *
 * 特色装饰性图标组件，用于增强视觉效果
 * @version 1.0.0
 * @lastUpdated 2026-03-06
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 数据流动画装饰
 */
export const DataStreamDecoration: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="200"
      height="20"
      viewBox="0 0 200 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dataStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 10 L50 10 L60 5 L70 15 L80 10 L200 10"
        stroke="url(#dataStreamGrad)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};

/**
 * 电路节点装饰
 */
export const CircuitNodeDecoration: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = '', color = '#9d00ff', size = 40 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="3" fill={color}>
        <animate
          attributeName="r"
          values="3;5;3"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <path
        d="M20 20 L20 5 M20 20 L35 20 M20 20 L20 35 M20 20 L5 20"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />
      <circle cx="20" cy="5" r="2" fill={color} opacity="0.4" />
      <circle cx="35" cy="20" r="2" fill={color} opacity="0.4" />
      <circle cx="20" cy="35" r="2" fill={color} opacity="0.4" />
      <circle cx="5" cy="20" r="2" fill={color} opacity="0.4" />
    </svg>
  );
};

/**
 * 霓虹边框装饰
 */
export const NeonBorderDecoration: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M10 0 L20 0 L20 5 L80 5 L80 0 L90 0 L100 10 L100 20 L95 20 L95 80 L100 80 L100 90 L90 100 L80 100 L80 95 L20 95 L20 100 L10 100 L0 90 L0 80 L5 80 L5 20 L0 20 L0 10 Z"
        stroke={color}
        strokeWidth="2"
        filter="url(#neonGlow)"
      />
    </svg>
  );
};

/**
 * 扫描线效果
 */
export const ScanlineEffect: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = 'rgba(0, 240, 255, 0.1)' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="scanlines" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="2" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scanlines)" />
    </svg>
  );
};

/**
 * 矩阵雨效果
 */
export const MatrixRainDecoration: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#00f0ff' }) => {
  const columns = 20;
  const drops = Array.from({ length: columns }, () => Math.random() * 20);

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="matrixGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>
      {drops.map((y, i) => (
        <text
          key={i}
          x={i * 5 + 2}
          y={y}
          fill={color}
          fontSize="12"
          fontFamily="monospace"
          filter="url(#matrixGlow)"
          opacity={0.7}
        >
          {String.fromCharCode(0x30A0 + Math.random() * 96)}
        </text>
      ))}
    </svg>
  );
};

/**
 * 六边形网格装饰
 */
export const HexGridDecoration: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = '', color = 'rgba(0, 240, 255, 0.1)', size = 30 }) => {
  const hexWidth = size * Math.sqrt(3);
  const hexHeight = size * 2;
  const rows = 5;
  const cols = 5;

  return (
    <svg
      className={className}
      width={cols * hexWidth}
      height={rows * hexHeight * 0.75}
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const x = col * hexWidth + (row % 2) * (hexWidth / 2);
          const y = row * hexHeight * 0.75;
          const points = `${size},0 ${size * 1.5},${size * 0.866} ${size},${size * 1.732} ${0},${size * 1.732} ${-size * 0.5},${size * 0.866}`;

          return (
            <polygon
              key={`${row}-${col}`}
              points={points}
              transform={`translate(${x + size}, ${y})`}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          );
        })
      )}
    </svg>
  );
};

/**
 * 全息扫描效果
 */
export const HologramScanDecoration: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hologramGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.rect
        x="0"
        y="0"
        width="100"
        height="2"
        fill="url(#hologramGrad)"
        animate={{ y: [0, 100, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};

/**
 * 能量环装饰
 */
export const EnergyRingDecoration: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = '', color = '#9d00ff', size = 60 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="25" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="30" cy="30" r="20" stroke={color} strokeWidth="1" opacity="0.5">
        <animate
          attributeName="r"
          values="20;25;20"
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
      <circle cx="30" cy="30" r="15" stroke={color} strokeWidth="1" opacity="0.7" />
    </svg>
  );
};

/**
 * 脉冲点装饰
 */
export const PulsePointDecoration: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = '', color = '#ff0080', size = 20 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="4" fill={color}>
        <animate
          attributeName="r"
          values="4;8;4"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="10" cy="10" r="2" fill={color} />
    </svg>
  );
};

/**
 * 故障效果装饰
 */
export const GlitchEffectDecoration: React.FC<{
  className?: string;
  text?: string;
  colors?: string[];
}> = ({
  className = '',
  text = 'GLITCH',
  colors = ['#00f0ff', '#9d00ff', '#ff0080']
}) => {
  return (
    <svg
      className={className}
      width="200"
      height="50"
      viewBox="0 0 200 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAlign="center"
        fill={colors[0]}
        fontSize="24"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {text}
      </text>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAlign="center"
        fill={colors[1]}
        fontSize="24"
        fontWeight="bold"
        fontFamily="monospace"
        opacity="0.7"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="-2,0;2,0;-2,0"
          dur="0.1s"
          repeatCount="indefinite"
        />
        {text}
      </text>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAlign="center"
        fill={colors[2]}
        fontSize="24"
        fontWeight="bold"
        fontFamily="monospace"
        opacity="0.5"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="2,0;-2,0;2,0"
          dur="0.15s"
          repeatCount="indefinite"
        />
        {text}
      </text>
    </svg>
  );
};
