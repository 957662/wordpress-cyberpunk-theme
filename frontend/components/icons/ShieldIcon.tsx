/**
 * CyberPress Icons - Shield Icon
 * 安全/保护图标
 */

import React from 'react';
import IconBase from './IconBase';
import type { IconProps } from './types';

export interface ShieldIconProps extends IconProps {}

export const ShieldIcon: React.FC<ShieldIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  glow = true,
  ariaLabel = 'Shield',
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      color={color}
      glow={glow}
      ariaLabel={ariaLabel}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </IconBase>
  );
};

export default ShieldIcon;
