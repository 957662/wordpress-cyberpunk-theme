'use client';

import React from 'react';

interface BackgroundPatternProps {
  pattern: 'grid' | 'scanlines' | 'circuit' | 'hexagon' | 'noise' | 'data-stream' | 'holographic-grid' | 'cyber-mesh';
  opacity?: number;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 背景图案组件
 *
 * 为容器添加赛博朋克风格的背景图案
 *
 * @example
 * <BackgroundPattern pattern="grid" opacity={0.3}>
 *   <div>Content with grid background</div>
 * </BackgroundPattern>
 */
export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  pattern,
  opacity = 0.3,
  animated = false,
  className = '',
  children,
}) => {
  const patternUrl = `/patterns/${pattern}.svg`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${patternUrl})`,
        backgroundRepeat: 'repeat',
        opacity,
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundPattern;
