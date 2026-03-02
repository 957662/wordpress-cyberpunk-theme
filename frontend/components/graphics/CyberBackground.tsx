/**
 * CyberBackground - 赛博朋克风格背景组件
 *
 * @example
 * ```tsx
 * <CyberBackground pattern="grid" />
 * <CyberBackground pattern="matrix" opacity={0.3} />
 * ```
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CyberBackgroundProps {
  /** 背景图案类型 */
  pattern?: 'grid' | 'hexgrid' | 'circuit' | 'matrix' | 'scanlines' | 'holographic';
  /** 透明度 */
  opacity?: number;
  /** 是否固定定位 */
  fixed?: boolean;
  /** 动画效果 */
  animated?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

export const CyberBackground = forwardRef<HTMLDivElement, CyberBackgroundProps>(
  (
    {
      pattern = 'grid',
      opacity = 0.5,
      fixed = false,
      animated = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const patternPaths: Record<string, string> = {
      grid: '/patterns/cyber-grid.svg',
      hexgrid: '/patterns/cyber-hexgrid.svg',
      circuit: '/patterns/cyber-circuit.svg',
      matrix: '/patterns/cyber-matrix.svg',
      scanlines: '/patterns/cyber-scanlines.svg',
      holographic: '/patterns/holographic.svg',
    };

    const patternPath = patternPaths[pattern] || patternPaths.grid;

    const combinedClasses = cn(
      'absolute inset-0 -z-10 pointer-events-none',
      fixed && 'fixed',
      animated && 'animate-pulse',
      className
    );

    const backgroundStyle: React.CSSProperties = {
      backgroundImage: `url(${patternPath})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
      opacity,
    };

    return (
      <div ref={ref} className="relative" {...props}>
        <div className={combinedClasses} style={backgroundStyle} />
        {children}
      </div>
    );
  }
);

CyberBackground.displayName = 'CyberBackground';

export default CyberBackground;
