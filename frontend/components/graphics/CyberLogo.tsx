import React from 'react';

/**
 * CyberPress 主 Logo 组件 - 赛博朋克风格
 *
 * 特点：
 * - 霓虹发光效果
 * - 多种尺寸支持
 * - 渐变色彩
 * - 响应式设计
 *
 * @example
 * ```tsx
 * <CyberLogo size={200} variant="gradient" />
 * <CyberLogo size={100} variant="cyan" animated={true} />
 * ```
 */

interface CyberLogoProps {
  size?: number;
  variant?: 'gradient' | 'cyan' | 'purple' | 'pink' | 'monochrome';
  className?: string;
  animated?: boolean;
  showText?: boolean;
  text?: string;
}

const colorSchemes = {
  cyan: {
    primary: '#00f0ff',
    secondary: '#00a0ff',
    accent: '#0080aa',
  },
  purple: {
    primary: '#9d00ff',
    secondary: '#bd66ff',
    accent: '#6a00aa',
  },
  pink: {
    primary: '#ff0080',
    secondary: '#ff66b3',
    accent: '#aa0056',
  },
  gradient: {
    primary: '#00f0ff',
    secondary: '#9d00ff',
    accent: '#ff0080',
  },
  monochrome: {
    primary: '#e0e0e0',
    secondary: '#a0a0b0',
    accent: '#606070',
  },
};

export const CyberLogo: React.FC<CyberLogoProps> = ({
  size = 200,
  variant = 'gradient',
  className = '',
  animated = false,
  showText = true,
  text = 'CYBERPRESS',
}) => {
  const colors = colorSchemes[variant];
  const animationClass = animated ? 'animate-pulse' : '';
  const logoSize = size;
  const iconSize = size * 0.4;
  const textOffset = size * 0.45;

  return (
    <svg
      width={logoSize}
      height={logoSize * (showText ? 0.6 : 1)}
      viewBox={`0 0 ${logoSize} ${showText ? logoSize * 0.6 : logoSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        {/* 主渐变 */}
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="50%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>

        {/* 霓虹发光滤镜 */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 扫描线图案 */}
        <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M0,2 L4,2" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        </pattern>
      </defs>

      {/* 背景圆环 */}
      <circle
        cx={logoSize * 0.25}
        cy={logoSize * 0.25}
        r={iconSize * 0.5}
        stroke={colors.primary}
        strokeWidth="2"
        opacity="0.3"
        fill="none"
      />

      <circle
        cx={logoSize * 0.25}
        cy={logoSize * 0.25}
        r={iconSize * 0.4}
        stroke={colors.secondary}
        strokeWidth="1"
        opacity="0.5"
        fill="none"
      />

      {/* 核心六边形 */}
      <g filter="url(#neonGlow)">
        <path
          d={`M${logoSize * 0.25},${logoSize * 0.25 - iconSize * 0.3}
              L${logoSize * 0.25 + iconSize * 0.26},${logoSize * 0.25 - iconSize * 0.15}
              L${logoSize * 0.25 + iconSize * 0.26},${logoSize * 0.25 + iconSize * 0.15}
              L${logoSize * 0.25},${logoSize * 0.25 + iconSize * 0.3}
              L${logoSize * 0.25 - iconSize * 0.26},${logoSize * 0.25 + iconSize * 0.15}
              L${logoSize * 0.25 - iconSize * 0.26},${logoSize * 0.25 - iconSize * 0.15} Z`}
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
        />

        {/* 内部核心 */}
        <circle
          cx={logoSize * 0.25}
          cy={logoSize * 0.25}
          r={iconSize * 0.15}
          fill={variant === 'gradient' ? 'url(#logoGradient)' : colors.primary}
          opacity="0.8"
        />
      </g>

      {/* 装饰线条 */}
      <line
        x1={logoSize * 0.25 - iconSize * 0.5}
        y1={logoSize * 0.25}
        x2={logoSize * 0.25 - iconSize * 0.35}
        y2={logoSize * 0.25}
        stroke={colors.primary}
        strokeWidth="2"
        opacity="0.6"
      />

      <line
        x1={logoSize * 0.25 + iconSize * 0.35}
        y1={logoSize * 0.25}
        x2={logoSize * 0.25 + iconSize * 0.5}
        y2={logoSize * 0.25}
        stroke={colors.primary}
        strokeWidth="2"
        opacity="0.6"
      />

      <line
        x1={logoSize * 0.25}
        y1={logoSize * 0.25 - iconSize * 0.5}
        x2={logoSize * 0.25}
        y2={logoSize * 0.25 - iconSize * 0.35}
        stroke={colors.secondary}
        strokeWidth="2"
        opacity="0.6"
      />

      <line
        x1={logoSize * 0.25}
        y1={logoSize * 0.25 + iconSize * 0.35}
        x2={logoSize * 0.25}
        y2={logoSize * 0.25 + iconSize * 0.5}
        stroke={colors.secondary}
        strokeWidth="2"
        opacity="0.6"
      />

      {/* 科技装饰点 */}
      <circle
        cx={logoSize * 0.15}
        cy={logoSize * 0.25}
        r="2"
        fill={colors.accent}
        opacity="0.8"
      />
      <circle
        cx={logoSize * 0.35}
        cy={logoSize * 0.25}
        r="2"
        fill={colors.accent}
        opacity="0.8"
      />

      {/* 文字部分 */}
      {showText && (
        <text
          x={logoSize * 0.5}
          y={logoSize * 0.28}
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize={logoSize * 0.12}
          fill="url(#logoGradient)"
          filter="url(#neonGlow)"
          letterSpacing="4"
        >
          {text}
        </text>
      )}

      {/* 扫描线覆盖 */}
      <rect
        x="0"
        y="0"
        width={logoSize}
        height={showText ? logoSize * 0.6 : logoSize}
        fill="url(#scanlines)"
        opacity="0.3"
      />
    </svg>
  );
};

export default CyberLogo;
