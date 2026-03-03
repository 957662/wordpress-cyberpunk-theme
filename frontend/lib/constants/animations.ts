/**
 * CyberPress 动画配置
 * Framer Motion 动画预设
 */

import { Variants, Transition } from 'framer-motion';

// 淡入动画
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// 滑入动画
export const slideIn = {
  up: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
};

// 缩放动画
export const scale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

// 旋转动画
export const rotate: Variants = {
  hidden: { opacity: 0, rotate: -180 },
  visible: { opacity: 1, rotate: 0 },
};

// 弹跳动画
export const bounce: Variants = {
  hidden: { opacity: 0, y: -100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.5,
    },
  },
};

// 故障效果动画
export const glitch: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.3,
      times: [0, 0.2, 0.4, 0.6, 1],
    },
  },
};

// 打字机动画
export const typewriter = {
  hidden: { width: 0 },
  visible: (width: string) => ({
    width,
    transition: {
      duration: 2,
      ease: 'linear',
    },
  }),
};

// 列表项动画
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// 路由过渡动画
export const pageTransition: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
    },
  },
};

// 悬停效果
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

export const hoverGlow = {
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
  transition: { duration: 0.2 },
};

// 默认过渡配置
export const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// 赛博朋克风格动画预设
export const cyberPresets = {
  neonGlow: {
    initial: { boxShadow: '0 0 5px rgba(0, 240, 255, 0.3)' },
    animate: {
      boxShadow: [
        '0 0 5px rgba(0, 240, 255, 0.3)',
        '0 0 20px rgba(0, 240, 255, 0.6)',
        '0 0 5px rgba(0, 240, 255, 0.3)',
      ],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  scanLine: {
    animate: {
      y: ['-100%', '100%'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [0.95, 1, 0.95],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  glitchEffect: {
    whileHover: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.3,
      },
    },
  },
};
