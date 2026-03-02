/**
 * CyberPress Theme Icons
 *
 * 主题相关的图标组件
 *
 * @example
 * ```tsx
 * import { SunIcon, MoonIcon, ThemeToggleIcon } from '@/components/graphics/ThemeIcons';
 *
 * <SunIcon size={24} />
 * <MoonIcon size={24} />
 * <ThemeToggleIcon isDark={true} size={24} />
 * ```
 */

import React from 'react';
import { SVGIconProps } from './SVGIcons';

/**
 * 太阳图标 - 亮色主题
 */
export const SunIcon: React.FC<SVGIconProps> = (props) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    onClick={props.onClick}
    style={{ color: props.color }}
  >
    <circle
      cx="12"
      cy="12"
      r="5"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M12 1V3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 21V23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4.22 4.22L5.64 5.64"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18.36 18.36L19.78 19.78"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M1 12H3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M21 12H23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4.22 19.78L5.64 18.36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18.36 5.64L19.78 4.22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 月亮图标 - 暗色主题
 */
export const MoonIcon: React.FC<SVGIconProps> = (props) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    onClick={props.onClick}
    style={{ color: props.color }}
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </svg>
);

/**
 * 主题切换图标 - 动态切换
 */
export interface ThemeToggleIconProps extends SVGIconProps {
  /** 是否为暗色主题 */
  isDark?: boolean;
  /** 是否启用动画 */
  animated?: boolean;
}

export const ThemeToggleIcon: React.FC<ThemeToggleIconProps> = ({
  isDark = false,
  animated = true,
  size = 24,
  ...props
}) => {
  const animationClass = animated ? 'transition-transform duration-500' : '';

  return (
    <div className={`relative ${animationClass}`}>
      {isDark ? (
        <MoonIcon size={size} {...props} />
      ) : (
        <SunIcon size={size} {...props} />
      )}
    </div>
  );
};

/**
 * 系统主题图标
 */
export const SystemThemeIcon: React.FC<SVGIconProps> = (props) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    onClick={props.onClick}
    style={{ color: props.color }}
  >
    <rect
      x="2"
      y="3"
      width="20"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M8 21H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 17V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 自动主题图标
 */
export const AutoThemeIcon: React.FC<SVGIconProps> = (props) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    onClick={props.onClick}
    style={{ color: props.color }}
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 调色板图标 - 自定义主题
 */
export const PaletteIcon: React.FC<SVGIconProps> = (props) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    onClick={props.onClick}
    style={{ color: props.color }}
  >
    <circle
      cx="13.5"
      cy="6.5"
      r="0.5"
      fill="currentColor"
    />
    <circle
      cx="17.5"
      cy="10.5"
      r="0.5"
      fill="currentColor"
    />
    <circle
      cx="8.5"
      cy="7.5"
      r="0.5"
      fill="currentColor"
    />
    <circle
      cx="6.5"
      cy="12.5"
      r="0.5"
      fill="currentColor"
    />
    <path
      d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M22 12C22 6.5 17.5 2 12 2C17.5 2 22 6.5 22 12Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

/**
 * 对比度图标
 */
export const ContrastIcon: React.FC<SVGIconProps> = (props) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
    onClick={props.onClick}
    style={{ color: props.color }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22V2Z"
      fill="currentColor"
      fillOpacity="0.3"
    />
  </svg>
);

export default {
  SunIcon,
  MoonIcon,
  ThemeToggleIcon,
  SystemThemeIcon,
  AutoThemeIcon,
  PaletteIcon,
  ContrastIcon,
};
