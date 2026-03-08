/**
 * FluidIcon - 流式图标
 * 使用百分比宽度实现完全流式的图标
 */

import React from 'react';
import { IconProps } from '../types';

export interface FluidIconProps extends IconProps {
  /**
   * 宽度百分比
   * @default '100%'
   */
  width?: string;

  /**
   * 宽高比
   * @default 1
   */
  aspectRatio?: number;
}

export const FluidIcon: React.FC<FluidIconProps> = ({
  width = '100%',
  aspectRatio = 1,
  className = '',
  color,
  children,
  ...props
}) => {
  return (
    <svg
      width={width}
      height="auto"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        color,
        aspectRatio: `${aspectRatio}`,
      }}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      {children}
    </svg>
  );
};

export default FluidIcon;
