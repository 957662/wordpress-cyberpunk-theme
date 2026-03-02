import React from 'react';

/**
 * 数据流图标 - 数据传输主题
 *
 * 特点：
 * - 动态数据流效果
 * - 二进制代码装饰
 * - 速度感线条
 * - 科技感设计
 *
 * @example
 * ```tsx
 * <DataStreamIcon size={48} variant="cyan" animated={true} />
 * <DataStreamIcon size={40} variant="purple" />
 * ```
 */

interface DataStreamIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  animated?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
}

const colorMap = {
  cyan: { primary: '#00f0ff', secondary: '#00a0ff' },
  purple: { primary: '#9d00ff', secondary: '#bd66ff' },
  pink: { primary: '#ff0080', secondary: '#ff66b3' },
  green: { primary: '#00ff88', secondary: '#66ffbb' },
};

const speedMap = {
  slow: 3,
  normal: 2,
  fast: 1,
};

export const DataStreamIcon: React.FC<DataStreamIconProps> = ({
  size = 48,
  variant = 'cyan',
  className = '',
  animated = false,
  speed = 'normal',
}) => {
  const colors = colorMap[variant];
  const duration = speedMap[speed];

  // 二进制装饰数据
  const binaryData = ['0', '1', '1', '0', '1', '0', '0', '1'];

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
        {/* 数据流渐变 */}
        <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.secondary} stopOpacity="0" />
          <stop offset="50%" stopColor={colors.primary} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0" />
        </linearGradient>

        {/* 发光滤镜 */}
        <filter id="streamGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景数据流通道 */}
      <rect
        x="8"
        y="4"
        width="32"
        height="40"
        rx="2"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.2"
      />

      {/* 数据流线条 */}
      {[0, 1, 2].map((idx) => (
        <g key={idx}>
          <line
            x1="8"
            y1={12 + idx * 12}
            x2="40"
            y2={12 + idx * 12}
            stroke={colors.primary}
            strokeWidth="2"
            opacity="0.3"
          />

          {/* 移动的数据包 */}
          {animated && (
            <>
              <circle r="3" fill={colors.primary} filter="url(#streamGlow)">
                <animateMotion
                  dur={`${duration * 0.8 + idx * 0.2}s`}
                  repeatCount="indefinite"
                  path="M8,12 L40,12"
                  begin={idx * 0.3}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${duration * 0.8 + idx * 0.2}s`}
                  repeatCount="indefinite"
                  begin={idx * 0.3}
                />
              </circle>

              <circle r="2" fill={colors.secondary}>
                <animateMotion
                  dur={`${duration + idx * 0.3}s`}
                  repeatCount="indefinite"
                  path="M8,24 L40,24"
                  begin={0.5 + idx * 0.2}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${duration + idx * 0.3}s`}
                  repeatCount="indefinite"
                  begin={0.5 + idx * 0.2}
                />
              </circle>

              <circle r="2.5" fill={colors.primary} filter="url(#streamGlow)">
                <animateMotion
                  dur={`${duration * 0.9 + idx * 0.25}s`}
                  repeatCount="indefinite"
                  path="M8,36 L40,36"
                  begin={1 + idx * 0.25}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${duration * 0.9 + idx * 0.25}s`}
                  repeatCount="indefinite"
                  begin={1 + idx * 0.25}
                />
              </circle>
            </>
          )}
        </g>
      ))}

      {/* 二进制装饰 */}
      {binaryData.map((bit, idx) => (
        <text
          key={idx}
          x={2}
          y={8 + idx * 5}
          fontSize="3"
          fill={colors.primary}
          opacity="0.3"
          fontFamily="monospace"
        >
          {bit}
        </text>
      ))}

      {binaryData.map((bit, idx) => (
        <text
          key={idx}
          x={42}
          y={8 + idx * 5}
          fontSize="3"
          fill={colors.secondary}
          opacity="0.3"
          fontFamily="monospace"
        >
          {bit}
        </text>
      ))}

      {/* 速度线条 */}
      <line x1="12" y1="8" x2="8" y2="8" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
      <line x1="14" y1="10" x2="8" y2="10" stroke={colors.primary} strokeWidth="1" opacity="0.3" />
      <line x1="36" y1="38" x2="40" y2="38" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
      <line x1="34" y1="40" x2="40" y2="40" stroke={colors.primary} strokeWidth="1" opacity="0.3" />

      {/* 输入/输出端口 */}
      <rect x="6" y="10" width="3" height="4" rx="1" fill={colors.primary} opacity="0.6" />
      <rect x="6" y="22" width="3" height="4" rx="1" fill={colors.primary} opacity="0.6" />
      <rect x="6" y="34" width="3" height="4" rx="1" fill={colors.primary} opacity="0.6" />

      <rect x="39" y="10" width="3" height="4" rx="1" fill={colors.secondary} opacity="0.6" />
      <rect x="39" y="22" width="3" height="4" rx="1" fill={colors.secondary} opacity="0.6" />
      <rect x="39" y="34" width="3" height="4" rx="1" fill={colors.secondary} opacity="0.6" />

      {/* 状态指示灯 */}
      {animated && (
        <circle cx="24" cy="44" r="2" fill={colors.primary}>
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
};

export default DataStreamIcon;
