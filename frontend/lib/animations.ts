/**
 * Animation Utilities
 * 动画工具函数
 */

import { Variants, Transition } from 'framer-motion';

/**
 * 创建淡入动画
 */
export function fadeIn(duration: number = 0.5): Transition {
  return {
    duration,
    ease: 'easeOut',
  };
}

/**
 * 创建滑入动画
 */
export function slideIn(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 50
): Variants {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const value = direction === 'right' || direction === 'down' ? distance : -distance;

  return {
    hidden: {
      opacity: 0,
      [axis]: value,
    },
    visible: {
      opacity: 1,
      [axis]: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };
}

/**
 * 创建缩放动画
 */
export function scaleIn(initialScale: number = 0.9): Variants {
  return {
    hidden: {
      opacity: 0,
      scale: initialScale,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };
}

/**
 * 创建交错动画
 */
export function stagger(
  staggerDelay: number = 0.1,
  fadeIn: boolean = true
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: fadeIn ? 0.2 : 0,
      },
    },
  };
}

/**
 * 列表项动画
 */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/**
 * 模态框动画
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * 侧边栏动画
 */
export const sidebarVariants: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * 页面过渡动画
 */
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

/**
 * 悬停效果
 */
export const hoverEffects = {
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },
  lift: {
    whileHover: { y: -4 },
    whileTap: { y: 0 },
    transition: { duration: 0.2 },
  },
  glow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
    },
    transition: { duration: 0.2 },
  },
};
