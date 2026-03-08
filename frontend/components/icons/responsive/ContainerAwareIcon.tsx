/**
 * ContainerAwareIcon - 容器感知图标
 * 根据容器类名和断点调整的图标
 */

import React from 'react';
import { IconProps } from '../types';

export interface ContainerAwareIconProps extends IconProps {
  /**
   * 容器查询类名
   */
  containerQuery?: string;

  /**
   * 小容器尺寸
   * @default 16
   */
  sizeSmall?: number;

  /**
   * 中容器尺寸
   * @default 24
   */
  sizeMedium?: number;

  /**
   * 大容器尺寸
   * @default 32
   */
  sizeLarge?: number;
}

export const ContainerAwareIcon: React.FC<ContainerAwareIconProps> = ({
  sizeSmall = 16,
  sizeMedium = 24,
  sizeLarge = 32,
  className = '',
  color,
  children,
  ...props
}) => {
  return (
    <svg
      width={sizeMedium}
      height={sizeMedium}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        color,
        // Container queries are supported in modern browsers
        containerType: 'inline-size',
      }}
      {...props}
    >
      <style>{`
        @container (max-width: 300px) {
          svg { width: ${sizeSmall}px; height: ${sizeSmall}px; }
        }
        @container (min-width: 301px) and (max-width: 600px) {
          svg { width: ${sizeMedium}px; height: ${sizeMedium}px; }
        }
        @container (min-width: 601px) {
          svg { width: ${sizeLarge}px; height: ${sizeLarge}px; }
        }
      `}</style>
      {children}
    </svg>
  );
};

export default ContainerAwareIcon;
