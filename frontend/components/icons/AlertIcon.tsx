/**
 * CyberPress Icons - Alert Icon
 * 警告图标
 */

import React from 'react';
import IconBase from './IconBase';
import type { IconProps } from './types';

export interface AlertIconProps extends IconProps {}

export const AlertIcon: React.FC<AlertIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  glow = true,
  ariaLabel = 'Alert',
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      color={color}
      glow={glow}
      ariaLabel={ariaLabel}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </IconBase>
  );
};

export default AlertIcon;
