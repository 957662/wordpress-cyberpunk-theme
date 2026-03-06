/**
 * CyberPress Icons - History Icon
 * 历史记录图标
 */

import React from 'react';
import IconBase from './IconBase';
import type { IconProps } from './types';

export interface HistoryIconProps extends IconProps {}

export const HistoryIcon: React.FC<HistoryIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  glow = true,
  ariaLabel = 'History',
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      color={color}
      glow={glow}
      ariaLabel={ariaLabel}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </IconBase>
  );
};

export default HistoryIcon;
