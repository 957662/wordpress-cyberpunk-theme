/**
 * CyberPress 3D Icons
 *
 * 带透视感和立体效果的图标组件
 *
 * @example
 * ```tsx
 * import { Cube3DIcon, Pyramid3DIcon, Sphere3DIcon } from '@/components/graphics/Icon3D';
 *
 * <Cube3DIcon size={48} animated />
 * <Pyramid3DIcon size={48} color="#00f0ff" />
 * <Sphere3DIcon size={48} />
 * ```
 */

import React from 'react';

export interface Icon3DProps {
  /** 图标尺寸 */
  size?: number;
  /** 自定义颜色 */
  color?: string;
  /** 是否使用动画 */
  animated?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}

// ==================== 立方体 ====================

/**
 * 3D 立方体图标
 */
export const Cube3DIcon: React.FC<Icon3DProps> = ({
  size = 48,
  color,
  animated = false,
  className = '',
  onClick
}) => {
  const defaultColor = color || '#00f0ff';
  const secondaryColor = color ? adjustColor(color, -20) : '#9d00ff';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-spin-slow' : ''} ${className}`.trim()}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <defs>
        <linearGradient id="cubeFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={defaultColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={defaultColor} stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="cubeSide" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g>
        {/* 顶面 */}
        <path
          d="M8 14L24 4L40 14V14L24 24L8 14V14Z"
          fill={defaultColor}
          fillOpacity="0.3"
          stroke={defaultColor}
          strokeWidth="1.5"
        />

        {/* 左侧面 */}
        <path
          d="M8 14V34L24 44V24L8 14Z"
          fill="url(#cubeFront)"
          stroke={defaultColor}
          strokeWidth="1.5"
        />

        {/* 右侧面 */}
        <path
          d="M40 14V34L24 44V24L40 14Z"
          fill="url(#cubeSide)"
          stroke={secondaryColor}
          strokeWidth="1.5"
        />
      </g>

      {animated && (
        <g opacity="0.3">
          {/* 发光效果 */}
          <circle cx="24" cy="24" r="20" fill={defaultColor}>
            <animate
              attributeName="r"
              values="20;22;20"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}
    </svg>
  );
};

// ==================== 金字塔 ====================

/**
 * 3D 金字塔图标
 */
export const Pyramid3DIcon: React.FC<Icon3DProps> = ({
  size = 48,
  color,
  animated = false,
  className = '',
  onClick
}) => {
  const defaultColor = color || '#ff0080';
  const secondaryColor = color ? adjustColor(color, -30) : '#9d00ff';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-pulse-glow' : ''} ${className}`.trim()}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* 底面 */}
      <path
        d="M4 38L24 44L44 38"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* 左侧面 */}
      <path
        d="M4 38L24 8L24 44L4 38Z"
        fill={defaultColor}
        fillOpacity="0.25"
        stroke={defaultColor}
        strokeWidth="1.5"
      />

      {/* 右侧面 */}
      <path
        d="M44 38L24 8L24 44L44 38Z"
        fill={secondaryColor}
        fillOpacity="0.2"
        stroke={secondaryColor}
        strokeWidth="1.5"
      />

      {/* 顶点高光 */}
      <circle cx="24" cy="8" r="2" fill={defaultColor}>
        {animated && (
          <animate
            attributeName="r"
            values="2;3;2"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
};

// ==================== 球体 ====================

/**
 * 3D 球体图标
 */
export const Sphere3DIcon: React.FC<Icon3DProps> = ({
  size = 48,
  color,
  animated = false,
  className = '',
  onClick
}) => {
  const defaultColor = color || '#00ff88';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <defs>
        <radialGradient id="sphereGradient">
          <stop offset="0%" stopColor={defaultColor} stopOpacity="0.9" />
          <stop offset="50%" stopColor={defaultColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={defaultColor} stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* 主球体 */}
      <circle cx="24" cy="24" r="18" fill="url(#sphereGradient)" />

      {/* 经线 */}
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="6"
        fill="none"
        stroke={defaultColor}
        strokeWidth="0.5"
        opacity="0.6"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="6"
        fill="none"
        stroke={defaultColor}
        strokeWidth="0.5"
        opacity="0.4"
        transform="rotate(60 24 24)"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="6"
        fill="none"
        stroke={defaultColor}
        strokeWidth="0.5"
        opacity="0.4"
        transform="rotate(-60 24 24)"
      />

      {/* 纬线 */}
      <ellipse
        cx="24"
        cy="24"
        rx="9"
        ry="18"
        fill="none"
        stroke={defaultColor}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* 高光 */}
      <ellipse
        cx="18"
        cy="18"
        rx="6"
        ry="4"
        fill={defaultColor}
        opacity="0.4"
      />

      {animated && (
        <circle cx="24" cy="24" r="20" fill="none" stroke={defaultColor} strokeWidth="1" opacity="0.3">
          <animate
            attributeName="r"
            values="18;22;18"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
};

// ==================== 圆柱体 ====================

/**
 * 3D 圆柱体图标
 */
export const Cylinder3DIcon: React.FC<Icon3DProps> = ({
  size = 48,
  color,
  animated = false,
  className = '',
  onClick
}) => {
  const defaultColor = color || '#f0ff00';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <defs>
        <linearGradient id="cylinderSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={defaultColor} stopOpacity="0.3" />
          <stop offset="50%" stopColor={defaultColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={defaultColor} stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="cylinderTop">
          <stop offset="0%" stopColor={defaultColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={defaultColor} stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* 顶面 */}
      <ellipse
        cx="24"
        cy="10"
        rx="14"
        ry="6"
        fill="url(#cylinderTop)"
        stroke={defaultColor}
        strokeWidth="1"
      />

      {/* 侧面 */}
      <path
        d="M10 10V38C10 41.31 16.27 44 24 44C31.73 44 38 41.31 38 38V10"
        fill="url(#cylinderSide)"
        stroke={defaultColor}
        strokeWidth="1"
      />

      {/* 底面边缘 */}
      <ellipse
        cx="24"
        cy="38"
        rx="14"
        ry="6"
        fill="none"
        stroke={defaultColor}
        strokeWidth="1"
        opacity="0.5"
      />

      {animated && (
        <ellipse
          cx="24"
          cy="10"
          rx="14"
          ry="6"
          fill="none"
          stroke={defaultColor}
          strokeWidth="2"
          opacity="0.5"
        >
          <animate
            attributeName="ry"
            values="6;7;6"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}
    </svg>
  );
};

// ==================== 圆环 ====================

/**
 * 3D 圆环图标
 */
export const Torus3DIcon: React.FC<Icon3DProps> = ({
  size = 48,
  color,
  animated = false,
  className = '',
  onClick
}) => {
  const defaultColor = color || '#00f0ff';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-spin-slow' : ''} ${className}`.trim()}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <defs>
        <linearGradient id="torusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={defaultColor} stopOpacity="0.8" />
          <stop offset="50%" stopColor={defaultColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={defaultColor} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* 外环前半部分 */}
      <path
        d="M24 8C15.16 8 8 12.48 8 18V30C8 35.52 15.16 40 24 40"
        fill="none"
        stroke="url(#torusGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 内环前半部分 */}
      <path
        d="M24 16C17.37 16 12 19.13 12 22V26C12 28.87 17.37 32 24 32"
        fill="none"
        stroke={defaultColor}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* 外环后半部分（虚线表示） */}
      <path
        d="M40 18V30C40 35.52 32.84 40 24 40"
        fill="none"
        stroke={defaultColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="4 4"
        opacity="0.4"
      />

      {/* 内环后半部分 */}
      <path
        d="M36 22V26C36 28.87 30.63 32 24 32"
        fill="none"
        stroke={defaultColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 2"
        opacity="0.3"
      />
    </svg>
  );
};

// ==================== 锥体 ====================

/**
 * 3D 锥体图标
 */
export const Cone3DIcon: React.FC<Icon3DProps> = ({
  size = 48,
  color,
  animated = false,
  className = '',
  onClick
}) => {
  const defaultColor = color || '#ff0080';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <defs>
        <linearGradient id="coneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={defaultColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={defaultColor} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* 侧面 */}
      <path
        d="M24 6L8 42H40L24 6Z"
        fill="url(#coneGradient)"
        stroke={defaultColor}
        strokeWidth="1.5"
      />

      {/* 底面椭圆 */}
      <ellipse
        cx="24"
        cy="42"
        rx="16"
        ry="4"
        fill={defaultColor}
        fillOpacity="0.3"
        stroke={defaultColor}
        strokeWidth="1"
      />

      {/* 高光线 */}
      <path
        d="M24 6L20 38"
        stroke={defaultColor}
        strokeWidth="1"
        opacity="0.6"
      />

      {animated && (
        <circle cx="24" cy="6" r="2" fill={defaultColor}>
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
};

// ==================== 工具函数 ====================

/**
 * 调整颜色亮度
 */
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default {
  Cube3DIcon,
  Pyramid3DIcon,
  Sphere3DIcon,
  Cylinder3DIcon,
  Torus3DIcon,
  Cone3DIcon,
};
