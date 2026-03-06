/**
 * CyberPress Icons - 类型定义
 */

/**
 * 基础图标属性
 */
export interface IconProps {
  /**
   * 图标尺寸（像素）
   * @default 24
   */
  size?: number;

  /**
   * 自定义类名
   * 可以使用 Tailwind CSS 类来控制颜色、动画等
   * @example "text-cyber-cyan hover:text-cyber-purple"
   */
  className?: string;

  /**
   * 图标颜色（用于 stroke 或 fill）
   * @default "currentColor"
   */
  color?: string;

  /**
   * 描边宽度
   * @default 2
   */
  strokeWidth?: number;

  /**
   * 是否启用霓虹发光效果
   * @default true
   */
  glow?: boolean;

  /**
   * 无障碍标签
   */
  ariaLabel?: string;
}

/**
 * 可填充图标属性
 */
export interface FillableIconProps extends IconProps {
  /**
   * 是否填充图标
   * @default false
   */
  filled?: boolean;
}

/**
 * 方向性图标属性
 */
export interface DirectionalIconProps extends IconProps {
  /**
   * 图标方向
   * @default 'right'
   */
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * 主题图标属性
 */
export interface ThemeIconProps extends IconProps {
  /**
   * 主题模式
   */
  mode?: 'light' | 'dark' | 'system';
}

/**
 * 开关图标属性
 */
export interface ToggleIconProps extends IconProps {
  /**
   * 开关状态
   * @default false
   */
  isOpen?: boolean;
  /**
   * 开启时的图标
   */
  openIcon?: React.ReactNode;
  /**
   * 关闭时的图标
   */
  closeIcon?: React.ReactNode;
}
