/**
 * Animation Utilities
 * 动画工具函数集
 */

import { Variants, Transition } from 'framer-motion';

/**
 * 常用动画变体
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const scaleOut: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.1 },
};

export const slideInFromBottom: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0 },
  exit: { y: '100%' },
};

export const slideInFromTop: Variants = {
  hidden: { y: '-100%' },
  visible: { y: 0 },
  exit: { y: '-100%' },
};

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -180 },
  visible: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: -180 },
};

export const flip: Variants = {
  hidden: { rotateY: 90 },
  visible: { rotateY: 0 },
  exit: { rotateY: 90 },
};

/**
 * 列表项动画
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * 弹性过渡
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
};

export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 10,
};

/**
 * 缓动过渡
 */
export const easeInOut: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

export const easeOut: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
};

export const customEasing = (easing: number[]): Transition => ({
  type: 'tween',
  ease: easing,
  duration: 0.3,
});

/**
 * 常用缓动函数
 */
export const easings = {
  // Cubic
  easeInCubic: [0.32, 0, 0.67, 0] as const,
  easeOutCubic: [0.33, 1, 0.68, 1] as const,
  easeInOutCubic: [0.65, 0, 0.35, 1] as const,

  // Quart
  easeInQuart: [0.69, 0, 0.78, 0.02] as const,
  easeOutQuart: [0.22, 1, 0.36, 1] as const,
  easeInOutQuart: [0.77, 0, 0.175, 1] as const,

  // Quint
  easeInQuint: [0.86, 0, 0.07, 1] as const,
  easeOutQuint: [0.23, 1, 0.32, 1] as const,
  easeInOutQuint: [0.83, 0, 0.17, 1] as const,

  // Expo
  easeInExpo: [0.95, 0.05, 0.795, 0.035] as const,
  easeOutExpo: [0.19, 1, 0.22, 1] as const,
  easeInOutExpo: [1, 0, 0, 1] as const,

  // Circ
  easeInCirc: [0.6, 0.04, 0.98, 0.335] as const,
  easeOutCirc: [0.075, 0.82, 0.165, 1] as const,
  easeInOutCirc: [0.785, 0.135, 0.15, 0.86] as const,

  // Back
  easeInBack: [0.6, -0.28, 0.735, 0.045] as const,
  easeOutBack: [0.175, 0.885, 0.32, 1.275] as const,
  easeInOutBack: [0.68, -0.6, 0.32, 1.6] as const,
};

/**
 * 创建交错动画
 */
export function createStagger(
  delay: number = 0.1,
  direction: 1 | -1 = 1
): Transition {
  return {
    delayChildren: delay,
    staggerChildren: delay,
    staggerDirection: direction,
  };
}

/**
 * 赛博朋克风格动画
 */
export const glitchAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: { opacity: 0 },
};

export const neonGlow: Variants = {
  hidden: { opacity: 0, filter: 'brightness(0.5)' },
  visible: {
    opacity: 1,
    filter: 'brightness(1) drop-shadow(0 0 10px currentColor)',
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    filter: 'brightness(0.5)',
  },
};

export const scanline: Variants = {
  hidden: { y: '-100%' },
  visible: {
    y: '100%',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const hologram: Variants = {
  hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
  visible: {
    opacity: [0.5, 1, 0.5],
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      opacity: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(10px)',
  },
};

export const dataStream: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: '100%',
    opacity: [0, 1, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * 文本动画
 */
export const textReveal: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.05,
    },
  }),
};

export const typewriter: Variants = {
  hidden: { width: 0 },
  visible: {
    width: 'auto',
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * 路径动画
 */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: 'spring', duration: 1.5, bounce: 0 },
      opacity: { duration: 0.1 },
    },
  },
  exit: {
    pathLength: 0,
    opacity: 0,
  },
};

/**
 * 3D 变换动画
 */
export const flip3D: Variants = {
  hidden: { rotateY: -90, opacity: 0 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    rotateY: 90,
    opacity: 0,
  },
};

export const card3D: Variants = {
  hidden: { rotateX: 90, opacity: 0 },
  visible: {
    rotateX: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20,
    },
  },
  exit: {
    rotateX: -90,
    opacity: 0,
  },
};

/**
 * 粒子动画
 */
export const particleFloat: Variants = {
  hidden: { y: 0, opacity: 0 },
  visible: (i: number) => ({
    y: [0, -20, 0],
    opacity: [0, 1, 0.5],
    transition: {
      delay: i * 0.1,
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
};

/**
 * 加载动画
 */
export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const spin: Variants = {
  hidden: { rotate: 0 },
  visible: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const bounce: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [0, -20, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * 自定义动画创建器
 */
export function createAnimation(
  from: any,
  to: any,
  options?: Transition
): Variants {
  return {
    hidden: from,
    visible: {
      ...to,
      transition: options || {},
    },
    exit: from,
  };
}
