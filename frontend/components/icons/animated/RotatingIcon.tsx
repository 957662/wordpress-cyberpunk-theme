/**
 * RotatingIcon - 旋转动画图标
 * 赛博朋克风格的旋转动画效果
 */

import React from 'react';
import { IconProps } from '../types';

export interface RotatingIconProps extends IconProps {
  /**
   * 旋转速度
   * @default 'medium'
   */
  speed?: 'slow' | 'medium' | 'fast';

  /**
   * 旋转方向
   * @default 'clockwise'
   */
  direction?: 'clockwise' | 'counter-clockwise';
}

export const RotatingIcon: React.FC<RotatingIconProps> = ({
  size = 24,
  className = '',
  color,
  speed = 'medium',
  direction = 'clockwise',
  ariaLabel,
  children,
}) => {
  const getAnimationClass = () => {
    const base = 'animate-spin';
    const duration = {
      slow: 'duration-[3s]',
      medium: 'duration-[2s]',
      fast: 'duration-[1s]',
    }[speed];

    const dir = direction === 'counter-clockwise' 'direction-reverse' : '';

    return `${base} ${duration} ${dir}`.trim();
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
          d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

export default RotatingIcon;
