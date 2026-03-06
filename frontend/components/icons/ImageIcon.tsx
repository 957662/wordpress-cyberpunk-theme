/**
 * CyberPress Icons - Image Icon
 * 图片图标
 */

import React from 'react';
import IconBase from './IconBase';
import type { IconProps } from './types';

export interface ImageIconProps extends IconProps {}

export const ImageIcon: React.FC<ImageIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  glow = true,
  ariaLabel = 'Image',
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      color={color}
      glow={glow}
      ariaLabel={ariaLabel}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </IconBase>
  );
};

export default ImageIcon;
