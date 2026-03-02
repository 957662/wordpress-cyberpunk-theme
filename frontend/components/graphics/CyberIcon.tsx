import React from 'react';

/**
 * 赛博主题图标 - 赛博朋克风格核心图标
 *
 * 特点：
 * - 六边形核心设计
 * - 霓虹发光效果
 * - 多种颜色变体
 * - 动画支持
 *
 * @example
 * ```tsx
 * <CyberIcon size={48} variant="cyan" />
 * <CyberIcon size={64} variant="gradient" animated={true} />
 * ```
 */

interface CyberIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'gradient';
  className?: string;
  animated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
  gradient: 'gradient',
};

const intensityMap = {
  low: { blur: 1, opacity: 0.4 },
  medium: { blur: 2, opacity: 0.6 },
  high: { blur: 3, opacity: 0.8 },
};

export const CyberIcon: React.FC<CyberIconProps> = ({
  size = 48,
  variant = 'cyan',
  className = '',
  animated = false,
  intensity = 'medium',
}) => {
  const color = variant === 'gradient' ? '#00f0ff' : colorMap[variant];
  const intensitySettings = intensityMap[intensity];
  const animationClass = animated ? 'animate-pulse' : '';

  const createGlowFilter = (id: string, color: string) => (
    <>
      <filter id={id} x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation={intensitySettings.blur} result="coloredBlur" />
        <feFlood floodColor={color} floodOpacity={intensitySettings.opacity} />
        <feComposite in2="coloredBlur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </>
  );

  const filterId = `cyber-glow-${variant}-${intensity}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        {/* 渐变定义 */}
        <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#9d00ff" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>

        {/* 霓虹发光滤镜 */}
        {createGlowFilter(filterId, variant === 'gradient' ? '#00f0ff' : color)}

        {/* 扫描线图案 */}
        <pattern id="cyberScanlines" patternUnits="userSpaceOnUse" width="2" height="2">
          <line x1="0" y1="0" x2="2" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        </pattern>
      </defs>

      {/* 外圈六边形 */}
      <path
        d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z"
        stroke={variant === 'gradient' ? 'url(#cyberGradient)' : color}
        strokeWidth="1.5"
        fill="none"
        filter={`url(#${filterId})`}
        opacity="0.8"
      />

      {/* 中圈六边形 */}
      <path
        d="M24 10 L36 17 L36 31 L24 38 L12 31 L12 17 Z"
        stroke={variant === 'gradient' ? 'url(#cyberGradient)' : color}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />

      {/* 内圈六边形 */}
      <path
        d="M24 16 L30 19 L30 29 L24 32 L18 29 L18 19 Z"
        fill={variant === 'gradient' ? 'url(#cyberGradient)' : color}
        opacity="0.3"
      />

      {/* 核心圆点 */}
      <circle
        cx="24"
        cy="24"
        r="6"
        fill={variant === 'gradient' ? 'url(#cyberGradient)' : color}
        filter={`url(#${filterId})`}
      />

      {/* 核心亮点 */}
      <circle
        cx="24"
        cy="24"
        r="2"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* 连接线 */}
      <line x1="24" y1="4" x2="24" y2="10" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="42" y1="14" x2="36" y2="17" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="42" y1="34" x2="36" y2="31" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="24" y1="44" x2="24" y2="38" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="6" y1="34" x2="12" y2="31" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="6" y1="14" x2="12" y2="17" stroke={color} strokeWidth="1" opacity="0.4" />

      {/* 装饰点 */}
      <circle cx="24" cy="7" r="1" fill={color} opacity="0.6" />
      <circle cx="39" cy="15.5" r="1" fill={color} opacity="0.6" />
      <circle cx="39" cy="32.5" r="1" fill={color} opacity="0.6" />
      <circle cx="24" cy="41" r="1" fill={color} opacity="0.6" />
      <circle cx="9" cy="32.5" r="1" fill={color} opacity="0.6" />
      <circle cx="9" cy="15.5" r="1" fill={color} opacity="0.6" />

      {/* 数据流效果 */}
      {animated && (
        <>
          <circle cx="24" cy="24" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.3">
            <animate
              attributeName="r"
              values="8;16;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* 扫描线覆盖 */}
      <rect
        x="0"
        y="0"
        width="48"
        height="48"
        fill="url(#cyberScanlines)"
        opacity="0.2"
      />
    </svg>
  );
};

export default CyberIcon;
