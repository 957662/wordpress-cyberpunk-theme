/**
 * CyberPress Icons - RSS Icon
 * RSS 订阅图标
 */

import React from 'react';
import IconBase from './IconBase';
import type { IconProps } from './types';

export interface RssIconProps extends IconProps {}

export const RssIcon: React.FC<RssIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  glow = true,
  ariaLabel = 'RSS Feed',
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      color={color}
      glow={glow}
      ariaLabel={ariaLabel}
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </IconBase>
  );
};

export default RssIcon;
