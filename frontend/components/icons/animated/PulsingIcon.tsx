/**
 * PulsingIcon - 脉冲发光动画图标
 * 赛博朋克风格的脉冲动画效果
 */

import React from 'react';
import { IconProps } from '../types';

export interface PulsingIconProps extends IconProps {
  /**
   * 脉冲速度
   * @default 'medium'
   */
  speed?: 'slow' | 'medium' | 'fast';

  /**
   * 脉冲强度
   * @default 'medium'
   */
  intensity?: 'low' | 'medium' | 'high';
}

export const PulsingIcon: React.FC<PulsingIconProps> = ({
  size = 24,
  className = '',
  color,
  speed = 'medium',
  intensity = 'medium',
  ariaLabel,
  children,
}) => {
  const speedMap = {
    slow: 'animate-[pulse_3s_ease-in-out_infinite]',
    medium: 'animate-[pulse_2s_ease-in-out_infinite]',
    fast: 'animate-[pulse_1s_ease-in-out_infinite]',
  };

  const intensityMap = {
    low: 'drop-shadow-[0_0_4px_currentColor]',
    medium: 'drop-shadow-[0_0_8px_currentColor]',
    high: 'drop-shadow-[0_0_16px_currentColor]',
  };

  const animationClass = speedMap[speed];
  const glowClass = intensityMap[intensity];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${glowClass} ${className}`.trim()}
      style={{ color }}
      aria-label={ariaLabel}
      role="img"
    >
      {children || (
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      )}
    </svg>
  );
};

export default PulsingIcon;
