/**
 * AccessibleIcon - 可访问性图标
 * 完整支持 ARIA 标签的图标组件
 */

import React from 'react';
import { IconProps } from '../types';

export interface AccessibleIconProps extends IconProps {
  /**
   * 图标角色
   * @default 'img'
   */
  role?: 'img' | 'graphics-symbol' | 'presentation';

  /**
   * 是否隐藏标签
   * @default false
   */
  labelHidden?: boolean;

  /**
   * 描述文本
   */
  description?: string;

  /**
   * 键盘快捷键
   */
  accessKey?: string;
}

export const AccessibleIcon: React.FC<AccessibleIconProps> = ({
  size = 24,
  className = '',
  color,
  role = 'img',
  labelHidden = false,
  ariaLabel,
  description,
  accessKey,
  children,
  ...props
}) => {
  const generateId = () => `icon-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = generateId();
  const descId = generateId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
      role={role}
      aria-labelledby={ariaLabel || description ? labelId : undefined}
      aria-describedby={description ? descId : undefined}
      aria-label={ariaLabel}
      aria-hidden={labelHidden}
      accessKey={accessKey}
      focusable="true"
      tabIndex={0}
      {...props}
    >
      {(ariaLabel || description) && (
        <title id={labelId}>{ariaLabel || 'Icon'}</title>
      )}
      {description && <desc id={descId}>{description}</desc>}
      {children}
    </svg>
  );
};

export default AccessibleIcon;
