/**
 * CyberPress Icons - Git Commit Icon
 * Git 提交图标
 */

import React from 'react';
import IconBase from './IconBase';
import type { IconProps } from './types';

export interface GitCommitIconProps extends IconProps {}

export const GitCommitIcon: React.FC<GitCommitIconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor',
  glow = true,
  ariaLabel = 'Git Commit',
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      color={color}
      glow={glow}
      ariaLabel={ariaLabel}
    >
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="21" y2="12" />
    </IconBase>
  );
};

export default GitCommitIcon;
