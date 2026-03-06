/**
 * CyberPress Icons - Arrow Right Icon
 * 右箭头图标
 */

import React from 'react';
import IconBase from './IconBase';
import type { IconProps } from './types';

export interface ArrowRightIconProps extends IconProps {}

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  glow = true,
  ariaLabel = 'Arrow Right',
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      color={color}
      glow={glow}
      ariaLabel={ariaLabel}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </IconBase>
  );
};

export default ArrowRightIcon;
