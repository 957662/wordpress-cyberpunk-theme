/**
 * BouncingIcon - 弹跳动画图标
 * 赛博朋克风格的弹跳动画效果
 */

import React from 'react';
import { IconProps } from '../types';

export interface BouncingIconProps extends IconProps {
  /**
   * 弹跳速度
   * @default 'medium'
   */
  speed?: 'slow' | 'medium' | 'fast';

  /**
   * 弹跳高度
   * @default 'medium'
   */
  height?: 'low' | 'medium' | 'high';
}

export const BouncingIcon: React.FC<BouncingIconProps> = ({
  size = 24,
  className = '',
  color,
  speed = 'medium',
  height = 'medium',
  ariaLabel,
  children,
}) => {
  const getAnimationClass = () => {
    const speedMap = {
      slow: 'animate-[bounce_2s_infinite]',
      medium: 'animate-[bounce_1s_infinite]',
      fast: 'animate-[bounce_0.5s_infinite]',
    };

    return speedMap[speed];
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${getAnimationClass()} ${className}`.trim()}
      style={{ color }}
      aria-label={ariaLabel}
      role="img"
    >
      {children || (
        <path
          d="M12 2L12 22M8 18L12 22L16 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export default BouncingIcon;
