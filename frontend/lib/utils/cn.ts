/**
 * CyberPress Platform - Classname Utilities
 * 类名工具函数
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名
 * 使用 clsx 和 tailwind-merge 来智能合并类名
 * 
 * @param inputs - 类名数组
 * @returns 合并后的类名字符串
 * 
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('text-red-500', someCondition && 'text-blue-500') // 根据条件合并
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成随机类名
 * 用于生成唯一的 CSS 类名
 * 
 * @param prefix - 类名前缀
 * @returns 随机类名
 */
export function randomClass(prefix = 'cyber'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 检查是否包含某个类名
 * 
 * @param className - 类名字符串
 * @param target - 目标类名
 * @returns 是否包含
 */
export function hasClass(className: string, target: string): boolean {
  return className.split(' ').includes(target);
}

/**
 * 移除类名
 * 
 * @param className - 类名字符串
 * @param toRemove - 要移除的类名
 * @returns 新的类名字符串
 */
export function removeClass(className: string, toRemove: string): string {
  return className
    .split(' ')
    .filter((cls) => cls !== toRemove)
    .join(' ');
}

/**
 * 添加类名
 * 
 * @param className - 类名字符串
 * @param toAdd - 要添加的类名
 * @returns 新的类名字符串
 */
export function addClass(className: string, toAdd: string): string {
  const classes = className.split(' ');
  if (!classes.includes(toAdd)) {
    classes.push(toAdd);
  }
  return classes.join(' ');
}
