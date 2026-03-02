/**
 * CyberPress Icon Factory
 *
 * 动态图标工厂组件，支持动态加载和渲染图标
 *
 * @example
 * ```tsx
 * import { DynamicIcon } from '@/components/graphics/IconFactory';
 *
 * <DynamicIcon name="home" size={24} />
 * <DynamicIcon name="github" size={32} variant="purple" />
 * ```
 */

import React from 'react';
import { getIconByName, SVGIconProps, IconName } from './index';

export interface DynamicIconProps extends Omit<SVGIconProps, 'onClick'> {
  /** 图标名称 */
  name: IconName | string;
  /** 点击事件 */
  onClick?: () => void;
  /** 图标未找到时的替代图标 */
  fallback?: React.ReactNode;
  /** 是否显示加载状态 */
  loading?: boolean;
}

/**
 * 动态图标组件
 * 根据名称动态加载和渲染图标
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  fallback = <span>❓</span>,
  loading = false,
  ...props
}) => {
  const IconComponent = getIconByName(name);

  if (loading) {
    return (
      <div
        className="animate-pulse bg-cyber-muted/30 rounded"
        style={{ width: props.size, height: props.size }}
      />
    );
  }

  if (!IconComponent) {
    return <span {...props}>{fallback}</span>;
  }

  return <IconComponent {...props} />;
};

// ==================== 图标组组件 ====================

export interface IconGroupProps {
  /** 图标列表 */
  icons: Array<{ name: IconName | string; props?: SVGIconProps }>;
  /** 图标间距 */
  gap?: number;
  /** 容器类名 */
  className?: string;
}

/**
 * 图标组组件
 * 用于渲染一组图标
 */
export const IconGroup: React.FC<IconGroupProps> = ({
  icons,
  gap = 2,
  className = ''
}) => {
  return (
    <div className={`flex gap-${gap} ${className}`.trim()}>
      {icons.map((icon, index) => (
        <DynamicIcon key={index} name={icon.name} {...icon.props} />
      ))}
    </div>
  );
};

// ==================== 图标按钮组件 ====================

export interface IconButtonProps extends SVGIconProps {
  /** 图标名称 */
  name: IconName | string;
  /** 按钮文本 */
  label?: string;
  /** 按钮样式变体 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** 按钮尺寸 */
  buttonSize?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 图标按钮组件
 * 结合图标和按钮的组件
 */
export const IconButton: React.FC<IconButtonProps> = ({
  name,
  label,
  variant = 'ghost',
  buttonSize = 'md',
  disabled = false,
  loading = false,
  size = 24,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 border border-cyber-cyan/30',
    secondary: 'bg-cyber-purple/10 text-cyber-purple hover:bg-cyber-purple/20 border border-cyber-purple/30',
    ghost: 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/5',
    danger: 'bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20 border border-cyber-red/30',
  };

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg transition-all duration-200 ${sizeClasses[buttonSize]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <DynamicIcon name={name} size={size} />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};

// ==================== 图标徽章组件 ====================

export interface IconBadgeProps {
  /** 图标名称 */
  name: IconName | string;
  /** 徽章内容 */
  badge?: string | number;
  /** 徽章位置 */
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** 徽章颜色 */
  badgeColor?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
  /** 图标属性 */
  iconProps?: SVGIconProps;
}

/**
 * 图标徽章组件
 * 带有徽章通知的图标
 */
export const IconBadge: React.FC<IconBadgeProps> = ({
  name,
  badge,
  badgePosition = 'top-right',
  badgeColor = 'red',
  iconProps = {}
}) => {
  const positionClasses = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
  };

  const colorClasses = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-cyber-green',
    yellow: 'bg-cyber-yellow',
    red: 'bg-cyber-red',
  };

  return (
    <div className="relative inline-flex">
      <DynamicIcon name={name} {...iconProps} />
      {badge && (
        <span
          className={`absolute ${positionClasses[badgePosition]} ${colorClasses[badgeColor]} text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

// ==================== 图标工具函数 ====================

/**
 * 获取图标颜色类
 */
export const getIconColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    green: 'text-cyber-green',
    yellow: 'text-cyber-yellow',
    red: 'text-cyber-red',
  };
  return colorMap[color] || 'text-current';
};

/**
 * 获取图标尺寸
 */
export const getIconSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): number => {
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };
  return sizeMap[size] || 24;
};

export default {
  DynamicIcon,
  IconGroup,
  IconButton,
  IconBadge,
  getIconColorClass,
  getIconSize,
};
