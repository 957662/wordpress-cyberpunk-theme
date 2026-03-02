/**
 * CyberPress Responsive Icons
 *
 * 响应式图标组件，根据屏幕尺寸和容器大小自动调整
 *
 * @example
 * ```tsx
 * <ResponsiveIcon name="cpu" baseSize={32} />
 * <AdaptiveIcon name="bot" density="comfortable" />
 * <FluidIcon name="chip" minSize={16} maxSize={64} />
 * ```
 */

import React, { useRef, useState, useEffect } from 'react';
import { DynamicIcon } from './IconFactory';

// ==================== 类型定义 ====================

export type ResponsiveSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface ResponsiveIconProps {
  /** 图标名称 */
  name: string;
  /** 基础尺寸（移动端） */
  baseSize?: number;
  /** 尺寸断点 */
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  /** 颜色 */
  color?: string;
  /** 额外的类名 */
  className?: string;
}

export interface AdaptiveIconProps {
  /** 图标名称 */
  name: string;
  /** 密度级别 */
  density?: Density;
  /** 容器宽度 */
  containerWidth?: number;
  /** 颜色 */
  color?: string;
  /** 额外的类名 */
  className?: string;
}

export interface FluidIconProps {
  /** 图标名称 */
  name: string;
  /** 最小尺寸 */
  minSize?: number;
  /** 最大尺寸 */
  maxSize?: number;
  /** 容器比例 */
  containerRatio?: number;
  /** 颜色 */
  color?: string;
  /** 额外的类名 */
  className?: string;
}

// ==================== 工具函数 ====================

const getBreakpointSize = (
  baseSize: number,
  breakpoints: ResponsiveIconProps['breakpoints']
): Record<ResponsiveSize, number> => {
  return {
    xs: baseSize,
    sm: breakpoints?.sm || baseSize * 1.25,
    md: breakpoints?.md || baseSize * 1.5,
    lg: breakpoints?.lg || baseSize * 1.75,
    xl: breakpoints?.xl || baseSize * 2,
    '2xl': breakpoints?.['2xl'] || baseSize * 2.5,
  };
};

// ==================== 响应式图标 ====================

/**
 * 响应式图标组件
 * 根据屏幕尺寸自动调整图标大小
 */
export const ResponsiveIcon: React.FC<ResponsiveIconProps> = ({
  name,
  baseSize = 24,
  breakpoints = {},
  color,
  className = ''
}) => {
  const sizes = getBreakpointSize(baseSize, breakpoints);

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${color || ''}
        ${className}
      `.trim()}
    >
      <DynamicIcon
        name={name}
        size={sizes.xs}
        className={`
          xs:w-[${sizes.xs}px] xs:h-[${sizes.xs}px]
          sm:w-[${sizes.sm}px] sm:h-[${sizes.sm}px]
          md:w-[${sizes.md}px] md:h-[${sizes.md}px]
          lg:w-[${sizes.lg}px] lg:h-[${sizes.lg}px]
          xl:w-[${sizes.xl}px] xl:h-[${sizes.xl}px]
          2xl:w-[${sizes['2xl']}px] 2xl:h-[${sizes['2xl']}px]
          transition-all duration-200
        `.trim()}
      />
    </span>
  );
};

// ==================== 自适应图标 ====================

/**
 * 自适应图标组件
 * 根据容器宽度和密度自动调整
 */
export const AdaptiveIcon: React.FC<AdaptiveIconProps> = ({
  name,
  density = 'comfortable',
  containerWidth,
  color,
  className = ''
}) => {
  const [currentSize, setCurrentSize] = useState(24);

  const densityConfig = {
    compact: { base: 16, ratio: 0.03 },
    comfortable: { base: 24, ratio: 0.04 },
    spacious: { base: 32, ratio: 0.05 },
  };

  const config = densityConfig[density];

  useEffect(() => {
    if (containerWidth) {
      const calculatedSize = Math.max(
        config.base,
        Math.min(64, containerWidth * config.ratio)
      );
      setCurrentSize(Math.round(calculatedSize));
    }
  }, [containerWidth, config]);

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${color || ''}
        ${className}
      `.trim()}
    >
      <DynamicIcon name={name} size={currentSize} />
    </span>
  );
};

// ==================== 流式图标 ====================

export interface FluidIconProps {
  /** 图标名称 */
  name: string;
  /** 最小尺寸 */
  minSize?: number;
  /** 最大尺寸 */
  maxSize?: number;
  /** 容器比例（相对于容器宽度） */
  containerRatio?: number;
  /** 颜色 */
  color?: string;
  /** 额外的类名 */
  className?: string;
}

/**
 * 流式图标组件
 * 填充容器宽度，保持宽高比
 */
export const FluidIcon: React.FC<FluidIconProps> = ({
  name,
  minSize = 16,
  maxSize = 64,
  containerRatio = 0.8,
  color,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iconSize, setIconSize] = useState(minSize);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedSize = Math.max(
          minSize,
          Math.min(maxSize, containerWidth * containerRatio)
        );
        setIconSize(calculatedSize);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [minSize, maxSize, containerRatio]);

  return (
    <div
      ref={containerRef}
      className={`
        inline-flex items-center justify-center
        w-full h-full
        ${color || ''}
        ${className}
      `.trim()}
    >
      <DynamicIcon name={name} size={iconSize} />
    </div>
  );
};

// ==================== 容器感知图标 ====================

export interface ContainerAwareIconProps {
  /** 图标名称 */
  name: string;
  /** 容器尺寸 */
  containerSize?: { width: number; height: number };
  /** 填充模式 */
  fit?: 'contain' | 'cover' | 'fill';
  /** 颜色 */
  color?: string;
  /** 额外的类名 */
  className?: string;
}

/**
 * 容器感知图标组件
 * 根据容器尺寸智能填充
 */
export const ContainerAwareIcon: React.FC<ContainerAwareIconProps> = ({
  name,
  containerSize = { width: 48, height: 48 },
  fit = 'contain',
  color,
  className = ''
}) => {
  const calculateSize = () => {
    const { width, height } = containerSize;
    const minDimension = Math.min(width, height);

    switch (fit) {
      case 'contain':
        return minDimension * 0.8;
      case 'cover':
        return minDimension;
      case 'fill':
        return Math.max(width, height);
      default:
        return minDimension * 0.8;
    }
  };

  const size = calculateSize();

  return (
    <div
      className={`
        inline-flex items-center justify-center
        ${color || ''}
        ${className}
      `.trim()}
      style={{ width: containerSize.width, height: containerSize.height }}
    >
      <DynamicIcon name={name} size={size} />
    </div>
  );
};

// ==================== 响应式图标组 ====================

export interface ResponsiveIconGroupProps {
  /** 图标列表 */
  icons: Array<{ name: string; label?: string }>;
  /** 间距 */
  gap?: number | { base?: number; sm?: number; md?: number; lg?: number };
  /** 每行图标数 */
  itemsPerLine?: number | { base?: number; sm?: number; md?: number; lg?: number };
  /** 基础图标尺寸 */
  baseIconSize?: number;
  /** 颜色 */
  color?: string;
  /** 额外的类名 */
  className?: string;
}

/**
 * 响应式图标组组件
 * 自动调整布局的图标集合
 */
export const ResponsiveIconGroup: React.FC<ResponsiveIconGroupProps> = ({
  icons,
  gap = 2,
  itemsPerLine = { base: 4, sm: 6, md: 8, lg: 10 },
  baseIconSize = 24,
  color,
  className = ''
}) => {
  const getGapClass = () => {
    if (typeof gap === 'number') {
      return `gap-${gap}`;
    }
    return `
      gap-${gap.base || 2}
      sm:gap-${gap.sm || gap.base || 2}
      md:gap-${gap.md || gap.sm || gap.base || 2}
      lg:gap-${gap.lg || gap.md || gap.sm || gap.base || 2}
    `.trim().replace(/\s+/g, ' ');
  };

  const getGridClass = () => {
    if (typeof itemsPerLine === 'number') {
      return `grid grid-cols-${itemsPerLine}`;
    }

    return `
      grid
      grid-cols-${itemsPerLine.base || 4}
      sm:grid-cols-${itemsPerLine.sm || itemsPerLine.base || 4}
      md:grid-cols-${itemsPerLine.md || itemsPerLine.sm || itemsPerLine.base || 4}
      lg:grid-cols-${itemsPerLine.lg || itemsPerLine.md || itemsPerLine.sm || itemsPerLine.base || 4}
    `.trim().replace(/\s+/g, ' ');
  };

  return (
    <div className={`
      ${getGridClass()}
      ${getGapClass()}
      ${color || ''}
      ${className}
    `.trim()}>
      {icons.map((icon, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2 p-2 rounded hover:bg-cyber-purple/10 transition-colors"
        >
          <DynamicIcon name={icon.name} size={baseIconSize} />
          {icon.label && (
            <span className="text-xs text-gray-600 text-center">
              {icon.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

// ==================== 视口相关图标 ====================

export interface ViewportRelativeIconProps {
  /** 图标名称 */
  name: string;
  /** 视口单位 */
  unit?: 'vw' | 'vh' | 'vmin' | 'vmax';
  /** 数值 */
  value?: number;
  /** 最小像素尺寸 */
  minPixelSize?: number;
  /** 最大像素尺寸 */
  maxPixelSize?: number;
  /** 颜色 */
  color?: string;
  /** 额外的类名 */
  className?: string;
}

/**
 * 视口相关图标组件
 * 根据视口尺寸调整大小
 */
export const ViewportRelativeIcon: React.FC<ViewportRelativeIconProps> = ({
  name,
  unit = 'vw',
  value = 2,
  minPixelSize = 16,
  maxPixelSize = 64,
  color,
  className = ''
}) => {
  const [pixelSize, setPixelSize] = useState(minPixelSize);

  useEffect(() => {
    const updateSize = () => {
      let viewportSize: number;

      switch (unit) {
        case 'vw':
          viewportSize = window.innerWidth;
          break;
        case 'vh':
          viewportSize = window.innerHeight;
          break;
        case 'vmin':
          viewportSize = Math.min(window.innerWidth, window.innerHeight);
          break;
        case 'vmax':
          viewportSize = Math.max(window.innerWidth, window.innerHeight);
          break;
        default:
          viewportSize = window.innerWidth;
      }

      const calculatedSize = viewportSize * (value / 100);
      const clampedSize = Math.max(
        minPixelSize,
        Math.min(maxPixelSize, calculatedSize)
      );

      setPixelSize(Math.round(clampedSize));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [unit, value, minPixelSize, maxPixelSize]);

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${color || ''}
        ${className}
      `.trim()}
    >
      <DynamicIcon name={name} size={pixelSize} />
    </span>
  );
};

// ==================== 导出所有组件 ====================

export default {
  ResponsiveIcon,
  AdaptiveIcon,
  FluidIcon,
  ContainerAwareIcon,
  ResponsiveIconGroup,
  ViewportRelativeIcon,
};
