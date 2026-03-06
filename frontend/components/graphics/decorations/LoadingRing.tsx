/**
 * LoadingRing - 赛博朋克风格环形加载器
 *
 * @example
 * ```tsx
 * import { LoadingRing } from '@/components/graphics/decorations';
 *
 * <LoadingRing size={64} />
 * <LoadingRing size={48} color="#00f0ff" animated />
 * ```
 */

import React from 'react';

export interface LoadingRingProps {
  /** 尺寸 */
  size?: number;
  /** 颜色 */
  color?: string;
  /** 描边宽度 */
  strokeWidth?: number;
  /** 是否动画 */
  animated?: boolean;
  /** 动画持续时间(秒) */
  duration?: number;
  /** CSS 类名 */
  className?: string;
}

export const LoadingRing: React.FC<LoadingRingProps> = ({
  size = 48,
  color = '#00f0ff',
  strokeWidth = 3,
  animated = true,
  duration = 1.5,
  className = ''
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`loadingGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
      </defs>

      {/* 背景圆环 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.2"
        style={{ color }}
      />

      {/* 动画圆环 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="url(#loadingGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.25}
        transform={`rotate(-90 ${center} ${center})`}
        style={
          animated
            ? {
                animation: `loadingSpin ${duration}s linear infinite`,
                origin: 'center'
              }
            : {}
        }
      />

      {/* 内部装饰点 */}
      <circle cx={center} cy={strokeWidth * 1.5} r={strokeWidth / 2} fill="#00f0ff" />

      <style>{`
        @keyframes loadingSpin {
          0% {
            stroke-dashoffset: ${circumference * 0.25};
            transform: rotate(-90deg);
          }
          50% {
            stroke-dashoffset: ${circumference * 0.75};
          }
          100% {
            stroke-dashoffset: ${circumference * 0.25};
            transform: rotate(270deg);
          }
        }
      `}</style>
    </svg>
  );
};

/**
 * PulseLoader - 脉冲加载器
 */
export interface PulseLoaderProps {
  /** 尺寸 */
  size?: number;
  /** 颜色 */
  color?: string;
  /** 脉冲圈数 */
  rings?: number;
  /** 是否动画 */
  animated?: boolean;
  /** CSS 类名 */
  className?: string;
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  size = 48,
  color = '#00f0ff',
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
      className={className}
      style={{ display: 'block' }}
    >
      {/* 中心点 */}
      <circle cx={center} cy={center} r={size * 0.1} fill={color} />

      {/* 脉冲圈 */}
      {Array.from({ length: rings }).map((_, i) => {
        const delay = i * 0.3;
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={size * 0.15}
            fill="none"
            stroke={color}
            strokeWidth={2}
            opacity={0.6}
            style={
              animated
                ? {
                    animation: `pulseWave 1.5s ease-out ${delay}s infinite`
                  }
                : {}
            }
          />
        );
      })}

      <style>{`
        @keyframes pulseWave {
          0% {
            r: ${size * 0.15};
            opacity: 0.6;
          }
          100% {
            r: ${size * 0.4};
            opacity: 0;
          }
        }
      `}</style>
    </svg>
  );
};

/**
 * TechBorder - 科技风格边框
 */
export interface TechBorderProps {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 是否圆角 */
  rounded?: boolean;
  /** 是否发光 */
  glow?: boolean;
  /** 颜色 */
  color?: string;
  /** CSS 类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

export const TechBorder: React.FC<TechBorderProps> = ({
  width = 400,
  height = 300,
  rounded = true,
  glow = true,
  color = '#00f0ff',
  className = '',
  children
}) => {
  const cornerSize = 20;
  const borderRadius = rounded ? 8 : 0;
  const filter = glow ? 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))' : 'none';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter, position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        <linearGradient id={`techBorderGradient-${width}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#9d00ff" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>
      </defs>

      {/* 左上角 */}
      <path
        d={`M ${cornerSize} 0 L 0 0 L 0 ${cornerSize}`}
        stroke="url(#techBorderGradient)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx={cornerSize / 2} cy={cornerSize / 2} r={2} fill={color} />

      {/* 右上角 */}
      <path
        d={`M ${width - cornerSize} 0 L ${width} 0 L ${width} ${cornerSize}`}
        stroke="url(#techBorderGradient)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx={width - cornerSize / 2} cy={cornerSize / 2} r={2} fill={color} />

      {/* 左下角 */}
      <path
        d={`M 0 ${height - cornerSize} L 0 ${height} L ${cornerSize} ${height}`}
        stroke="url(#techBorderGradient)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx={cornerSize / 2} cy={height - cornerSize / 2} r={2} fill={color} />

      {/* 右下角 */}
      <path
        d={`M ${width} ${height - cornerSize} L ${width} ${height} L ${width - cornerSize} ${height}`}
        stroke="url(#techBorderGradient)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx={width - cornerSize / 2} cy={height - cornerSize / 2} r={2} fill={color} />

      {/* 装饰线 */}
      {rounded && (
        <>
          <rect x={8} y={8} width={width - 16} height={height - 16} rx={borderRadius} stroke={color} strokeOpacity="0.3" strokeWidth="1" fill="none" />
        </>
      )}

      {/* 科技元素 */}
      <g opacity="0.5">
        {/* 上方数据点 */}
        <circle cx={width * 0.25} cy={4} r={1.5} fill={color} />
        <circle cx={width * 0.5} cy={4} r={1.5} fill={color} />
        <circle cx={width * 0.75} cy={4} r={1.5} fill={color} />

        {/* 下方数据点 */}
        <circle cx={width * 0.25} cy={height - 4} r={1.5} fill={color} />
        <circle cx={width * 0.5} cy={height - 4} r={1.5} fill={color} />
        <circle cx={width * 0.75} cy={height - 4} r={1.5} fill={color} />

        {/* 左侧数据点 */}
        <circle cx={4} cy={height * 0.25} r={1.5} fill={color} />
        <circle cx={4} cy={height * 0.5} r={1.5} fill={color} />
        <circle cx={4} cy={height * 0.75} r={1.5} fill={color} />

        {/* 右侧数据点 */}
        <circle cx={width - 4} cy={height * 0.25} r={1.5} fill={color} />
        <circle cx={width - 4} cy={height * 0.5} r={1.5} fill={color} />
        <circle cx={width - 4} cy={height * 0.75} r={1.5} fill={color} />
      </g>
    </svg>
  );
};

/**
 * CornerBracket - 角标装饰
 */
export interface CornerBracketProps {
  /** 位置 */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 尺寸 */
  size?: number;
  /** 颜色 */
  color?: string;
  /** 线宽 */
  strokeWidth?: number;
  /** CSS 类名 */
  className?: string;
}

export const CornerBracket: React.FC<CornerBracketProps> = ({
  position = 'top-left',
  size = 40,
  color = '#00f0ff',
  strokeWidth = 2,
  className = ''
}) => {
  const paths = {
    'top-left': `M 0 ${size} L 0 0 L ${size} 0`,
    'top-right': `M ${size} 0 L ${size} ${size} L 0 ${size}`,
    'bottom-left': `M ${size} ${size} L ${size} 0 L 0 0`,
    'bottom-right': `M 0 ${size} L 0 0 L ${size} 0`
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id={`cornerGradient-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
      </defs>

      {/* 主角标 */}
      <path
        d={paths[position]}
        stroke="url(#cornerGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />

      {/* 装饰点 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={strokeWidth}
        fill={color}
        opacity="0.6"
      />

      {/* 外部小点 */}
      <circle
        cx={size / 4}
        cy={size / 4}
        r={strokeWidth / 2}
        fill={color}
        opacity="0.4"
      />
    </svg>
  );
};

/**
 * DividerLine - 分割线
 */
export interface DividerLineProps {
  /** 变体 */
  variant?: 'simple' | 'tech' | 'double' | 'dashed';
  /** 宽度 */
  width?: number | 'full';
  /** 颜色 */
  color?: string;
  /** CSS 类名 */
  className?: string;
}

export const DividerLine: React.FC<DividerLineProps> = ({
  variant = 'simple',
  width = 'full',
  color = '#00f0ff',
  className = ''
}) => {
  const actualWidth = width === 'full' ? '100%' : `${width}px`;

  const renderDivider = () => {
    switch (variant) {
      case 'simple':
        return (
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
        );

      case 'tech':
        return (
          <>
            <line
              x1="0"
              y1="0"
              x2="45%"
              y2="0"
              stroke="url(#dividerGradient)"
              strokeWidth="1"
            />
            <circle cx="50%" cy="0" r={3} fill={color} />
            <circle cx="50%" cy="0" r={6} fill={color} opacity="0.3" />
            <line
              x1="55%"
              y1="0"
              x2="100%"
              y2="0"
              stroke="url(#dividerGradient)"
              strokeWidth="1"
            />
          </>
        );

      case 'double':
        return (
          <>
            <line x1="0" y1="-2" x2="100%" y2="-2" stroke={color} strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="2" x2="100%" y2="2" stroke={color} strokeWidth="1" opacity="0.3" />
          </>
        );

      case 'dashed':
        return (
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            stroke={color}
            strokeWidth="1"
            strokeDasharray="8 8"
            opacity="0.3"
          />
        );

      default:
        return null;
    }
  };

  return (
    <svg
      width={actualWidth}
      height="12"
      viewBox="0 0 100 12"
      fill="none"
      className={className}
      style={{ display: 'block', width: actualWidth }}
    >
      <defs>
        <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {renderDivider()}
    </svg>
  );
};

export default {
  LoadingRing,
  PulseLoader,
  TechBorder,
  CornerBracket,
  DividerLine
};
