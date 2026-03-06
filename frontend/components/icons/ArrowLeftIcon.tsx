/**
 * CyberPress Icons - Arrow Left Icon
 * 左箭头图标
 */

import React from 'react';
import IconBase from './IconBase';
import type { IconProps } from './types';

export interface ArrowLeftIconProps extends IconProps {}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  glow = true,
  ariaLabel = 'Arrow Left',
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      color={color}
      glow={glow}
      ariaLabel={ariaLabel}
    >
      <path d="m19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </IconBase>
  );
};

export default ArrowLeftIcon;
