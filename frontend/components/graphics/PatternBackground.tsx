/**
 * CyberPress Pattern Background Component
 *
 * 背景图案组件
 *
 * @example
 * ```tsx
 * <PatternBackground name="grid" />
 * <PatternBackground name="circuit" opacity={0.1} />
 * ```
 */

import React from 'react';

export interface PatternBackgroundProps {
  /** 图案名称 */
  name?: 'grid' | 'circuit' | 'scanlines' | 'noise' | 'hexagon' | 'matrix' | 'holographic' | 'hex-grid';
  /** 透明度 */
  opacity?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否固定背景 */
  fixed?: boolean;
  /** 子元素 */
  children?: React.ReactNode;
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  name = 'grid',
  opacity = 0.1,
  className = '',
  fixed = false,
  children
}) => {
  const backgroundStyle = {
    backgroundImage: `url('/patterns/${name}.svg')`,
    backgroundRepeat: 'repeat',
    backgroundAttachment: fixed ? 'fixed' : 'scroll',
    opacity
  };

  if (children) {
    return (
      <div className={`relative ${className}`}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={backgroundStyle}
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={backgroundStyle}
    />
  );
};

export default PatternBackground;
