import React from 'react';

/**
 * 霓虹边框装饰 - 赛博朋克风格边框组件
 *
 * 用途：
 * - 卡片边框
 * - 图片边框
 * - 容器装饰
 * - 按钮边框
 *
 * @example
 * ```tsx
 * <NeonBorder width={300} height={200} variant="cyan" />
 * <NeonBorder width={400} height={300} variant="purple" animated={true} />
 * ```
 */

interface NeonBorderProps {
  width?: number;
  height?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  animated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

export const NeonBorder: React.FC<NeonBorderProps> = ({
  width = 300,
  height = 200,
  variant = 'cyan',
  className = '',
  animated = false,
  intensity = 'medium',
  children,
}) => {
  const colorMap = {
    cyan: { primary: '#00f0ff', secondary: '#00a0ff' },
    purple: { primary: '#9d00ff', secondary: '#bd66ff' },
    pink: { primary: '#ff0080', secondary: '#ff66b3' },
    yellow: { primary: '#f0ff00', secondary: '#f9ff80' },
    green: { primary: '#00ff88', secondary: '#66ffbb' },
  };

  const intensityMap = {
    low: { blur: 2, opacity: 0.5, strokeWidth: 1 },
    medium: { blur: 4, opacity: 0.7, strokeWidth: 2 },
    high: { blur: 6, opacity: 0.9, strokeWidth: 3 },
  };

  const colors = colorMap[variant];
  const intensitySettings = intensityMap[intensity];

  const filterId = `neon-border-${variant}-${intensity}`;

  return (
    <div className={`relative inline-block ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          {/* 霓虹发光滤镜 */}
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={intensitySettings.blur} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 扫描线图案 */}
          <pattern id="borderScanlines" patternUnits="userSpaceOnUse" width="2" height="2">
            <line
              x1="0"
              y1="0"
              x2="2"
              y2="0"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.05"
            />
          </pattern>

          {/* 角落装饰渐变 */}
          <linearGradient id="cornerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>

        {/* 主边框 */}
        <rect
          x="5"
          y="5"
          width={width - 10}
          height={height - 10}
          fill="none"
          stroke={colors.primary}
          strokeWidth={intensitySettings.strokeWidth}
          filter={`url(#${filterId})`}
          opacity={intensitySettings.opacity}
        >
          {animated && (
            <animate
              attributeName="opacity"
              values={`${intensitySettings.opacity};${intensitySettings.opacity * 0.5};${intensitySettings.opacity}`}
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </rect>

        {/* 内边框 */}
        <rect
          x="10"
          y="10"
          width={width - 20}
          height={height - 20}
          fill="none"
          stroke={colors.secondary}
          strokeWidth="1"
          opacity="0.3"
        />

        {/* 角落装饰 */}
        <g stroke="url(#cornerGradient)" strokeWidth="3" fill="none">
          {/* 左上角 */}
          <path d="M 15 25 L 15 15 L 25 15" />
          {/* 右上角 */}
          <path d={`M ${width - 25} 15 L ${width - 15} 15 L ${width - 15} 25`} />
          {/* 右下角 */}
          <path d={`M ${width - 15} ${height - 25} L ${width - 15} ${height - 15} L ${width - 25} ${height - 15}`} />
          {/* 左下角 */}
          <path d={`M 25 ${height - 15} L 15 ${height - 15} L 15 ${height - 25}`} />
        </g>

        {/* 装饰点 */}
        <circle cx="20" cy="20" r="2" fill={colors.primary} opacity="0.8">
          {animated && (
            <animate
              attributeName="r"
              values="2;3;2"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx={width - 20} cy="20" r="2" fill={colors.secondary} opacity="0.8">
          {animated && (
            <animate
              attributeName="r"
              values="2;3;2"
              dur="1.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx={width - 20} cy={height - 20} r="2" fill={colors.primary} opacity="0.8">
          {animated && (
            <animate
              attributeName="r"
              values="2;3;2"
              dur="1.5s"
              begin="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="20" cy={height - 20} r="2" fill={colors.secondary} opacity="0.8">
          {animated && (
            <animate
              attributeName="r"
              values="2;3;2"
              dur="1.5s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 扫描线覆盖 */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="url(#borderScanlines)"
          opacity="0.3"
        />
      </svg>

      {/* 内容区域 */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default NeonBorder;
