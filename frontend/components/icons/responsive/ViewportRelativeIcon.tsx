/**
 * ViewportRelativeIcon - 视口相关图标
 * 尺寸相对于视口宽度的图标
 */

import React from 'react';
import { IconProps } from '../types';

export interface ViewportRelativeIconProps extends IconProps {
  /**
   * 视口宽度单位
   * @default 2
   */
  vw?: number;

  /**
   * 最小像素尺寸
   * @default 16
   */
  minSize?: number;

  /**
   * 最大像素尺寸
   * @default 64
   */
  maxSize?: number;
}

export const ViewportRelativeIcon: React.FC<ViewportRelativeIconProps> = ({
  vw = 2,
  minSize = 16,
  maxSize = 64,
  className = '',
  color,
  children,
  ...props
}) => {
  return (
    <svg
      width={`${vw}vw`}
      height={`${vw}vw`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        color,
        minWidth: minSize,
        minHeight: minSize,
        maxWidth: maxSize,
        maxHeight: maxSize,
      }}
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
};

export default ViewportRelativeIcon;
