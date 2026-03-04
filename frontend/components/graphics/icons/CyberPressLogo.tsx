/**
 * CyberPress 主 Logo - 完整的 SVG Logo 组件
 *
 * 多尺寸、多变体的赛博朋克风格 Logo
 *
 * @example
 * <CyberPressLogo variant="full" size="large" animated />
 * <CyberPressLogo variant="icon" size="small" />
 */

'use client';

import React from 'react';

export type LogoVariant = 'full' | 'icon' | 'minimal' | 'text';
export type LogoSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'hero';
export type LogoColor = 'gradient' | 'cyan' | 'purple' | 'pink' | 'white';

interface CyberPressLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  color?: LogoColor;
  animated?: boolean;
  showTagline?: boolean;
  className?: string;
}

const sizeMap: Record<LogoSize, number> = {
  tiny: 32,
  small: 48,
  medium: 64,
  large: 128,
  xlarge: 256,
  hero: 512,
};

const colorSchemes = {
  gradient: {
    primary: '#00f0ff',
    secondary: '#9d00ff',
    accent: '#ff0080',
  },
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
  white: {
    primary: '#ffffff',
    secondary: '#e0e0e0',
    accent: '#a0a0a0',
  },
};

export const CyberPressLogo: React.FC<CyberPressLogoProps> = ({
  variant = 'full',
  size = 'medium',
  color = 'gradient',
  animated = false,
  showTagline = false,
  className = '',
}) => {
  const colors = colorSchemes[color];
  const logoSize = sizeMap[size];
  const animationClass = animated ? 'animate-pulse' : '';

  // 图标版本 - 仅六边形图标
  if (variant === 'icon') {
    return (
      <svg
        width={logoSize}
        height={logoSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animationClass} ${className}`}
      >
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="1" />
          </linearGradient>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 外层六边形 */}
        <path
          d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18 Z"
          stroke="url(#iconGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#neonGlow)"
        />

        {/* 内层六边形 */}
        <path
          d="M32 14 L48 24 L48 40 L32 50 L16 40 L16 24 Z"
          stroke={colors.secondary}
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* 核心圆点 */}
        <circle cx="32" cy="32" r="6" fill={colors.primary} filter="url(#neonGlow)" />
        <circle cx="32" cy="32" r="3" fill={colors.accent} opacity="0.8" />

        {/* 科技线条 */}
        <line x1="32" y1="8" x2="32" y2="14" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
        <line x1="32" y1="50" x2="32" y2="56" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
        <line x1="8" y1="32" x2="14" y2="32" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="32" x2="56" y2="32" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />

        {/* 装饰点 */}
        <circle cx="32" cy="8" r="1.5" fill={colors.accent} />
        <circle cx="32" cy="56" r="1.5" fill={colors.accent} />
        <circle cx="8" cy="32" r="1.5" fill={colors.accent} />
        <circle cx="56" cy="32" r="1.5" fill={colors.accent} />
      </svg>
    );
  }

  // 极简版本 - 单色线条
  if (variant === 'minimal') {
    return (
      <svg
        width={logoSize}
        height={logoSize * 0.6}
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className}`}
      >
        {/* 简化的六边形 */}
        <path
          d="M40 60 L60 48 L60 72 Z"
          stroke={colors.primary}
          strokeWidth="2"
          fill="none"
        />

        {/* 简化的文字 */}
        <text
          x="80"
          y="70"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontSize="32"
          fill={colors.primary}
          letterSpacing="2"
        >
          CYBERPRESS
        </text>
      </svg>
    );
  }

  // 文字版本 - 仅文字
  if (variant === 'text') {
    const fontSize = logoSize * 0.4;
    return (
      <svg
        width={logoSize * 2}
        height={logoSize * 0.6}
        viewBox="0 0 400 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animationClass} ${className}`}
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>
          <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text
          x="200"
          y="75"
          fontFamily="Orbitron, Arial, sans-serif"
          fontWeight="bold"
          fontSize={fontSize}
          fill="url(#textGradient)"
          filter="url(#textGlow)"
          textAnchor="middle"
          letterSpacing="4"
        >
          CYBERPRESS
        </text>

        {showTagline && (
          <text
            x="200"
            y="105"
            fontFamily="Inter, Arial, sans-serif"
            fontWeight="400"
            fontSize={fontSize * 0.25}
            fill={colors.secondary}
            textAnchor="middle"
            letterSpacing="2"
            opacity="0.7"
          >
            NEXT-GEN BLOGGING PLATFORM
          </text>
        )}
      </svg>
    );
  }

  // 完整版本 - 图标 + 文字
  return (
    <svg
      width={logoSize * 2.5}
      height={logoSize * 0.8}
      viewBox="0 0 500 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <linearGradient id="fullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
          <stop offset="50%" stopColor={colors.secondary} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="textGradientFull" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <filter id="neonGlowFull" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M0,2 L4,2" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        </pattern>
      </defs>

      {/* 图标部分 */}
      <g transform="translate(80, 80)">
        {/* 外层六边形 */}
        <path
          d="M0 -48 L41.57 -24 L41.57 24 L0 48 L-41.57 24 L-41.57 -24 Z"
          stroke="url(#fullGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#neonGlowFull)"
        />

        {/* 内层六边形 */}
        <path
          d="M0 -32 L27.71 -16 L27.71 16 L0 32 L-27.71 16 L-27.71 -16 Z"
          stroke={colors.secondary}
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* 核心圆点 */}
        <circle cx="0" cy="0" r="10" fill={colors.primary} filter="url(#neonGlowFull)" />
        <circle cx="0" cy="0" r="5" fill={colors.accent} opacity="0.8" />

        {/* 科技线条 */}
        <line x1="0" y1="-48" x2="0" y2="-32" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="32" x2="0" y2="48" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
        <line x1="-41.57" y1="0" x2="-27.71" y2="0" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />
        <line x1="27.71" y1="0" x2="41.57" y2="0" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />

        {/* 装饰点 */}
        <circle cx="0" cy="-48" r="2" fill={colors.accent} />
        <circle cx="0" cy="48" r="2" fill={colors.accent} />
        <circle cx="-41.57" cy="0" r="2" fill={colors.accent} />
        <circle cx="41.57" cy="0" r="2" fill={colors.accent} />
      </g>

      {/* 文字部分 */}
      <text
        x="290"
        y="85"
        fontFamily="Orbitron, Arial, sans-serif"
        fontWeight="bold"
        fontSize="56"
        fill="url(#textGradientFull)"
        filter="url(#neonGlowFull)"
        letterSpacing="4"
      >
        CYBERPRESS
      </text>

      {showTagline && (
        <text
          x="290"
          y="115"
          fontFamily="Inter, Arial, sans-serif"
          fontWeight="400"
          fontSize="14"
          fill={colors.secondary}
          letterSpacing="2"
          opacity="0.7"
        >
          NEXT-GEN BLOGGING PLATFORM
        </text>
      )}

      {/* 扫描线覆盖 */}
      <rect
        x="0"
        y="0"
        width="500"
        height="160"
        fill="url(#scanlines)"
        opacity="0.2"
      />
    </svg>
  );
};

export default CyberPressLogo;
