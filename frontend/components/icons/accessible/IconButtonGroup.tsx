/**
 * IconButtonGroup - 可访问图标按钮组
 * 符合可访问性标准的图标按钮组
 */

import React, { createContext, useContext } from 'react';
import { IconProps } from '../types';

interface ButtonGroupContextValue {
  size?: number;
  variant?: 'ghost' | 'solid' | 'outline';
}

const ButtonGroupContext = createContext<ButtonGroupContextValue>({});

export interface IconButton {
  icon: React.ReactNode;
  label: string;
  value: string;
  disabled?: boolean;
  onClick?: () => void;
  'aria-current'?: boolean;
}

export interface IconButtonGroupProps {
  /**
   * 按钮数组
   */
  buttons: IconButton[];

  /**
   * 组标签
   */
  label: string;

  /**
   * 方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * 统一尺寸
   */
  size?: number;

  /**
   * 按钮变体
   * @default 'ghost'
   */
  variant?: 'ghost' | 'solid' | 'outline';

  /**
   * 自定义类名
   */
  className?: string;
}

export const IconButtonGroup: React.FC<IconButtonGroupProps> = ({
  buttons,
  label,
  orientation = 'horizontal',
  size = 24,
  variant = 'ghost',
  className = '',
}) => {
  const contextValue = { size, variant };

  const orientationClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
  const gapClass = orientation === 'horizontal' ? 'gap-1' : 'gap-1';

  const variantClasses = {
    ghost: 'bg-transparent hover:bg-cyber-cyan/10 text-cyber-gray-200',
    solid: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80',
    outline: 'bg-transparent border border-cyber-border hover:border-cyber-cyan text-cyber-gray-200',
  };

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        role="group"
        aria-label={label}
        className={`inline-flex ${orientationClass} ${gapClass} ${className}`.trim()}
      >
        {buttons.map((button, index) => (
          <button
            key={button.value || index}
            onClick={button.onClick}
            disabled={button.disabled}
            aria-current={button['aria-current']}
            aria-label={button.label}
            className={`
              inline-flex items-center justify-center
              p-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2 focus:ring-offset-cyber-dark
              ${variantClasses[variant]}
              ${button.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `.trim().replace(/\s+/g, ' ')}
          >
            <div style={{ width: size, height: size }}>
              {button.icon}
            </div>
          </button>
        ))}
      </div>
    </ButtonGroupContext.Provider>
  );
};

export default IconButtonGroup;
