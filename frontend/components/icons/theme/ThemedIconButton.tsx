/**
 * ThemedIconButton - 主题按钮
 * 带主题感知的图标按钮
 */

import React from 'react';
import { IconProps } from '../types';

export interface ThemedIconButtonProps extends IconProps {
  /**
   * 按钮变体
   * @default 'ghost'
   */
  variant?: 'ghost' | 'solid' | 'outline';

  /**
   * 按钮尺寸
   * @default 'medium'
   */
  buttonSize?: 'small' | 'medium' | 'large';

  /**
   * 点击回调
   */
  onClick?: () => void;

  /**
   * 按钮文本
   */
  label?: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;
}

export const ThemedIconButton: React.FC<ThemedIconButtonProps> = ({
  size = 24,
  variant = 'ghost',
  buttonSize = 'medium',
  onClick,
  label,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const buttonSizeClasses = {
    small: 'p-2 rounded-lg',
    medium: 'p-3 rounded-xl',
    large: 'p-4 rounded-2xl',
  };

  const variantClasses = {
    ghost: `
      bg-transparent
      hover:bg-cyber-cyan/10
      active:bg-cyber-cyan/20
      text-cyber-cyan
      dark:text-cyber-cyan
      border border-transparent
      hover:border-cyber-cyan/30
    `,
    solid: `
      bg-cyber-cyan
      dark:bg-cyber-cyan
      hover:bg-cyber-cyan/80
      text-cyber-dark
      border border-transparent
    `,
    outline: `
      bg-transparent
      text-cyber-cyan
      dark:text-cyber-cyan
      border border-cyber-cyan
      hover:bg-cyber-cyan/10
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${buttonSizeClasses[buttonSize]}
        ${variantClasses[variant]}
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${label ? 'pr-4' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
};

export default ThemedIconButton;
