/**
 * 类名合并工具
 * 使用 clsx 和 tailwind-merge 的组合
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名
 * 自动处理类名冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 带条件的类名合并
 */
export function conditionalClass(condition: boolean, className: string): string {
  return condition ? className : '';
}

/**
 * 构建响应式类名
 */
export function responsiveClass(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  return cn(mobile, tablet, desktop);
}

/**
 * 构建状态类名
 */
export function stateClass(
  base: string,
  states: {
    hover?: string;
    focus?: string;
    active?: string;
    disabled?: string;
  }
): string {
  return cn(
    base,
    states.hover && `hover:${states.hover}`,
    states.focus && `focus:${states.focus}`,
    states.active && `active:${states.active}`,
    states.disabled && `disabled:${states.disabled}`
  );
}

/**
 * 构建尺寸类名
 */
export function sizeClass(
  prefix: string,
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
): string {
  const sizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    full: 'full',
  };
  return `${prefix}-${sizes[size]}`;
}

/**
 * 构建间距类名
 */
export function spacingClass(
  type: 'm' | 'p' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr',
  size: number | string
): string {
  return `${type}-${size}`;
}

/**
 * 构建颜色类名
 */
export function colorClass(
  type: 'text' | 'bg' | 'border',
  color: string,
  shade?: number
): string {
  return shade ? `${type}-${color}-${shade}` : `${type}-${color}`;
}

export default cn;
