/**
 * GlowingIcon - 强烈发光动画图标
 * 赛博朋克风格的强烈发光动画效果
 */

import React from 'react';
import { IconProps } from '../types';

export interface GlowingIconProps extends IconProps {
  /**
   * 发光颜色
   * @default 'currentColor'
   */
  glowColor?: string;

  /**
   * 发光强度
   * @default 'high'
   */
  intensity?: 'low' | 'medium' | 'high';

  /**
   * 脉冲动画
   * @default true
   */
  pulse?: boolean;
}

export const GlowingIcon: React.FC<GlowingIconProps> = ({
  size = 24,
  className = '',
  color,
  glowColor,
  intensity = 'high',
  pulse = true,
  ariaLabel,
  children,
}) => {
  const getGlowClass = () => {
    const intensityMap = {
      low: 'drop-shadow-[0_0_8px_currentColor]',
      medium: 'drop-shadow-[0_0_16px_currentColor]',
      high: 'drop-shadow-[0_0_24px_currentColor] drop-shadow-[0_0_32px_currentColor]',
    };

    return intensityMap[intensity];
  };

  const animationClass = pulse ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${getGlowClass()} ${animationClass} ${className}`.trim()}
      style={{ color, '--tw-drop-shadow-color': glowColor || color } as React.CSSProperties}
      aria-label={ariaLabel}
      role="img"
    >
      <defs>
        <filter id={`glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {children || (
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          filter={`url(#glow-${size})`}
        />
      )}
    </svg>
  );
};

export default GlowingIcon;
