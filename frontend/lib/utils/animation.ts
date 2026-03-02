/**
 * Animation Utils - 动画工具函数
 * 提供常用的动画配置和工具
 */

import { Variants, Transition } from 'framer-motion';

// ==================== 动画变体 ====================

/**
 * 淡入动画
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * 滑入动画（从下方）
 */
export const slideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * 滑入动画（从左方）
 */
export const slideInLeft: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * 滑入动画（从右方）
 */
export const slideInRight: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * 缩放动画
 */
export const scale: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * 旋转动画
 */
export const rotate: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

/**
 * 弹跳动画
 */
export const bounce: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [0, -20, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

/**
 * 脉冲动画
 */
export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * 闪烁动画
 */
export const blink: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: [1, 0, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};

/**
 * 故障效果动画
 */
export const glitch: Variants = {
  hidden: { x: 0 },
  visible: {
    x: [0, -2, 2, -2, 2, 0],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
};

/**
 * 打字机效果
 */
export const typewriter = {
  hidden: { width: 0 },
  visible: (width: number) => ({
    width,
    transition: {
      duration: 2,
      ease: 'linear',
    },
  }),
};

/**
 * 列表项动画（用于列表项的顺序显示）
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

// ==================== 动画过渡配置 ====================

export const transitions: Record<string, Transition> = {
  fast: { duration: 0.2 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
  smooth: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  },
};

// ==================== 动画工具函数 ====================

/**
 * 生成延迟动画
 */
export function delayedAnimation(delay: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };
}

/**
 * 生成循环动画
 */
export function loopingAnimation(
  animation: 'pulse' | 'bounce' | 'rotate' | 'blink',
  duration: number = 2
) {
  const animations = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
    bounce: {
      y: [0, -20, 0],
    },
    rotate: {
      rotate: [0, 360],
    },
    blink: {
      opacity: [1, 0, 1],
    },
  };

  return {
    animate: animations[animation],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };
}

/**
 * 获取随机延迟
 */
export function getRandomDelay(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

/**
 * 获取随机持续时间
 */
export function getRandomDuration(min: number = 0.3, max: number = 0.6): number {
  return Math.random() * (max - min) + min;
}

/**
 * 创建弹性动画
 */
export function createSpringAnimation(
  stiffness: number = 300,
  damping: number = 30
): Transition {
  return {
    type: 'spring',
    stiffness,
    damping,
  };
}

/**
 * 创建缓动动画
 */
export function createEasingAnimation(
  duration: number = 0.3,
  ease: string = 'easeInOut'
): Transition {
  return {
    type: 'tween',
    duration,
    ease,
  };
}

// ==================== 路由过渡动画 ====================

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.3,
    ease: 'easeInOut',
  },
};

export const layoutTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
} as const;

// ==================== 悬停效果 ====================

export const hoverScale = {
  scale: 1.05,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
};

export const hoverGlow = {
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
  transition: {
    duration: 0.2,
  },
};

export const tapScale = {
  scale: 0.95,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
};
