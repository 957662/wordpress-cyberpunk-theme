// CyberPress Icon Utilities

/**
 * 图标颜色类型
 */
export type IconColor =
  | 'cyan'
  | 'purple'
  | 'pink'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'white'
  | 'gray';

/**
 * 图标尺寸类型
 */
export type IconSize = 16 | 20 | 24 | 32 | 48 | 64 | 96 | 128;

/**
 * 颜色映射表
 */
const COLOR_MAP: Record<IconColor, string> = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
  orange: '#ff6600',
  white: '#ffffff',
  gray: '#6a6a8a',
};

/**
 * Tailwind 类名映射表
 */
const TAILWIND_COLOR_MAP: Record<IconColor, string> = {
  cyan: 'text-cyber-cyan',
  purple: 'text-cyber-purple',
  pink: 'text-cyber-pink',
  yellow: 'text-cyber-yellow',
  green: 'text-cyber-green',
  orange: 'text-cyber-orange',
  white: 'text-white',
  gray: 'text-cyber-gray',
};

/**
 * 获取图标颜色值
 * @param color 颜色类型
 * @returns 颜色值（十六进制）
 */
export function getIconColor(color: IconColor = 'cyan'): string {
  return COLOR_MAP[color];
}

/**
 * 获取图标 Tailwind 类名
 * @param color 颜色类型
 * @returns Tailwind 类名
 */
export function getIconTailwindClass(color: IconColor = 'cyan'): string {
  return TAILWIND_COLOR_MAP[color];
}

/**
 * 图标基础 props 接口
 */
export interface BaseIconProps {
  /** 图标尺寸（像素） */
  size?: IconSize | number;
  /** 自定义类名 */
  className?: string;
  /** 图标颜色 */
  color?: IconColor;
  /** 是否有发光效果 */
  glow?: boolean;
}

/**
 * 获取图标尺寸和类名
 * @param size 尺寸
 * @param className 自定义类名
 * @param color 颜色
 * @param glow 是否发光
 * @returns 处理后的属性对象
 */
export function getIconAttrs({
  size = 24,
  className = '',
  color = 'cyan',
  glow = false,
}: BaseIconProps) {
  const colorClass = getIconTailwindClass(color);
  const glowClass = glow ? 'drop-shadow-[0_0_8px_currentColor]' : '';
  const combinedClassName = `${colorClass} ${glowClass} ${className}`.trim();

  return {
    width: size,
    height: size,
    className: combinedClassName,
  };
}
