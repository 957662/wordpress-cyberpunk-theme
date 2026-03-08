/**
 * ThemeToggleIcon - 主题切换图标
 * 用于切换亮色/暗色主题的图标
 */

import React, { useState, useEffect } from 'react';
import { IconProps } from '../types';

export interface ThemeToggleIconProps extends IconProps {
  /**
   * 亮色主题图标（太阳）
   */
  lightIcon?: React.ReactNode;

  /**
   * 暗色主题图标（月亮）
   */
  darkIcon?: React.ReactNode;

  /**
   * 切换回调
   */
  onToggle?: (isDark: boolean) => void;
}

export const ThemeToggleIcon: React.FC<ThemeToggleIconProps> = ({
  size = 24,
  className = '',
  onToggle,
  ...props
}) => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleClick = () => {
    setIsAnimating(true);
    const newTheme = !isDark;

    // Toggle theme
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setIsDark(newTheme);
    onToggle?.(newTheme);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`theme-toggle-icon ${isAnimating ? 'animate-spin' : ''} ${className}`.trim()}
      style={{
        width: size,
        height: size,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
      {...props}
      aria-label={isDark ? '切换到亮色主题' : '切换到暗色主题'}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300"
      >
        {isDark ? (
          // Sun icon
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
        ) : (
          // Moon icon
          <g>
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        )}
      </svg>
    </button>
  );
};

export default ThemeToggleIcon;
