/**
 * CyberPress Decoration Components
 *
 * 赛博朋克风格装饰元素组件
 *
 * @example
 * ```tsx
 * import { CornerBracket, DividerLine, LoadingRing } from '@/components/graphics/Decorations';
 *
 * <CornerBracket position="top-left" />
 * <DividerLine />
 * <LoadingRing />
 * ```
 */

import React from 'react';

// 装饰基础属性
export interface DecorationProps {
  /** 额外的 CSS 类名 */
  className?: string;
  /** 自定义颜色 */
  color?: string;
}

// ==================== 角标装饰 ====================

export interface CornerBracketProps extends DecorationProps {
  /** 位置 */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 尺寸 */
  size?: number;
  /** 线条粗细 */
  strokeWidth?: number;
}

/**
 * 角标装饰 - 科技感角落标记
 */
export const CornerBracket: React.FC<CornerBracketProps> = ({
  position = 'top-left',
  size = 100,
  strokeWidth = 2,
  className = '',
  color
}) => {
  const positionClasses: Record<string, string> = {
    'top-left': 'absolute top-0 left-0',
    'top-right': 'absolute top-0 right-0 rotate-90',
    'bottom-left': 'absolute bottom-0 left-0 -rotate-90',
    'bottom-right': 'absolute bottom-0 right-0 rotate-180'
  };

  const positionMap = {
    'top-left': { transform: '' },
    'top-right': { transform: 'rotate(90deg)' },
    'bottom-left': { transform: 'rotate(-90deg)' },
    'bottom-right': { transform: 'rotate(180deg)' }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${positionClasses[position]} ${className}`.trim()}
      style={{ color, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="cornerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
      </defs>

      {/* 外角 */}
      <polyline
        points="10,30 10,10 30,10"
        stroke="url(#cornerGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />

      {/* 内角 */}
      <polyline
        points="20,50 20,20 50,20"
        stroke="currentColor"
        strokeWidth={strokeWidth / 2}
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* 装饰点 */}
      <circle cx="10" cy="10" r="2" fill="#00f0ff" />
      <circle cx="30" cy="10" r="1.5" fill="#9d00ff" />
      <circle cx="10" cy="30" r="1.5" fill="#9d00ff" />
    </svg>
  );
};

// ==================== 分割线装饰 ====================

export interface DividerLineProps extends DecorationProps {
  /** 类型 */
  variant?: 'simple' | 'double' | 'dashed' | 'tech';
  /** 宽度 */
  width?: number | 'full';
  /** 高度 */
  height?: number;
}

/**
 * 分割线装饰 - 各种风格的分割线
 */
export const DividerLine: React.FC<DividerLineProps> = ({
  variant = 'tech',
  width = 'full',
  height = 20,
  className = '',
  color
}) => {
  const widthClass = typeof width === 'number' ? `${width}px` : '100%';

  return (
    <svg
      width={widthClass}
      height={height}
      viewBox="0 0 400 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      style={{ color }}
    >
      <defs>
        <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {variant === 'simple' && (
        <line
          x1="0"
          y1="10"
          x2="400"
          y2="10"
          stroke="url(#dividerGradient)"
          strokeWidth="1"
        />
      )}

      {variant === 'double' && (
        <>
          <line x1="0" y1="7" x2="400" y2="7" stroke="#00f0ff" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="13" x2="400" y2="13" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />
        </>
      )}

      {variant === 'dashed' && (
        <line
          x1="0"
          y1="10"
          x2="400"
          y2="10"
          stroke="url(#dividerGradient)"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
      )}

      {variant === 'tech' && (
        <>
          {/* 主线 */}
          <line
            x1="50"
            y1="10"
            x2="350"
            y2="10"
            stroke="url(#dividerGradient)"
            strokeWidth="1"
          />

          {/* 左端装饰 */}
          <line x1="30" y1="5" x2="30" y2="15" stroke="#00f0ff" strokeWidth="1" />
          <line x1="40" y1="7" x2="40" y2="13" stroke="#00f0ff" strokeWidth="1" opacity="0.7" />
          <circle cx="50" cy="10" r="2" fill="#00f0ff" />

          {/* 右端装饰 */}
          <line x1="370" y1="5" x2="370" y2="15" stroke="#9d00ff" strokeWidth="1" />
          <line x1="360" y1="7" x2="360" y2="13" stroke="#9d00ff" strokeWidth="1" opacity="0.7" />
          <circle cx="350" cy="10" r="2" fill="#9d00ff" />

          {/* 中心装饰 */}
          <polygon
            points="200,7 203,10 200,13 197,10"
            fill="#ff0080"
            opacity="0.6"
          />
        </>
      )}
    </svg>
  );
};

// ==================== 加载动画 ====================

export interface LoadingRingProps extends DecorationProps {
  /** 尺寸 */
  size?: number;
  /** 线条粗细 */
  strokeWidth?: number;
}

/**
 * 加载环 - 赛博朋克风格加载动画
 */
export const LoadingRing: React.FC<LoadingRingProps> = ({
  size = 80,
  strokeWidth = 3,
  className = '',
  color
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin ${className}`.trim()}
      style={{ color }}
    >
      <defs>
        <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#9d00ff" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>
      </defs>

      {/* 背景环 */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.2"
      />

      {/* 进度环 */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="url(#loadingGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="200 251.2"
        transform="rotate(-90 50 50)"
      />

      {/* 内圈 */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="4 4"
      />
    </svg>
  );
};

/**
 * 脉冲加载器
 */
export const PulseLoader: React.FC<LoadingRingProps> = ({
  size = 60,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="20" fill="#00f0ff" opacity="0.8">
        <animate
          attributeName="r"
          values="20;30;20"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;0.2;0.8"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="50" cy="50" r="30" fill="none" stroke="#00f0ff" strokeWidth="2">
        <animate
          attributeName="r"
          values="30;40;30"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0.3s"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0.3s"
        />
      </circle>
    </svg>
  );
};

/**
 * 六边形加载器
 */
export const HexLoader: React.FC<LoadingRingProps> = ({
  size = 80,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin ${className}`.trim()}
    >
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
      </defs>

      {/* 外六边形 */}
      <path
        d="M50 5L88 27.5V72.5L50 95L12 72.5V27.5L50 5Z"
        fill="none"
        stroke="url(#hexGradient)"
        strokeWidth="2"
        opacity="0.3"
      />

      {/* 内六边形 */}
      <path
        d="M50 20L75 35V65L50 80L25 65V35L50 20Z"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="2"
        strokeDasharray="10 5"
      />

      {/* 中心点 */}
      <circle cx="50" cy="50" r="5" fill="#00f0ff" />
    </svg>
  );
};

// ==================== 图案背景 ====================

export interface PatternBackgroundProps extends DecorationProps {
  /** 类型 */
  variant?: 'grid' | 'dots' | 'hexagons' | 'circuit';
  /** 不透明度 */
  opacity?: number;
}

/**
 * 图案背景组件
 */
export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  variant = 'grid',
  opacity = 0.1,
  className = ''
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
        </pattern>

        <pattern id="dotsPattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#00f0ff" />
        </pattern>

        <pattern id="hexPattern" width="20" height="17.32" patternUnits="userSpaceOnUse">
          <path
            d="M10 0L20 5.77V17.32L10 23.09L0 17.32V5.77L10 0Z"
            fill="none"
            stroke="#9d00ff"
            strokeWidth="0.5"
            transform="scale(0.5)"
          />
        </pattern>
      </defs>

      {variant === 'grid' && (
        <rect width="100" height="100" fill="url(#gridPattern)" opacity={opacity} />
      )}

      {variant === 'dots' && (
        <rect width="100" height="100" fill="url(#dotsPattern)" opacity={opacity} />
      )}

      {variant === 'hexagons' && (
        <rect width="100" height="100" fill="url(#hexPattern)" opacity={opacity} />
      )}

      {variant === 'circuit' && (
        <g opacity={opacity}>
          {/* 随机电路线条 */}
          <path d="M0 20 H30 V40 H50" stroke="#00f0ff" strokeWidth="0.5" fill="none" />
          <path d="M70 0 V30 H90 V60" stroke="#9d00ff" strokeWidth="0.5" fill="none" />
          <path d="M20 70 H40 V90 H70" stroke="#ff0080" strokeWidth="0.5" fill="none" />
          <circle cx="30" cy="40" r="2" fill="#00f0ff" />
          <circle cx="70" cy="30" r="2" fill="#9d00ff" />
          <circle cx="40" cy="70" r="2" fill="#ff0080" />
        </g>
      )}
    </svg>
  );
};

// ==================== 边框装饰 ====================

export interface TechBorderProps extends DecorationProps {
  /** 圆角 */
  rounded?: boolean;
  /** 发光效果 */
  glow?: boolean;
}

/**
 * 科技感边框
 */
export const TechBorder: React.FC<TechBorderProps> = ({
  rounded = false,
  glow = false,
  className = ''
}) => {
  const radius = rounded ? 8 : 0;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#9d00ff" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>
        {glow && (
          <filter id="borderGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={glow ? 'url(#borderGlow)' : undefined}>
        {/* 主边框 */}
        <rect
          x="2"
          y="2"
          width="196"
          height="196"
          rx={radius}
          fill="none"
          stroke="url(#borderGradient)"
          strokeWidth="2"
        />

        {/* 角落装饰 */}
        <path
          d={`M${8 + (rounded ? radius : 0)} 2 V 8 H 2`}
          stroke="#00f0ff"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M${192 - (rounded ? radius : 0)} 2 V 8 H 198`}
          stroke="#00f0ff"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M${8 + (rounded ? radius : 0)} 198 V 192 H 2`}
          stroke="#ff0080"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M${192 - (rounded ? radius : 0)} 198 V 192 H 198`}
          stroke="#ff0080"
          strokeWidth="2"
          fill="none"
        />

        {/* 内装饰线 */}
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          rx={radius * 0.8}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </g>
    </svg>
  );
};

// ==================== 其他装饰 ====================

/**
 * 扫描线效果
 */
export const Scanlines: React.FC<DecorationProps> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="scanlinePattern" width="100" height="4" patternUnits="userSpaceOnUse">
            <rect width="100" height="2" fill="rgba(0, 0, 0, 0.1)" />
            <rect y="2" width="100" height="2" fill="transparent" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#scanlinePattern)" />
      </svg>
    </div>
  );
};

/**
 * 故障效果装饰
 */
export const GlitchOverlay: React.FC<DecorationProps> = ({
  className = '',
  color
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="100" height="100" fill="transparent" />

      {/* 随机故障块 */}
      <g opacity="0.1">
        <rect x="10" y="20" width="30" height="2" fill="#00f0ff">
          <animate
            attributeName="x"
            values="10;20;10"
            dur="0.2s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="60" y="45" width="20" height="2" fill="#ff0080">
          <animate
            attributeName="x"
            values="60;55;60"
            dur="0.15s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="25" y="70" width="40" height="2" fill="#9d00ff">
          <animate
            attributeName="x"
            values="25;30;25"
            dur="0.25s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
};

export default {
  CornerBracket,
  DividerLine,
  LoadingRing,
  PulseLoader,
  HexLoader,
  PatternBackground,
  TechBorder,
  Scanlines,
  GlitchOverlay,
};
