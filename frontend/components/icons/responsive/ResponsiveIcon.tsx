/**
 * ResponsiveIcon - 断点响应式图标
 * 根据屏幕断点自动调整图标尺寸
 */

import React from 'react';
import { IconProps } from '../types';

export interface ResponsiveIconProps extends IconProps {
  /**
   * 移动端尺寸
   * @default 16
   */
  sizeMobile?: number;

  /**
   * 平板尺寸
   * @default 20
   */
  sizeTablet?: number;

  /**
   * 桌面尺寸
   * @default 24
   */
  sizeDesktop?: number;

  /**
   * 大屏尺寸
   * @default 32
   */
  sizeWide?: number;
}

export const ResponsiveIcon: React.FC<ResponsiveIconProps> = ({
  sizeMobile = 16,
  sizeTablet = 20,
  sizeDesktop = 24,
  sizeWide = 32,
  className = '',
  color,
  children,
  ...props
}) => {
  return (
    <svg
      width={sizeDesktop}
      height={sizeDesktop}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        color,
        '@media (max-width: 640px)': {
          width: sizeMobile,
          height: sizeMobile,
        },
        '@media (min-width: 641px) and (max-width: 1024px)': {
          width: sizeTablet,
          height: sizeTablet,
        },
        '@media (min-width: 1025px) and (max-width: 1280px)': {
          width: sizeDesktop,
          height: sizeDesktop,
        },
        '@media (min-width: 1281px)': {
          width: sizeWide,
          height: sizeWide,
        },
      }}
      {...props}
    >
      {children}
    </svg>
  );
};

export default ResponsiveIcon;
