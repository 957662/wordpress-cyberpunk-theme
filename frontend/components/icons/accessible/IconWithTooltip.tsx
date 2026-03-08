/**
 * IconWithTooltip - 带工具提示图标
 * 悬停时显示工具提示的图标
 */

import React, { useState } from 'react';
import { IconProps } from '../types';

export interface IconWithTooltipProps extends IconProps {
  /**
   * 工具提示文本
   */
  tooltip: string;

  /**
   * 工具提示位置
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * 延迟显示
   * @default 500
   */
  delay?: number;

  /**
   * 是否显示箭头
   * @default true
   */
  showArrow?: boolean;
}

export const IconWithTooltip: React.FC<IconWithTooltipProps> = ({
  size = 24,
  className = '',
  color,
  tooltip,
  position = 'top',
  delay = 500,
  showArrow = true,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-cyber-dark',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-cyber-dark',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-cyber-dark',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-cyber-dark',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
        aria-label={tooltip}
        {...props}
      >
        {children}
      </svg>

      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-cyber-dark
            border border-cyber-border rounded-lg shadow-lg
            whitespace-nowrap
            ${positionClasses[position]}
          `.trim().replace(/\s+/g, ' ')}
          role="tooltip"
        >
          {tooltip}
          {showArrow && (
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default IconWithTooltip;
