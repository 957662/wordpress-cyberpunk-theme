/**
 * IconWithText - 带文本图标
 * 图标和文本的组合，提供更好的可访问性
 */

import React from 'react';
import { IconProps } from '../types';

export interface IconWithTextProps extends IconProps {
  /**
   * 文本内容
   */
  text: string;

  /**
   * 文本位置
   * @default 'right'
   */
  textPosition?: 'left' | 'right' | 'top' | 'bottom';

  /**
   * 间距
   * @default 'medium'
   */
  gap?: 'small' | 'medium' | 'large';

  /**
   * 是否隐藏文本
   * @default false
   */
  textHidden?: boolean;

  /**
   * 点击回调
   */
  onClick?: () => void;
}

export const IconWithText: React.FC<IconWithTextProps> = ({
  size = 24,
  className = '',
  color,
  text,
  textPosition = 'right',
  gap = 'medium',
  textHidden = false,
  onClick,
  children,
  ...props
}) => {
  const gapClass = {
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-4',
  }[gap];

  const positionClass = {
    left: 'flex-row-reverse',
    right: 'flex-row',
    top: 'flex-col-reverse',
    bottom: 'flex-col',
  }[textPosition];

  return (
    <div
      className={`inline-flex items-center ${gapClass} ${positionClass} ${className}`.trim()}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color }}
        aria-hidden="true"
      >
        {children}
      </svg>
      <span
        className={textHidden ? 'sr-only' : 'text-sm font-medium'}
        aria-hidden={textHidden}
      >
        {text}
      </span>
    </div>
  );
};

export default IconWithText;
