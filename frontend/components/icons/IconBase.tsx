/**
 * CyberPress Icons - 基础图标组件
 * 提供统一的图标渲染逻辑和霓虹发光效果
 */

import React from 'react';
import type { IconProps } from './types';

interface IconBaseProps extends IconProps {
  children: React.ReactNode;
  viewBox?: string;
}

export const IconBase: React.FC<IconBaseProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  strokeWidth = 2,
  glow = true,
  ariaLabel,
  children,
  viewBox = '0 0 24 24',
}) => {
  // 霓虹发光滤镜定义
  const neonGlowFilter = (
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
      <feColorMatrix
        in="blur"
        type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0.94
                0 0 0 0 1
                0 0 0 1 0"
      />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      role="img"
    >
      {glow && <defs>{neonGlowFilter}</defs>}
      <g filter={glow ? 'url(#neonGlow)' : undefined}>{children}</g>
    </svg>
  );
};

export default IconBase;
