/**
 * CyberPress Decorative Elements
 *
 * 赛博朋克风格装饰元素组件
 *
 * @example
 * ```tsx
 * import { NeonLine, TechCorner, DataStream, HologramOverlay } from '@/components/graphics/decorations/CyberDecorations';
 *
 * <NeonLine variant="horizontal" />
 * <TechCorner position="top-left" />
 * <DataStream animated />
 * ```
 */

import React from 'react';

// ============================================
// 基础属性
// ============================================

export interface DecorationProps {
  /** 颜色 */
  color?: string;
  /** CSS 类名 */
  className?: string;
}

// ============================================
// NeonLine - 霓虹线装饰
// ============================================

export interface NeonLineProps extends DecorationProps {
  /** 方向 */
  variant?: 'horizontal' | 'vertical' | 'diagonal';
  /** 长度 */
  length?: number;
  /** 线宽 */
  strokeWidth?: number;
  /** 是否发光 */
  glow?: boolean;
}

export const NeonLine: React.FC<NeonLineProps> = ({
  color = '#00f0ff',
  variant = 'horizontal',
  length = 200,
  strokeWidth = 2,
  glow = true,
  className = ''
}) => {
  const isHorizontal = variant === 'horizontal';
  const isVertical = variant === 'vertical';

  const width = isHorizontal ? length : strokeWidth;
  const height = isVertical ? length : strokeWidth;

  // 计算对角线尺寸
  const diagonalLength = Math.sqrt(2 * Math.pow(length, 2));

  return (
    <svg
      width={variant === 'diagonal' ? diagonalLength : width}
      height={variant === 'diagonal' ? strokeWidth : height}
      viewBox={`0 0 ${variant === 'diagonal' ? diagonalLength : width} ${variant === 'diagonal' ? strokeWidth : height}`}
      className={className}
      style={{ filter: glow ? `drop-shadow(0 0 6px ${color})` : 'none' }}
    >
      <defs>
        <linearGradient id={`neonLine-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {variant === 'horizontal' && (
        <line x1="0" y1={strokeWidth / 2} x2={length} y2={strokeWidth / 2} stroke={`url(#neonLine-${variant})`} strokeWidth={strokeWidth} />
      )}

      {variant === 'vertical' && (
        <line x1={strokeWidth / 2} y1="0" x2={strokeWidth / 2} y2={length} stroke={`url(#neonLine-${variant})`} strokeWidth={strokeWidth} />
      )}

      {variant === 'diagonal' && (
        <line
          x1="0"
          y1={strokeWidth / 2}
          x2={diagonalLength}
          y2={strokeWidth / 2}
          stroke={`url(#neonLine-${variant})`}
          strokeWidth={strokeWidth}
          transform={`rotate(-45 ${diagonalLength / 2} ${strokeWidth / 2})`}
        />
      )}
    </svg>
  );
};

// ============================================
// TechCorner - 科技角标
// ============================================

export interface TechCornerProps extends DecorationProps {
  /** 位置 */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 尺寸 */
  size?: number;
  /** 线宽 */
  strokeWidth?: number;
  /** 双线 */
  double?: boolean;
}

export const TechCorner: React.FC<TechCornerProps> = ({
  color = '#00f0ff',
  position = 'top-left',
  size = 60,
  strokeWidth = 2,
  double = false,
  className = ''
}) => {
  const paths: Record<string, string> = {
    'top-left': `M ${size} 0 L 0 0 L 0 ${size}`,
    'top-right': `M 0 0 L ${size} 0 L ${size} ${size}`,
    'bottom-left': `M 0 ${size} L 0 0 L ${size} 0`,
    'bottom-right': `M ${size} ${size} L ${size} 0 L 0 0`
  };

  const innerPaths: Record<string, string> = {
    'top-left': `M ${size - 10} 5 L 5 5 L 5 ${size - 10}`,
    'top-right': `M 5 5 L ${size - 5} 5 L ${size - 5} ${size - 5}`,
    'bottom-left': `M 5 ${size - 5} L 5 5 L ${size - 5} 5`,
    'bottom-right': `M ${size - 5} ${size - 5} L ${size - 5} 5 L 5 5`
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    >
      {/* 外层角标 */}
      <path
        d={paths[position]}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* 内层角标（如果启用双线） */}
      {double && (
        <path
          d={innerPaths[position]}
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          fill="none"
          opacity="0.6"
        />
      )}

      {/* 装饰点 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={strokeWidth}
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
};

// ============================================
// DataStream - 数据流动画
// ============================================

export interface DataStreamProps extends DecorationProps {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 粒子数量 */
  particles?: number;
  /** 是否动画 */
  animated?: boolean;
  /** 流动方向 */
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const DataStream: React.FC<DataStreamProps> = ({
  color = '#00f0ff',
  width = 200,
  height = 100,
  particles = 20,
  animated = true,
  direction = 'right',
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      style={{ opacity: 0.6 }}
    >
      {Array.from({ length: particles }).map((_, i) => {
        const x = (i / particles) * width;
        const y = Math.random() * height;
        const size = 1 + Math.random() * 2;
        const duration = 2 + Math.random() * 3;

        // 根据方向设置动画
        const animations: Record<string, { from: string; to: string; attribute: string }> = {
          left: { from: '0', to: `-${width}`, attribute: 'x' },
          right: { from: '0', to: `${width}`, attribute: 'x' },
          up: { from: '0', to: `-${height}`, attribute: 'y' },
          down: { from: '0', to: `${height}`, attribute: 'y' }
        };

        const animation = animations[direction];

        return (
          <circle
            key={i}
            cx={direction === 'left' || direction === 'right' ? x : width / 2}
            cy={direction === 'up' || direction === 'down' ? y : height / 2}
            r={size}
            fill={color}
          >
            {animated && (
              <animate
                attributeName={animation.attribute as 'x' | 'y'}
                from={animation.from}
                to={animation.to}
                dur={`${duration}s`}
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        );
      })}
    </svg>
  );
};

// ============================================
// HologramOverlay - 全息覆盖效果
// ============================================

export interface HologramOverlayProps extends DecorationProps {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 扫描线数量 */
  lines?: number;
  /** 是否动画 */
  animated?: boolean;
}

export const HologramOverlay: React.FC<HologramOverlayProps> = ({
  color = '#00f0ff',
  width = 400,
  height = 300,
  lines = 10,
  animated = true,
  className = ''
}) => {
  const lineSpacing = height / lines;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      style={{ opacity: 0.3 }}
    >
      {/* 水平扫描线 */}
      {Array.from({ length: lines }).map((_, i) => {
        const y = i * lineSpacing;
        return (
          <g key={i}>
            <line
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke={color}
              strokeWidth="1"
              opacity="0.5"
            />
            {animated && (
              <animate
                attributeName="opacity"
                values="0.5;0.8;0.5"
                dur="2s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            )}
          </g>
        );
      })}

      {/* 垂直干扰线 */}
      <line
        x1={width / 2}
        y1="0"
        x2={width / 2}
        y2={height}
        stroke={color}
        strokeWidth="2"
        opacity="0.2"
      >
        {animated && (
          <animate
            attributeName="x1"
            values="0;100;0"
            dur="5s"
            repeatCount="indefinite"
          />
        )}
        {animated && (
          <animate
            attributeName="x2"
            values="0;100;0"
            dur="5s"
            repeatCount="indefinite"
          />
        )}
      </line>

      {/* 装饰点 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = Math.random() * width;
        const y = Math.random() * height;

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1"
            fill={color}
            opacity="0.4"
          >
            {animated && (
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="1.5s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        );
      })}
    </svg>
  );
};

// ============================================
// PulseRing - 脉冲环
// ============================================

export interface PulseRingProps extends DecorationProps {
  /** 尺寸 */
  size?: number;
  /** 环数 */
  rings?: number;
  /** 是否动画 */
  animated?: boolean;
}

export const PulseRing: React.FC<PulseRingProps> = ({
  color = '#00f0ff',
  size = 100,
  rings = 3,
  animated = true,
  className = ''
}) => {
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      {/* 中心点 */}
      <circle cx={center} cy={center} r={size * 0.05} fill={color} />

      {/* 脉冲环 */}
      {Array.from({ length: rings }).map((_, i) => {
        const delay = i * 0.4;
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={size * 0.1}
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity="0.6"
          >
            {animated && (
              <animate
                attributeName="r"
                values={`${size * 0.1};${size * 0.4};${size * 0.1}`}
                dur="3s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            )}
            {animated && (
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur="3s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        );
      })}
    </svg>
  );
};

// ============================================
// GridTarget - 网格目标
// ============================================

export interface GridTargetProps extends DecorationProps {
  /** 尺寸 */
  size?: number;
  /** 网格数量 */
  gridLines?: number;
  /** 是否动画 */
  animated?: boolean;
}

export const GridTarget: React.FC<GridTargetProps> = ({
  color = '#00f0ff',
  size = 200,
  gridLines = 4,
  animated = true,
  className = ''
}) => {
  const center = size / 2;
  const maxRadius = size * 0.4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      {/* 同心圆 */}
      {Array.from({ length: gridLines }).map((_, i) => {
        const radius = ((i + 1) / gridLines) * maxRadius;
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          >
            {animated && (
              <animate
                attributeName="opacity"
                values="0.5;0.8;0.5"
                dur="2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        );
      })}

      {/* 十字线 */}
      <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke={color} strokeWidth="1" opacity="0.5" />

      {/* 中心点 */}
      <circle cx={center} cy={center} r={3} fill={color}>
        {animated && (
          <animate
            attributeName="r"
            values="3;5;3"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
};

// ============================================
// 导出所有装饰组件
// ============================================

export default {
  NeonLine,
  TechCorner,
  DataStream,
  HologramOverlay,
  PulseRing,
  GridTarget
};
