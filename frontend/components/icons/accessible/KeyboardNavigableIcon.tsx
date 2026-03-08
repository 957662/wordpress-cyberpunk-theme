/**
 * KeyboardNavigableIcon - 键盘导航图标
 * 支持完整键盘导航的图标
 */

import React, { useRef } from 'react';
import { IconProps } from '../types';

export interface KeyboardNavigableIconProps extends IconProps {
  /**
   * 点击回调
   */
  onActivate?: () => void;

  /**
   * 键盘快捷键
   */
  shortcut?: string;

  /**
   * 是否显示焦点样式
   * @default true
   */
  showFocusRing?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;
}

export const KeyboardNavigableIcon: React.FC<KeyboardNavigableIconProps> = ({
  size = 24,
  className = '',
  color,
  onActivate,
  shortcut,
  showFocusRing = true,
  disabled = false,
  ariaLabel,
  children,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onActivate?.();
        break;
      case 'Escape':
        buttonRef.current?.blur();
        break;
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        p-2 rounded-lg transition-all duration-200
        focus:outline-none
        ${showFocusRing ? 'focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2 focus:ring-offset-cyber-dark' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-cyber-cyan/10'}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      aria-label={ariaLabel}
      aria-keyshortcuts={shortcut}
      tabIndex={0}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color }}
      >
        {children}
      </svg>
    </button>
  );
};

export default KeyboardNavigableIcon;
