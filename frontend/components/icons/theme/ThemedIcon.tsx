/**
 * ThemedIcon - 主题感知图标
 * 根据当前主题自动调整颜色
 */

import React, { useContext, useEffect, useState } from 'react';
import { IconProps } from '../types';

export interface ThemedIconProps extends IconProps {
  /**
   * 亮色主题颜色
   * @default '#0066ff'
   */
  lightColor?: string;

  /**
   * 暗色主题颜色
   * @default '#00f0ff'
   */
  darkColor?: string;

  /**
   * 颜色过渡
   * @default true
   */
  transition?: boolean;
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({
  size = 24,
  className = '',
  lightColor = '#0066ff',
  darkColor = '#00f0ff',
  transition = true,
  children,
  ...props
}) => {
  const [isDark, setIsDark] = useState(false);
  const [color, setColor] = useState(darkColor);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDarkMode =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
      setColor(isDarkMode ? darkColor : lightColor);
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, [darkColor, lightColor]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        color,
        transition: transition ? 'color 0.3s ease' : undefined,
      }}
      {...props}
    >
      {children}
    </svg>
  );
};

export default ThemedIcon;
