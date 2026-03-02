/**
 * CyberPress Themed Icons
 *
 * 主题感知图标组件，根据当前主题自动调整颜色和样式
 *
 * @example
 * ```tsx
 * <ThemedIcon name="cpu" lightColor="#0066ff" darkColor="#00f0ff" />
 * <AutoThemedIcon name="bot" variant="primary" />
 * <ThemeToggleIcon />
 * ```
 */

import React, { useContext } from 'react';
import { DynamicIcon } from './IconFactory';
import { useTheme } from '../providers/ThemeProvider';

// ==================== 类型定义 ====================

export type ThemeColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemedIconProps {
  /** 图标名称 */
  name: string;
  /** 浅色主题颜色 */
  lightColor?: string;
  /** 深色主题颜色 */
  darkColor?: string;
  /** 图标尺寸 */
  size?: number;
  /** 额外的类名 */
  className?: string;
  /** 是否应用发光效果 */
  glow?: boolean;
}

export interface AutoThemedIconProps {
  /** 图标名称 */
  name: string;
  /** 颜色变体 */
  variant?: ThemeColor;
  /** 图标尺寸 */
  size?: number;
  /** 额外的类名 */
  className?: string;
  /** 是否应用发光效果 */
  glow?: boolean;
  /** 发光强度 */
  glowIntensity?: 'soft' | 'medium' | 'strong';
}

// ==================== 主题图标 ====================

/**
 * 主题感知图标组件
 * 根据当前主题自动切换颜色
 */
export const ThemedIcon: React.FC<ThemedIconProps> = ({
  name,
  lightColor = '#0066ff',
  darkColor = '#00f0ff',
  size = 24,
  className = '',
  glow = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const color = isDark ? darkColor : lightColor;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        transition-all duration-300
        ${className}
      `.trim()}
      style={{
        color,
        filter: glow ? `drop-shadow(0 0 ${size / 6}px ${color})` : undefined,
      }}
    >
      <DynamicIcon name={name} size={size} />
    </span>
  );
};

// ==================== 自动主题图标 ====================

/**
 * 自动主题图标组件
 * 使用预设的主题颜色变体
 */
export const AutoThemedIcon: React.FC<AutoThemedIconProps> = ({
  name,
  variant = 'primary',
  size = 24,
  className = '',
  glow = false,
  glowIntensity = 'medium'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 主题颜色配置
  const themeColors = {
    light: {
      primary: '#0066ff',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      primary: '#00f0ff',
      secondary: '#9d00ff',
      accent: '#ff0080',
      success: '#00ff88',
      warning: '#f0ff00',
      error: '#ff4444',
      info: '#00d4ff',
    },
  };

  const color = themeColors[isDark ? 'dark' : 'light'][variant];

  const glowIntensityMap = {
    soft: size / 10,
    medium: size / 6,
    strong: size / 4,
  };

  const glowBlur = glowIntensityMap[glowIntensity];

  return (
    <span
      className={`
        inline-flex items-center justify-center
        transition-all duration-300
        ${className}
      `.trim()}
      style={{
        color,
        filter: glow ? `drop-shadow(0 0 ${glowBlur}px ${color})` : undefined,
      }}
    >
      <DynamicIcon name={name} size={size} />
    </span>
  );
};

// ==================== 主题切换图标 ====================

export interface ThemeToggleIconProps {
  /** 图标尺寸 */
  size?: number;
  /** 浅色模式图标 */
  lightIcon?: string;
  /** 深色模式图标 */
  darkIcon?: string;
  /** 自动模式图标 */
  autoIcon?: string;
  /** 额外的类名 */
  className?: string;
  /** 是否显示旋转动画 */
  animated?: boolean;
}

/**
 * 主题切换图标组件
 * 显示当前主题对应的图标
 */
export const ThemeToggleIcon: React.FC<ThemeToggleIconProps> = ({
  size = 24,
  lightIcon = 'sun',
  darkIcon = 'moon',
  autoIcon = 'settings',
  className = '',
  animated = true
}) => {
  const { theme, toggleTheme } = useTheme();

  const getIconForTheme = () => {
    switch (theme) {
      case 'light':
        return lightIcon;
      case 'dark':
        return darkIcon;
      case 'auto':
        return autoIcon;
      default:
        return autoIcon;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center justify-center
        p-2 rounded-lg
        bg-cyber-dark/50 hover:bg-cyber-purple/10
        border border-gray-700 hover:border-cyber-purple
        transition-all duration-300
        ${animated ? 'hover:rotate-180' : ''}
        ${className}
      `.trim()}
      title={`Current theme: ${theme}`}
    >
      <DynamicIcon name={getIconForTheme()} size={size} />
    </button>
  );
};

// ==================== 主题感知图标组 ====================

export interface ThemedIconGroupProps {
  /** 图标列表 */
  icons: Array<{
    name: string;
    lightColor?: string;
    darkColor?: string;
    variant?: ThemeColor;
    label?: string;
  }>;
  /** 图标尺寸 */
  size?: number;
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical';
  /** 间距 */
  gap?: number;
  /** 额外的类名 */
  className?: string;
}

/**
 * 主题感知图标组组件
 * 一组自动适应主题的图标
 */
export const ThemedIconGroup: React.FC<ThemedIconGroupProps> = ({
  icons,
  size = 24,
  direction = 'horizontal',
  gap = 4,
  className = ''
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`
        flex
        ${direction === 'horizontal' ? 'flex-row' : 'flex-col'}
        gap-${gap}
        ${className}
      `.trim()}
    >
      {icons.map((icon, index) => {
        const color = icon.variant
          ? undefined // AutoThemedIcon will handle
          : (theme === 'dark' ? icon.darkColor : icon.lightColor);

        return (
          <div
            key={index}
            className="flex flex-col items-center gap-2 group"
          >
            {icon.variant ? (
              <AutoThemedIcon
                name={icon.name}
                variant={icon.variant}
                size={size}
                glow
              />
            ) : (
              <ThemedIcon
                name={icon.name}
                lightColor={icon.lightColor}
                darkColor={icon.darkColor}
                size={size}
                glow
              />
            )}
            {icon.label && (
              <span className="text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {icon.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ==================== 主题状态图标 ====================

export interface ThemeStatusIconProps {
  /** 图标名称 */
  name: string;
  /** 状态类型 */
  status?: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning';
  /** 图标尺寸 */
  size?: number;
  /** 额外的类名 */
  className?: string;
  /** 是否显示脉冲动画 */
  pulse?: boolean;
}

/**
 * 主题状态图标组件
 * 根据状态类型显示不同颜色和效果
 */
export const ThemeStatusIcon: React.FC<ThemeStatusIconProps> = ({
  name,
  status = 'active',
  size = 24,
  className = '',
  pulse = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 状态颜色配置
  const statusColors = {
    light: {
      active: '#0066ff',
      inactive: '#9ca3af',
      pending: '#f59e0b',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
    },
    dark: {
      active: '#00f0ff',
      inactive: '#6b7280',
      pending: '#f0ff00',
      success: '#00ff88',
      error: '#ff4444',
      warning: '#f0ff00',
    },
  };

  const color = statusColors[isDark ? 'dark' : 'light'][status];

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `.trim()}
      style={{
        color,
        filter: `drop-shadow(0 0 ${size / 8}px ${color})`,
      }}
    >
      <DynamicIcon name={name} size={size} />
    </span>
  );
};

// ==================== 主题感知按钮图标 ====================

export interface ThemedIconButtonProps {
  /** 图标名称 */
  name: string;
  /** 按钮文本 */
  label?: string;
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  /** 按钮尺寸 */
  buttonSize?: 'sm' | 'md' | 'lg';
  /** 图标位置 */
  iconPosition?: 'left' | 'right' | 'only';
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件 */
  onClick?: () => void;
  /** 额外的类名 */
  className?: string;
}

/**
 * 主题感知按钮图标组件
 * 自动适应主题的图标按钮
 */
export const ThemedIconButton: React.FC<ThemedIconButtonProps> = ({
  name,
  label,
  variant = 'primary',
  buttonSize = 'md',
  iconPosition = 'left',
  disabled = false,
  onClick,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeMap = {
    sm: { icon: 16, padding: 'px-3 py-1.5', text: 'text-sm' },
    md: { icon: 20, padding: 'px-4 py-2', text: 'text-base' },
    lg: { icon: 24, padding: 'px-6 py-3', text: 'text-lg' },
  };

  const size = sizeMap[buttonSize];

  const variantStyles = {
    primary: isDark
      ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan hover:bg-cyber-cyan/20'
      : 'bg-blue-500/10 text-blue-500 border-blue-500 hover:bg-blue-500/20',
    secondary: isDark
      ? 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple hover:bg-cyber-purple/20'
      : 'bg-purple-500/10 text-purple-500 border-purple-500 hover:bg-purple-500/20',
    ghost: isDark
      ? 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/5 border-transparent'
      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-500/5 border-transparent',
    outline: isDark
      ? 'text-gray-300 border-gray-600 hover:border-cyber-cyan hover:text-cyber-cyan'
      : 'text-gray-700 border-gray-400 hover:border-blue-500 hover:text-blue-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        border rounded-lg transition-all duration-200
        ${size.padding} ${size.text}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `.trim()}
    >
      {iconPosition !== 'right' && (
        <DynamicIcon name={name} size={size.icon} />
      )}
      {label && iconPosition !== 'only' && (
        <span>{label}</span>
      )}
      {iconPosition === 'right' && (
        <DynamicIcon name={name} size={size.icon} />
      )}
    </button>
  );
};

// ==================== 导出所有组件 ====================

export default {
  ThemedIcon,
  AutoThemedIcon,
  ThemeToggleIcon,
  ThemedIconGroup,
  ThemeStatusIcon,
  ThemedIconButton,
};
