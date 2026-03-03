/**
 * CyberPress Data Visualization Icons
 *
 * 数据可视化图标组件 - 赛博朋克风格
 *
 * @example
 * ```tsx
 * import { ChartIcon, GraphIcon, AnalyticsIcon } from '@/components/graphics/DataVizIcons';
 *
 * <ChartIcon type="line" data={data} />
 * <GraphIcon type="bar" />
 * <AnalyticsIcon animated />
 * ```
 */

import React from 'react';

// ==================== 基础属性 ====================

export interface DataVizIconProps {
  /** 图标尺寸 */
  size?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用动画 */
  animated?: boolean;
  /** 自定义颜色 */
  color?: string;
}

// ==================== 图表图标 ====================

export interface ChartIconProps extends DataVizIconProps {
  /** 图表类型 */
  type?: 'line' | 'bar' | 'pie' | 'area';
  /** 数据值 (0-100) */
  value?: number;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
}

/**
 * 通用图表图标
 */
export const ChartIcon: React.FC<ChartIconProps> = ({
  size = 48,
  className = '',
  animated = false,
  type = 'line',
  value = 75,
  variant = 'cyan'
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88'
  };

  const color = colors[variant];

  if (type === 'line') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* 坐标轴 */}
        <line x1="4" y1="44" x2="44" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="4" y1="4" x2="4" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* 折线 */}
        <polyline
          points="4,36 14,28 24,32 34,16 44,20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 数据点 */}
        <circle cx="14" cy="28" r="2" fill={color}>
          {animated && (
            <animate
              attributeName="r"
              values="2;3;2"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="24" cy="32" r="2" fill={color}>
          {animated && (
            <animate
              attributeName="r"
              values="2;3;2"
              dur="2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="34" cy="16" r="2" fill={color}>
          {animated && (
            <animate
              attributeName="r"
              values="2;3;2"
              dur="2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 填充区域 */}
        <path
          d="M4,36 L14,28 L24,32 L34,16 L44,20 L44,44 L4,44 Z"
          fill={color}
          opacity="0.1"
        />
      </svg>
    );
  }

  if (type === 'bar') {
    const barHeight = (value / 100) * 36;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* 坐标轴 */}
        <line x1="4" y1="44" x2="44" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="4" y1="4" x2="4" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* 柱状图 */}
        <rect
          x="8"
          y={44 - barHeight * 0.6}
          width="6"
          height={barHeight * 0.6}
          fill={color}
          opacity="0.6"
        >
          {animated && (
            <animate
              attributeName="height"
              from="0"
              to={barHeight * 0.6}
              dur="1s"
              fill="freeze"
            />
          )}
        </rect>
        <rect
          x="18"
          y={44 - barHeight * 0.8}
          width="6"
          height={barHeight * 0.8}
          fill={color}
          opacity="0.8"
        >
          {animated && (
            <animate
              attributeName="height"
              from="0"
              to={barHeight * 0.8}
              dur="1s"
              begin="0.2s"
              fill="freeze"
            />
          )}
        </rect>
        <rect
          x="28"
          y={44 - barHeight}
          width="6"
          height={barHeight}
          fill={color}
        >
          {animated && (
            <animate
              attributeName="height"
              from="0"
              to={barHeight}
              dur="1s"
              begin="0.4s"
              fill="freeze"
            />
          )}
        </rect>
        <rect
          x="38"
          y={44 - barHeight * 0.5}
          width="6"
          height={barHeight * 0.5}
          fill={color}
          opacity="0.5"
        >
          {animated && (
            <animate
              attributeName="height"
              from="0"
              to={barHeight * 0.5}
              dur="1s"
              begin="0.6s"
              fill="freeze"
            />
          )}
        </rect>
      </svg>
    );
  }

  if (type === 'pie') {
    const circumference = 2 * Math.PI * 16;
    const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* 背景圆 */}
        <circle
          cx="24"
          cy="24"
          r="16"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          opacity="0.1"
        />

        {/* 数据圆 */}
        <circle
          cx="24"
          cy="24"
          r="16"
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={circumference * 0.25}
          transform="rotate(-90 24 24)"
        >
          {animated && (
            <animate
              attributeName="stroke-dasharray"
              from={`0 ${circumference}`}
              to={strokeDasharray}
              dur="1.5s"
              fill="freeze"
            />
          )}
        </circle>

        {/* 中心文字 */}
        <text
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill={color}
          fontWeight="bold"
        >
          {value}%
        </text>
      </svg>
    );
  }

  // Area chart (default)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 坐标轴 */}
      <line x1="4" y1="44" x2="44" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="4" y1="4" x2="4" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3" />

      {/* 面积图 */}
      <path
        d="M4,44 L4,32 L12,28 L20,36 L28,20 L36,24 L44,12 L44,44 Z"
        fill="url(#areaGradient)"
      />

      {/* 线条 */}
      <polyline
        points="4,32 12,28 20,36 28,20 36,24 44,12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

// ==================== 进度环图标 ====================

export interface ProgressRingIconProps extends DataVizIconProps {
  /** 进度值 (0-100) */
  progress: number;
  /** 环的粗细 */
  strokeWidth?: number;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
}

/**
 * 进度环图标
 */
export const ProgressRingIcon: React.FC<ProgressRingIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  progress = 75,
  strokeWidth = 4,
  variant = 'cyan'
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
    yellow: '#f0ff00'
  };

  const color = colors[variant];
  const radius = (size - strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景环 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        opacity="0.1"
      />

      {/* 进度环 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={circumference * 0.25}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      >
        {animated && (
          <animate
            attributeName="stroke-dasharray"
            from={`0 ${circumference}`}
            to={strokeDasharray}
            dur="1s"
            fill="freeze"
          />
        )}
      </circle>

      {/* 中心百分比 */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size / 5}
        fill={color}
        fontWeight="bold"
      >
        {progress}%
      </text>
    </svg>
  );
};

// ==================== 仪表盘图标 ====================

export interface GaugeIconProps extends DataVizIconProps {
  /** 值 (0-100) */
  value: number;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
}

/**
 * 仪表盘图标
 */
export const GaugeIcon: React.FC<GaugeIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  value = 75,
  min = 0,
  max = 100,
  variant = 'cyan'
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
    yellow: '#f0ff00',
    red: '#ff0040'
  };

  const color = colors[variant];
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180 - 90;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* 背景弧 */}
      <path
        d="M8,36 A16,16 0 0,1 40,36"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        opacity="0.1"
        strokeLinecap="round"
      />

      {/* 进度弧 */}
      <path
        d="M8,36 A16,16 0 0,1 40,36"
        stroke="url(#gaugeGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${(percentage / 100) * 50.27} 50.27`}
      >
        {animated && (
          <animate
            attributeName="stroke-dasharray"
            from="0 50.27"
            to={`${(percentage / 100) * 50.27} 50.27`}
            dur="1s"
            fill="freeze"
          />
        )}
      </path>

      {/* 指针 */}
      <g
        transform={`rotate(${angle} 24 36)`}
        style={{ transformOrigin: '24px 36px' }}
      >
        <polygon
          points="24,20 21,36 27,36"
          fill={color}
        >
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="-90 24 36"
              to={`${angle} 24 36`}
              dur="1s"
              fill="freeze"
            />
          )}
        </polygon>
      </g>

      {/* 中心点 */}
      <circle cx="24" cy="36" r="3" fill={color} />
    </svg>
  );
};

// ==================== 脉冲图标 ====================

export interface PulseIconProps extends DataVizIconProps {
  /** 脉冲强度 */
  intensity?: 'low' | 'medium' | 'high';
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
}

/**
 * 脉冲动画图标
 */
export const PulseIcon: React.FC<PulseIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  intensity = 'medium',
  variant = 'cyan'
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88'
  };

  const intensityValues = {
    low: { scale: 1.2, duration: 2 },
    medium: { scale: 1.5, duration: 1.5 },
    high: { scale: 2, duration: 1 }
  };

  const config = intensityValues[intensity];
  const color = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 外圈脉冲 */}
      <circle cx="24" cy="24" r="16" fill={color} opacity="0.2">
        {animated && (
          <>
            <animate
              attributeName="r"
              values="16;{16 * config.scale};16"
              dur={`${config.duration}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0;0.2"
              dur={`${config.duration}s`}
              repeatCount="indefinite"
            />
          </>
        )}
      </circle>

      {/* 中圈脉冲 */}
      <circle cx="24" cy="24" r="12" fill={color} opacity="0.4">
        {animated && (
          <>
            <animate
              attributeName="r"
              values="12;{12 * config.scale * 0.8};12"
              dur={`${config.duration}s`}
              begin="0.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0;0.4"
              dur={`${config.duration}s`}
              begin="0.2s"
              repeatCount="indefinite"
            />
          </>
        )}
      </circle>

      {/* 内圈核心 */}
      <circle cx="24" cy="24" r="8" fill={color}>
        {animated && (
          <animate
            attributeName="r"
            values="8;10;8"
            dur={`${config.duration / 2}s`}
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
};

// ==================== 波形图标 ====================

export interface WaveformIconProps extends DataVizIconProps {
  /** 波形类型 */
  type?: 'sine' | 'square' | 'sawtooth' | 'random';
  /** 振幅 */
  amplitude?: number;
  /** 频率 */
  frequency?: number;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
}

/**
 * 波形图标
 */
export const WaveformIcon: React.FC<WaveformIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  type = 'sine',
  amplitude = 10,
  frequency = 3,
  variant = 'cyan'
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88'
  };

  const color = colors[variant];

  // 生成波形路径
  const generateWavePath = (offset: number) => {
    const points = [];
    for (let x = 0; x <= 44; x += 2) {
      let y = 24;
      const normalizedX = x / 44;

      if (type === 'sine') {
        y = 24 + Math.sin((normalizedX * Math.PI * frequency) + offset) * amplitude;
      } else if (type === 'square') {
        y = 24 + (Math.sin((normalizedX * Math.PI * frequency) + offset) > 0 ? amplitude : -amplitude);
      } else if (type === 'sawtooth') {
        y = 24 + ((normalizedX * frequency * 2 + offset / (Math.PI * 2)) % 2 - 1) * amplitude;
      } else {
        // random
        y = 24 + (Math.random() - 0.5) * amplitude * 2;
      }

      points.push(`${x},${y}`);
    }

    return `M${points.join(' L')}`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 网格线 */}
      <line x1="0" y1="24" x2="48" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

      {/* 波形 */}
      <path
        d={generateWavePath(0)}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {animated && type !== 'random' && (
          <animate
            attributeName="d"
            values={`${generateWavePath(0)};${generateWavePath(Math.PI * 2)};${generateWavePath(0)}`}
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </path>
    </svg>
  );
};

// ==================== 数据流图标 ====================

export interface DataStreamIconProps extends DataVizIconProps {
  /** 流向 */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** 数据点数量 */
  dotCount?: number;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
}

/**
 * 数据流动画图标
 */
export const DataStreamIcon: React.FC<DataStreamIconProps> = ({
  size = 48,
  className = '',
  animated = true,
  direction = 'right',
  dotCount = 5,
  variant = 'cyan'
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88'
  };

  const color = colors[variant];

  // 根据方向计算运动路径
  const getMotionPath = () => {
    switch (direction) {
      case 'left': return 'M48,24 L0,24';
      case 'right': return 'M0,24 L48,24';
      case 'up': return 'M24,48 L24,0';
      case 'down': return 'M24,0 L24,48';
      default: return 'M0,24 L48,24';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 轨道 */}
      <line
        x1="0"
        y1="24"
        x2="48"
        y2="24"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.1"
      />

      {/* 数据点 */}
      {Array.from({ length: dotCount }).map((_, i) => (
        <circle
          key={i}
          r="3"
          fill={color}
        >
          {animated && (
            <animateMotion
              dur={`${1 + i * 0.2}s`}
              repeatCount="indefinite"
              path={getMotionPath()}
              begin={`${i * 0.3}s`}
            />
          )}
        </circle>
      ))}

      {/* 箭头 */}
      <polygon
        points={
          direction === 'right' ? '42,20 48,24 42,28' :
          direction === 'left' ? '6,20 0,24 6,28' :
          direction === 'up' ? '20,6 24,0 28,6' :
          '20,42 24,48 28,42'
        }
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
};

export default {
  ChartIcon,
  ProgressRingIcon,
  GaugeIcon,
  PulseIcon,
  WaveformIcon,
  DataStreamIcon
};
