/**
 * CyberPress Decorative Elements
 *
 * 赛博朋克风格装饰元素
 * 用于页面美化和视觉增强
 *
 * @example
 * ```tsx
 * import { CyberCorners, TechLines, NeonParticles } from '@/components/graphics/DecorativeElements';
 *
 * <div className="relative">
 *   <CyberCorners />
 *   <TechLines />
 * </div>
 * ```
 */

import React from 'react';

// ==================== 角落装饰 ====================

export interface CyberCornersProps {
  size?: number;
  color?: string;
  glow?: boolean;
  className?: string;
}

/**
 * 赛博角落装饰 - 四角科技感装饰
 */
export const CyberCorners: React.FC<CyberCornersProps> = ({
  size = 100,
  color = '#00f0ff',
  glow = true,
  className = ''
}) => {
  const glowFilter = glow ? 'drop-shadow(0 0 3px rgba(0, 240, 255, 0.5))' : '';

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* 左上角 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="absolute top-0 left-0"
        style={{ filter: glowFilter }}
      >
        <path d="M10 40 V10 H40" stroke={color} strokeWidth="2" fill="none" />
        <path d="M20 50 V20 H50" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="10" cy="10" r="3" fill={color} />
        <circle cx="40" cy="10" r="2" fill={color} opacity="0.6" />
        <circle cx="10" cy="40" r="2" fill={color} opacity="0.6" />
      </svg>

      {/* 右上角 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="absolute top-0 right-0 rotate-90"
        style={{ filter: glowFilter }}
      >
        <path d="M10 40 V10 H40" stroke={color} strokeWidth="2" fill="none" />
        <path d="M20 50 V20 H50" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="10" cy="10" r="3" fill={color} />
        <circle cx="40" cy="10" r="2" fill={color} opacity="0.6" />
        <circle cx="10" cy="40" r="2" fill={color} opacity="0.6" />
      </svg>

      {/* 左下角 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="absolute bottom-0 left-0 -rotate-90"
        style={{ filter: glowFilter }}
      >
        <path d="M10 40 V10 H40" stroke={color} strokeWidth="2" fill="none" />
        <path d="M20 50 V20 H50" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="10" cy="10" r="3" fill={color} />
        <circle cx="40" cy="10" r="2" fill={color} opacity="0.6" />
        <circle cx="10" cy="40" r="2" fill={color} opacity="0.6" />
      </svg>

      {/* 右下角 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="absolute bottom-0 right-0 rotate-180"
        style={{ filter: glowFilter }}
      >
        <path d="M10 40 V10 H40" stroke={color} strokeWidth="2" fill="none" />
        <path d="M20 50 V20 H50" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="10" cy="10" r="3" fill={color} />
        <circle cx="40" cy="10" r="2" fill={color} opacity="0.6" />
        <circle cx="10" cy="40" r="2" fill={color} opacity="0.6" />
      </svg>
    </div>
  );
};

// ==================== 科技线条 ====================

export interface TechLinesProps {
  density?: 'low' | 'medium' | 'high';
  color?: string;
  animated?: boolean;
  className?: string;
}

/**
 * 科技线条装饰 - 背景电路线路
 */
export const TechLines: React.FC<TechLinesProps> = ({
  density = 'medium',
  color = '#00f0ff',
  animated = true,
  className = ''
}) => {
  const lineCount = density === 'low' ? 3 : density === 'medium' ? 6 : 10;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 200"
      fill="none"
      className={`absolute inset-0 pointer-events-none ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="techLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {Array.from({ length: lineCount }).map((_, i) => {
        const y = (200 / (lineCount + 1)) * (i + 1);
        const delay = i * 0.2;

        return (
          <g key={i}>
            {/* 主线 */}
            <path
              d={`M0 ${y} H${100 + i * 30} V${y + (i % 2 === 0 ? 20 : -20)} H${200 + i * 20} V${y} H400`}
              stroke="url(#techLineGradient)"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />

            {/* 数据流动画 */}
            {animated && (
              <circle r="2" fill={color}>
                <animateMotion
                  dur={`${3 + delay}s`}
                  repeatCount="indefinite"
                  path={`M0 ${y} H${100 + i * 30} V${y + (i % 2 === 0 ? 20 : -20)} H${200 + i * 20} V${y} H400`}
                />
              </circle>
            )}

            {/* 节点 */}
            <circle cx={100 + i * 30} cy={y} r="2" fill={color} opacity="0.6" />
            <circle cx={200 + i * 20} cy={y} r="2" fill={color} opacity="0.6} />
          </g>
        );
      })}
    </svg>
  );
};

// ==================== 霓虹粒子 ====================

export interface NeonParticlesProps {
  count?: number;
  size?: number;
  color?: string;
  animated?: boolean;
  className?: string;
}

/**
 * 霓虹粒子装饰 - 漂浮的光点
 */
export const NeonParticles: React.FC<NeonParticlesProps> = ({
  count = 20,
  size = 3,
  color = '#00f0ff',
  animated = true,
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      fill="none"
      className={`absolute inset-0 pointer-events-none ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = (Math.random() * 360 + 20).toFixed(0);
        const y = (Math.random() * 260 + 20).toFixed(0);
        const r = (Math.random() * size + 1).toFixed(1);
        const opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
        const duration = (Math.random() * 3 + 2).toFixed(1);
        const delay = (Math.random() * 2).toFixed(1);

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={color}
            opacity={opacity}
          >
            {animated && (
              <>
                <animate
                  attributeName="opacity"
                  values={`${opacity};${parseFloat(opacity) * 0.3};${opacity}`}
                  dur={`${duration}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${y};${parseFloat(y) - 20};${y}`}
                  dur={`${parseFloat(duration) * 2}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
        );
      })}
    </svg>
  );
};

// ==================== 六边形网格 ====================

export interface HexGridProps {
  cellSize?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

/**
 * 六边形网格装饰 - 蜂窝状背景
 */
export const HexGrid: React.FC<HexGridProps> = ({
  cellSize = 30,
  color = '#00f0ff',
  opacity = 0.1,
  className = ''
}) => {
  const hexHeight = cellSize * Math.sqrt(3);
  const hexWidth = cellSize * 2;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      fill="none"
      className={`absolute inset-0 pointer-events-none ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="hexPattern"
          width={hexWidth}
          height={hexHeight}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${cellSize} 0 L${hexWidth * 0.75} ${hexHeight * 0.25} L${hexWidth * 0.75} ${hexHeight * 0.75} L${cellSize} ${hexHeight} L${hexWidth * 0.25} ${hexHeight * 0.75} L${hexWidth * 0.25} ${hexHeight * 0.25} Z`}
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#hexPattern)" />
    </svg>
  );
};

// ==================== 脉冲光环 ====================

export interface PulseRingProps {
  size?: number;
  color?: string;
  animated?: boolean;
  className?: string;
}

/**
 * 脉冲光环 - 扩散的圆形波纹
 */
export const PulseRing: React.FC<PulseRingProps> = ({
  size = 200,
  color = '#00f0ff',
  animated = true,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      style={{ margin: 'auto' }}
    >
      <defs>
        <radialGradient id="pulseGradient">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="70%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {animated && (
        <>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r="20"
              fill="url(#pulseGradient)"
              stroke={color}
              strokeWidth="1"
              opacity={1 - i * 0.3}
            >
              <animate
                attributeName="r"
                values="20;80;20"
                dur="3s"
                begin={`${i * 1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0;1"
                dur="3s"
                begin={`${i * 1}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </>
      )}

      {/* 中心点 */}
      <circle cx="100" cy="100" r="10" fill={color} opacity="0.8">
        {animated && (
          <animate
            attributeName="opacity"
            values="0.8;0.4;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
};

// ==================== 代码雨背景 ====================

export interface CodeRainProps {
  density?: number;
  color?: string;
  animated?: boolean;
  className?: string;
}

/**
 * 代码雨背景 - Matrix风格下落代码
 */
export const CodeRain: React.FC<CodeRainProps> = ({
  density = 15,
  color = '#00ff88',
  animated = true,
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 600"
      fill="none"
      className={`absolute inset-0 pointer-events-none ${className}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ background: 'rgba(10, 10, 15, 0.5)' }}
    >
      <defs>
        <linearGradient id="codeRainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {Array.from({ length: density }).map((_, i) => {
        const x = (400 / density) * i + 20;
        const chars = '0123456789ABCDEF';
        const charCount = Math.floor(Math.random() * 15) + 10;

        return (
          <g key={i}>
            {Array.from({ length: charCount }).map((_, j) => {
              const y = 30 + j * 20;
              const char = chars[Math.floor(Math.random() * chars.length)];
              const opacity = 1 - (j / charCount) * 0.8;

              return (
                <text
                  key={j}
                  x={x}
                  y={y}
                  fontSize="14"
                  fill={color}
                  fontFamily="monospace"
                  opacity={opacity}
                >
                  {animated ? (
                    <animate
                      attributeName="opacity"
                      values={`${opacity};${opacity * 0.3};${opacity}`}
                      dur={`${2 + Math.random()}s`}
                      begin={`${j * 0.1}s`}
                      repeatCount="indefinite"
                    />
                  ) : null}
                  {char}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ==================== 故障条纹 ====================

export interface GlitchStripesProps {
  count?: number;
  colors?: string[];
  animated?: boolean;
  className?: string;
}

/**
 * 故障条纹 - RGB分离效果条纹
 */
export const GlitchStripes: React.FC<GlitchStripesProps> = ({
  count = 5,
  colors = ['#ff0080', '#00f0ff', '#00ff88'],
  animated = true,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const width = Math.random() * 100 + 50;
        const height = Math.random() * 3 + 1;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const color = colors[i % colors.length];

        return (
          <div
            key={i}
            className="absolute"
            style={{
              width: `${width}%`,
              height: `${height}px`,
              top: `${top}%`,
              left: `${left}%`,
              backgroundColor: color,
              opacity: Math.random() * 0.5 + 0.2
            }}
          >
            {animated && (
              <style>{`
                @keyframes glitch${i} {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-${Math.random() * 10}px); }
                  50% { transform: translateX(${Math.random() * 10}px); }
                  75% { transform: translateX(-${Math.random() * 5}px); }
                }
              `}</style>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default {
  CyberCorners,
  TechLines,
  NeonParticles,
  HexGrid,
  PulseRing,
  CodeRain,
  GlitchStripes,
};
