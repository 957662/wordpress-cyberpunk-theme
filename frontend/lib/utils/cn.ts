import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名的工具函数
 * 
 * @example
 * cn('px-2 py-1', 'bg-red-500') // 'px-2 py-1 bg-red-500'
 * cn({ 'bg-red-500': true, 'text-blue-500': false }) // 'bg-red-500'
 * cn('text-lg', someCondition && 'font-bold') // 根据条件合并
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 响应式类名合并
 * 
 * @example
 * cnResponsive({
 *   base: 'px-4 py-2',
 *   sm: 'px-6 py-3',
 *   md: 'px-8 py-4',
 *   lg: 'px-10 py-5',
 * }) // 'px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5'
 */
export function cnResponsive(classes: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}) {
  const responsive: string[] = [];

  if (classes.base) responsive.push(classes.base);
  if (classes.sm) responsive.push(`sm:${classes.sm}`);
  if (classes.md) responsive.push(`md:${classes.md}`);
  if (classes.lg) responsive.push(`lg:${classes.lg}`);
  if (classes.xl) responsive.push(`xl:${classes.xl}`);
  if (classes['2xl']) responsive.push(`2xl:${classes['2xl']}`);

  return responsive.join(' ');
}

/**
 * 条件类名合并
 * 
 * @example
 * cnConditional('base-class', {
 *   'active-class': isActive,
 *   'disabled-class': isDisabled,
 * })
 */
export function cnConditional(
  base: string,
  conditions: Record<string, boolean>
) {
  const conditionalClasses = Object.entries(conditions)
    .filter(([_, condition]) => condition)
    .map(([className]) => className)
    .join(' ');

  return cn(base, conditionalClasses);
}

/**
 * 动画类名生成器
 */
export function cnAnimation(
  type: 'fade' | 'slide' | 'scale' | 'bounce',
  direction?: 'up' | 'down' | 'left' | 'right'
) {
  const animations = {
    fade: 'animate-fade-in',
    slide: `animate-slide-${direction || 'up'}`,
    scale: 'animate-scale-in',
    bounce: 'animate-bounce-in',
  };

  return animations[type];
}
