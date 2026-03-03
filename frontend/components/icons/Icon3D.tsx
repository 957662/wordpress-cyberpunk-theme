/**
 * Icon3D - 3D 效果图标组件
 *
 * 提供多种 3D 视觉效果的图标组件
 *
 * @example
 * ```tsx
 * <Icon3D type="cube" variant="cyan">
 *   <BoxIcon />
 * </Icon3D>
 * ```
 */

'use client';

import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

export type Icon3DType =
  | 'cube'
  | 'sphere'
  | 'cylinder'
  | 'pyramid'
  | 'extrusion'
  | 'perspective'
  | 'depth'
  | 'layered';

export type Icon3DVariant = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';

export interface Icon3DProps {
  /** 图标内容 */
  children: ReactNode;
  /** 3D 类型 */
  type: Icon3DType;
  /** 颜色变体 */
  variant?: Icon3DVariant;
  /** 深度值 (px) */
  depth?: number;
  /** 透视强度 */
  perspective?: number;
  /** 是否启用交互 */
  interactive?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否自动旋转 */
  autoRotate?: boolean;
  /** 旋转速度 (秒) */
  rotationSpeed?: number;
}

const variantColors3D: Record<Icon3DVariant, { main: string; shadow: string; highlight: string }> = {
  cyan: {
    main: '#00f0ff',
    shadow: '#008899',
    highlight: '#66ffff',
  },
  purple: {
    main: '#9d00ff',
    shadow: '#5500aa',
    highlight: '#cc66ff',
  },
  pink: {
    main: '#ff0080',
    shadow: '#99004d',
    highlight: '#ff66b3',
  },
  yellow: {
    main: '#f0ff00',
    shadow: '#999900',
    highlight: '#ffff99',
  },
  green: {
    main: '#00ff88',
    shadow: '#009955',
    highlight: '#66ffbb',
  },
  orange: {
    main: '#ff6600',
    shadow: '#993d00',
    highlight: '#ffaa66',
  },
};

export const Icon3D: React.FC<Icon3DProps> = ({
  children,
  type,
  variant = 'cyan',
  depth = 8,
  perspective = 1000,
  interactive = false,
  className = '',
  autoRotate = false,
  rotationSpeed = 10,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const colors = variantColors3D[variant];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 40;

    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotation({ x: 0, y: 0 });
  };

  const get3DStyle = (): React.CSSProperties => {
    const baseStyle = {
      '--depth': `${depth}px`,
      '--color-main': colors.main,
      '--color-shadow': colors.shadow,
      '--color-highlight': colors.highlight,
      '--perspective': `${perspective}px`,
    } as React.CSSProperties;

    if (interactive) {
      baseStyle.transform = `perspective(${perspective}px) rotateX(${-rotation.y}deg) rotateY(${rotation.x}deg)`;
    } else if (autoRotate && isHovered) {
      baseStyle.animation = `rotate3d ${rotationSpeed}s linear infinite`;
    }

    return baseStyle;
  };

  const typeClasses: Record<Icon3DType, string> = {
    cube: 'icon-3d-cube',
    sphere: 'icon-3d-sphere',
    cylinder: 'icon-3d-cylinder',
    pyramid: 'icon-3d-pyramid',
    extrusion: 'icon-3d-extrusion',
    perspective: 'icon-3d-perspective',
    depth: 'icon-3d-depth',
    layered: 'icon-3d-layered',
  };

  return (
    <div
      className={cn(
        'icon-3d',
        typeClasses[type],
        `icon-3d-${variant}`,
        interactive && 'icon-3d-interactive',
        autoRotate && 'icon-3d-auto-rotate',
        className
      )}
      style={get3DStyle()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {children}
      {/* 阴影层 */}
      <div className="icon-3d-shadow" aria-hidden="true">
        {children}
      </div>
      {/* 高光层 */}
      <div className="icon-3d-highlight" aria-hidden="true">
        {children}
      </div>
    </div>
  );
};

/**
 * CubeIcon - 立方体效果图标
 */
export const CubeIcon: React.FC<Omit<Icon3DProps, 'type'>> = (props) => {
  return <Icon3D type="cube" {...props} />;
};

/**
 * SphereIcon - 球体效果图标
 */
export const SphereIcon: React.FC<Omit<Icon3DProps, 'type'>> = (props) => {
  return <Icon3D type="sphere" {...props} />;
};

/**
 * ExtrudedIcon - 挤压效果图标
 */
export const ExtrudedIcon: React.FC<Omit<Icon3DProps, 'type'>> = (props) => {
  return <Icon3D type="extrusion" depth={12} {...props} />;
};

/**
 * PerspectiveIcon - 透视效果图标
 */
export const PerspectiveIcon: React.FC<Omit<Icon3DProps, 'type'>> = (props) => {
  return <Icon3D type="perspective" perspective={800} {...props} />;
};

/**
 * DepthIcon - 深度效果图标
 */
export const DepthIcon: React.FC<Omit<Icon3DProps, 'type'>> = (props) => {
  return <Icon3D type="depth" depth={6} {...props} />;
};

/**
 * LayeredIcon - 层叠效果图标
 */
export const LayeredIcon: React.FC<Omit<Icon3DProps, 'type'>> = (props) => {
  return <Icon3D type="layered" depth={4} {...props} />;
};

export default Icon3D;
