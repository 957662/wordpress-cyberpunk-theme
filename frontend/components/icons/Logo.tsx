/**
 * CyberPress Logo Component
 * 赛博朋克风格 Logo，使用内联 SVG
 *
 * Usage:
 * <Logo size={48} className="text-cyber-cyan" />
 * <Logo variant="icon" size={32} />
 * <Logo variant="full" size={200} showText />
 */

import React from 'react';

interface LogoProps {
  size?: number;
  variant?: 'icon' | 'full';
  className?: string;
  showText?: boolean;
  textColor?: string;
}

/**
 * 赛博朋克风格 Logo
 * 使用几何图形和发光效果
 */
export const Logo: React.FC<LogoProps> = ({
  size = 48,
  variant = 'icon',
  className = '',
  showText = false,
  textColor = '#00f0ff'
}) => {
  const iconOnly = variant === 'icon' && !showText;

  // Logo 图标部分 - 六边形 + C 字母
  const LogoIcon = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color: textColor }}
    >
      <defs>
        <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 外圈六边形 */}
      <path
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
        stroke="url(#cyberGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
      />

      {/* 内圈六边形 */}
      <path
        d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* C 字母 */}
      <path
        d="M62 35 C58 32 52 32 48 35 C42 39 42 46 48 50 C54 54 54 61 48 65 C42 68 36 64 34 60"
        stroke="url(#cyberGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />

      {/* 装饰点 */}
      <circle cx="50" cy="10" r="2" fill="#00f0ff" filter="url(#glow)" />
      <circle cx="85" cy="30" r="2" fill="#9d00ff" filter="url(#glow)" />
      <circle cx="85" cy="70" r="2" fill="#ff0080" filter="url(#glow)" />
      <circle cx="50" cy="90" r="2" fill="#00f0ff" filter="url(#glow)" />
      <circle cx="15" cy="70" r="2" fill="#9d00ff" filter="url(#glow)" />
      <circle cx="15" cy="30" r="2" fill="#ff0080" filter="url(#glow)" />
    </svg>
  );

  // 带文字的完整 Logo
  if (variant === 'full' || showText) {
    const textHeight = Math.max(size * 0.3, 20);
    const iconSize = size - textHeight;
    const totalWidth = iconSize + (showText ? size * 1.5 : 0);

    return (
      <div className={`flex items-center gap-3 ${className}`} style={{ height: size }}>
        <LogoIcon />
        <span
          className="font-display font-bold tracking-wider"
          style={{
            fontSize: textHeight * 0.6,
            color: textColor,
            textShadow: `0 0 10px ${textColor}40, 0 0 20px ${textColor}20`
          }}
        >
          CYBERPRESS
        </span>
      </div>
    );
  }

  return <LogoIcon />;
};

export default Logo;
