/**
 * CyberPress Logo Components
 *
 * 内联 SVG Logo 组件库
 *
 * @example
 * ```tsx
 * import { MainLogo, SquareLogo, FaviconLogo } from '@/components/graphics/Logos';
 *
 * <MainLogo width={200} />
 * <SquareLogo size={64} />
 * ```
 */

import React from 'react';

// Logo 基础属性
export interface LogoProps {
  /** 宽度 */
  width?: number;
  /** 高度 (可选，默认基于宽高比) */
  height?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用动画 */
  animated?: boolean;
  /** 点击事件 */
  onClick?: () => void;
  /** 自定义颜色 */
  color?: string;
}

/**
 * 主 Logo - 横向带文字的完整 Logo
 */
export const MainLogo: React.FC<LogoProps> = ({
  width = 200,
  height,
  className = '',
  animated = false,
  onClick,
  color
}) => {
  const aspectRatio = 200 / 60; // 宽高比
  const actualHeight = height || Math.round(width / aspectRatio);
  const animationClass = animated ? 'animate-glow' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${cursorClass} ${className}`.trim()}
      onClick={onClick}
      style={{ color }}
    >
      {/* 背景 - 赛博网格 */}
      <defs>
        <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 六边形图标 */}
      <g filter="url(#glow)">
        <path
          d="M30 10L50 20V40L30 50L10 40V20L30 10Z"
          fill="none"
          stroke="url(#cyberGradient)"
          strokeWidth="2"
        />
        <path
          d="M30 18L42 25V35L30 42L18 35V25L30 18Z"
          fill="url(#cyberGradient)"
          fillOpacity="0.2"
          stroke="url(#neonGradient)"
          strokeWidth="1.5"
        />
        {/* 电路纹理 */}
        <path
          d="M30 25V35"
          stroke="#00f0ff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M25 30L35 30"
          stroke="#00f0ff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="30" cy="30" r="3" fill="#00f0ff" />
      </g>

      {/* 文字部分 */}
      <g filter="url(#glow)">
        {/* CYBER */}
        <text
          x="60"
          y="32"
          fontFamily="'Orbitron', sans-serif"
          fontSize="20"
          fontWeight="bold"
          fill="url(#neonGradient)"
          letterSpacing="2"
        >
          CYBER
        </text>

        {/* PRESS */}
        <text
          x="60"
          y="50"
          fontFamily="'Orbitron', sans-serif"
          fontSize="14"
          fill="#00f0ff"
          letterSpacing="4"
        >
          PRESS
        </text>

        {/* 装饰线 */}
        <line
          x1="125"
          y1="20"
          x2="125"
          y2="45"
          stroke="url(#cyberGradient)"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* 标语 */}
        <text
          x="132"
          y="35"
          fontFamily="'Inter', sans-serif"
          fontSize="8"
          fill="#ff0080"
          opacity="0.8"
        >
          PLATFORM
        </text>
      </g>
    </svg>
  );
};

/**
 * 方形 Logo - 仅图标部分
 */
export const SquareLogo: React.FC<LogoProps> = ({
  width = 64,
  className = '',
  animated = false,
  onClick,
  color
}) => {
  const animationClass = animated ? 'animate-glow' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${cursorClass} ${className}`.trim()}
      onClick={onClick}
      style={{ color }}
    >
      <defs>
        <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0.9" />
        </linearGradient>
        <filter id="squareGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 外层六边形 */}
      <g filter="url(#squareGlow)">
        <path
          d="M50 5L85 25V75L50 95L15 75V25L50 5Z"
          fill="none"
          stroke="url(#squareGradient)"
          strokeWidth="3"
        />

        {/* 内层六边形 */}
        <path
          d="M50 20L73 33V67L50 80L27 67V33L50 20Z"
          fill="url(#squareGradient)"
          fillOpacity="0.15"
          stroke="url(#squareGradient)"
          strokeWidth="2"
        />

        {/* 中心元素 */}
        <circle cx="50" cy="50" r="15" fill="#00f0ff" fillOpacity="0.2" />
        <circle cx="50" cy="50" r="8" fill="#00f0ff" />

        {/* 电路线条 */}
        <path
          d="M50 20V35"
          stroke="#00f0ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M50 65V80"
          stroke="#9d00ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M27 33H40"
          stroke="#00f0ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M60 67H73"
          stroke="#ff0080"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* 装饰点 */}
        <circle cx="35" cy="25" r="2" fill="#00f0ff" />
        <circle cx="65" cy="25" r="2" fill="#9d00ff" />
        <circle cx="35" cy="75" r="2" fill="#9d00ff" />
        <circle cx="65" cy="75" r="2" fill="#ff0080" />
      </g>
    </svg>
  );
};

/**
 * Favicon Logo - 小图标版本
 */
export const FaviconLogo: React.FC<LogoProps> = ({
  width = 32,
  className = '',
  animated = false,
  onClick,
  color
}) => {
  const animationClass = animated ? 'animate-glow' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${cursorClass} ${className}`.trim()}
      onClick={onClick}
      style={{ color }}
    >
      <defs>
        <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
      </defs>

      {/* 简化的六边形 */}
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        fill="url(#faviconGradient)"
        fillOpacity="0.2"
        stroke="url(#faviconGradient)"
        strokeWidth="2"
      />

      {/* 中心点 */}
      <circle cx="16" cy="16" r="4" fill="#00f0ff" />

      {/* 内环 */}
      <circle
        cx="16"
        cy="16"
        r="8"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  );
};

/**
 * 极简 Logo - 单色版本
 */
export const MinimalLogo: React.FC<LogoProps> = ({
  width = 100,
  className = '',
  onClick,
  color = '#00f0ff'
}) => {
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${cursorClass} ${className}`.trim()}
      onClick={onClick}
      style={{ color }}
    >
      {/* 单色六边形 */}
      <path
        d="M50 5L85 25V75L50 95L15 75V25L50 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* 内部几何图案 */}
      <path
        d="M50 25L70 36.54V63.46L50 75L30 63.46V36.54L50 25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* 中心 */}
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  );
};

/**
 * 文字 Logo - 仅文字部分
 */
export const TextLogo: React.FC<Omit<LogoProps, 'width'> & { fontSize?: number }> = ({
  fontSize = 24,
  className = '',
  animated = false,
  onClick,
  color
}) => {
  const animationClass = animated ? 'animate-glow' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 200 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${cursorClass} ${className}`.trim()}
      onClick={onClick}
      style={{ color }}
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
      </defs>

      <text
        x="0"
        y="35"
        fontFamily="'Orbitron', sans-serif"
        fontSize={fontSize}
        fontWeight="bold"
        fill="url(#textGradient)"
        letterSpacing="3"
      >
        CYBER
      </text>

      <text
        x="105"
        y="35"
        fontFamily="'Orbitron', sans-serif"
        fontSize={fontSize * 0.7}
        fill="#00f0ff"
        letterSpacing="5"
      >
        PRESS
      </text>
    </svg>
  );
};

/**
 * 水印 Logo - 半透明版本
 */
export const WatermarkLogo: React.FC<LogoProps> = ({
  width = 200,
  className = '',
  onClick
}) => {
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <svg
      width={width}
      height={width * 0.3}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`opacity-20 ${cursorClass} ${className}`.trim()}
      onClick={onClick}
    >
      <defs>
        <linearGradient id="watermarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 六边形 */}
      <path
        d="M30 10L50 20V40L30 50L10 40V20L30 10Z"
        fill="url(#watermarkGradient)"
        stroke="url(#watermarkGradient)"
        strokeWidth="1"
      />

      {/* 文字 */}
      <text
        x="60"
        y="35"
        fontFamily="'Orbitron', sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="url(#watermarkGradient)"
        letterSpacing="2"
      >
        CYBERPRESS
      </text>
    </svg>
  );
};

/**
 * 动画 Logo - 带脉冲效果
 */
export const AnimatedLogo: React.FC<LogoProps> = ({
  width = 100,
  className = '',
  onClick
}) => {
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${cursorClass} ${className}`.trim()}
      onClick={onClick}
    >
      <defs>
        <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff">
            <animate
              attributeName="stop-color"
              values="#00f0ff;#9d00ff;#ff0080;#00f0ff"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#9d00ff">
            <animate
              attributeName="stop-color"
              values="#9d00ff;#ff0080;#00f0ff;#9d00ff"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>

      {/* 脉冲外圈 */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="url(#animatedGradient)"
        strokeWidth="1"
        opacity="0.5"
      >
        <animate
          attributeName="r"
          values="40;45;40"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* 主六边形 */}
      <path
        d="M50 10L82 28V72L50 90L18 72V28L50 10Z"
        fill="url(#animatedGradient)"
        fillOpacity="0.15"
        stroke="url(#animatedGradient)"
        strokeWidth="2"
      />

      {/* 内部图案 */}
      <path
        d="M50 25L68 35.5V64.5L50 75L32 64.5V35.5L50 25Z"
        fill="none"
        stroke="url(#animatedGradient)"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* 中心点 */}
      <circle cx="50" cy="50" r="5" fill="url(#animatedGradient)">
        <animate
          attributeName="r"
          values="5;7;5"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default {
  MainLogo,
  SquareLogo,
  FaviconLogo,
  MinimalLogo,
  TextLogo,
  WatermarkLogo,
  AnimatedLogo,
};
