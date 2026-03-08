/**
 * FloatingIcon - 悬浮动画图标
 * 赛博朋克风格的悬浮动画效果
 */

import React from 'react';
import { IconProps } from '../types';

export interface FloatingIconProps extends IconProps {
  /**
   * 悬浮速度
   * @default 'medium'
   */
  speed?: 'slow' | 'medium' | 'fast';

  /**
   * 悬浮高度
   * @default 'medium'
   */
  height?: 'low' | 'medium' | 'high';

  /**
   * 是否有阴影
   * @default true
   */
  shadow?: boolean;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
  size = 24,
  className = '',
  color,
  speed = 'medium',
  height = 'medium',
  shadow = true,
  ariaLabel,
  children,
}) => {
  const getAnimationClass = () => {
    const animations = {
      slow: {
        low: 'animate-[float_4s_ease-in-out_infinite]',
        medium: 'animate-[float_4s_ease-in-out_infinite]',
        high: 'animate-[float_4s_ease-in-out_infinite]',
      },
      medium: {
        low: 'animate-[float_3s_ease-in-out_infinite]',
        medium: 'animate-[float_3s_ease-in-out_infinite]',
        high: 'animate-[float_3s_ease-in-out_infinite]',
      },
      fast: {
        low: 'animate-[float_2s_ease-in-out_infinite]',
        medium: 'animate-[float_2s_ease-in-out_infinite]',
        high: 'animate-[float_2s_ease-in-out_infinite]',
      },
    };

    return animations[speed][height];
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${getAnimationClass()} ${shadow ? 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]' : ''} ${className}`.trim()}
      style={{ color }}
      aria-label={ariaLabel}
      role="img"
    >
      <defs>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(${height === 'low' ? -4 : height === 'medium' ? -8 : -12}px); }
            }
          `}
        </style>
      </defs>
      {children || (
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
};

export default FloatingIcon;
