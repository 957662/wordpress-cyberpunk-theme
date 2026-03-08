/**
 * ThemeStatusIcon - 主题状态图标
 * 显示当前主题状态的指示器图标
 */

import React, { useState, useEffect } from 'react';
import { IconProps } from '../types';

export interface ThemeStatusIconProps extends IconProps {
  /**
   * 状态指示器样式
   * @default 'dot'
   */
  indicatorStyle?: 'dot' | 'ring' | 'badge';

  /**
   * 指示器位置
   * @default 'top-right'
   */
  indicatorPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const ThemeStatusIcon: React.FC<ThemeStatusIconProps> = ({
  size = 24,
  className = '',
  indicatorStyle = 'dot',
  indicatorPosition = 'top-right',
  ...props
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const darkMode =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(darkMode);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const positionStyles = {
    'top-left': { top: 0, left: 0 },
    'top-right': { top: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
    'bottom-right': { bottom: 0, right: 0 },
  };

  const indicatorSize = size / 4;
  const position = positionStyles[indicatorPosition];

  return (
    <div
      className={`theme-status-icon relative inline-block ${className}`.trim()}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-cyber-gray-200 dark:text-cyber-gray-300"
      >
        {isDark ? (
          // Moon icon for dark mode
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          // Sun icon for light mode
          <g>
            <circle
              cx="12"
              cy="12"
              r="5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>

      {/* Status indicator */}
      <div
        className="absolute rounded-full bg-cyber-purple dark:bg-cyber-cyan animate-pulse"
        style={{
          width: indicatorSize,
          height: indicatorSize,
          ...position,
          boxShadow: indicatorStyle === 'ring' ? `0 0 0 2px rgba(0, 240, 255, 0.3)` : undefined,
        }}
      />
    </div>
  );
};

export default ThemeStatusIcon;
