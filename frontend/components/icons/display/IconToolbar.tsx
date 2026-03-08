/**
 * IconToolbar - 图标选择工具栏
 * 用于选择和预览图标的工具栏组件
 */

import React, { useState } from 'react';

export interface ToolbarIcon {
  icon: React.ReactNode;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface IconToolbarProps {
  /**
   * 工具栏图标
   */
  icons: ToolbarIcon[];

  /**
   * 选中回调
   */
  onSelect?: (value: string) => void;

  /**
   * 默认选中值
   */
  defaultValue?: string;

  /**
   * 方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * 尺寸
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 自定义类名
   */
  className?: string;
}

export const IconToolbar: React.FC<IconToolbarProps> = ({
  icons,
  onSelect,
  defaultValue,
  orientation = 'horizontal',
  size = 'medium',
  className = '',
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const sizeClasses = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4',
  };

  const iconSizes = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const handleSelect = (value: string, disabled?: boolean) => {
    if (disabled) return;

    setSelectedValue(value);
    onSelect?.(value);
  };

  const orientationClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div
      className={`flex ${orientationClass} gap-2 bg-cyber-card rounded-lg p-2 ${className}`.trim()}
    >
      {icons.map((item, index) => {
        const isSelected = selectedValue === item.value;

        return (
          <button
            key={index}
            onClick={() => handleSelect(item.value, item.disabled)}
            disabled={item.disabled}
            className={`
              ${sizeClasses[size]}
              rounded-md transition-all duration-200
              ${isSelected
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-can'
                : 'text-cyber-gray-400 hover:text-cyber-gray-200 hover:bg-cyber-card/50'
              }
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={item.label}
          >
            <div style={{ width: iconSizes[size], height: iconSizes[size] }}>
              {item.icon}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default IconToolbar;
