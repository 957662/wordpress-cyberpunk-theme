/**
 * 动画工具函数
 */

/**
 * 缓动函数类型
 */
export type EasingFunction = (t: number) => number;

/**
 * 缓动函数集合
 */
export const easings: Record<string, EasingFunction> = {
  // 线性
  linear: (t) => t,

  // Quad
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Quart
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),

  // Quint
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,

  // Sine
  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  // Expo
  easeInExpo: (t) => (t === 0 ? 0 : Math.pow(1024, t - 1)),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  // Circ
  easeInCirc: (t) => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: (t) => Math.sqrt(1 - --t * t),
  easeInOutCirc: (t) =>
    t < 0.5
      ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,

  // Back
  easeInBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  // Elastic
  easeInElastic: (t) => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3));
  },
  easeOutElastic: (t) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  easeInOutElastic: (t) => {
    if (t === 0 || t === 1) return t;
    if (t < 0.5) {
      return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) / 2;
    }
    return (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) / 2 + 1;
  },

  // Bounce
  easeInBounce: (t) => 1 - easings.easeOutBounce(1 - t),
  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInOutBounce: (t) =>
    t < 0.5
      ? (1 - easings.easeOutBounce(1 - 2 * t)) / 2
      : (1 + easings.easeOutBounce(2 * t - 1)) / 2,
};

/**
 * 应用缓动函数
 */
export function applyEasing(
  progress: number,
  easing: keyof typeof easings | EasingFunction = 'easeOutQuad'
): number {
  if (typeof easing === 'function') {
    return easing(progress);
  }
  return easings[easing](progress);
}

/**
 * 动画值插值
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  duration?: number;
  easing?: keyof typeof easings | EasingFunction;
  delay?: number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

/**
 * 创建动画
 */
export function createAnimation(config: AnimationConfig): {
  start: () => void;
  cancel: () => void;
} {
  const {
    duration = 300,
    easing = 'easeOutQuad',
    delay = 0,
    onUpdate,
    onComplete,
  } = config;

  let startTime: number | null = null;
  let rafId: number | null = null;
  let timeoutId: number | null = null;

  const animate = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = applyEasing(progress, easing);

    onUpdate?.(easedProgress);

    if (progress < 1) {
      rafId = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };

  const start = () => {
    if (delay > 0) {
      timeoutId = window.setTimeout(() => {
        rafId = requestAnimationFrame(animate);
      }, delay);
    } else {
      rafId = requestAnimationFrame(animate);
    }
  };

  const cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    startTime = null;
  };

  return { start, cancel };
}

/**
 * 数字动画
 */
export function animateValue(
  from: number,
  to: number,
  config: Omit<AnimationConfig, 'onUpdate'>
): { start: () => void; cancel: () => void } {
  return createAnimation({
    ...config,
    onUpdate: (progress) => {
      const value = lerp(from, to, progress);
      config.onUpdate?.(value);
    },
  });
}

/**
 * 帧动画
 */
export function frameAnimation(
  frames: number[],
  duration: number,
  onUpdate: (frame: number) => void
): { start: () => void; cancel: () => void } {
  const frameDuration = duration / frames.length;
  let currentIndex = 0;
  let intervalId: number | null = null;

  const start = () => {
    intervalId = window.setInterval(() => {
      if (currentIndex >= frames.length) {
        cancel();
        return;
      }
      onUpdate(frames[currentIndex]);
      currentIndex++;
    }, frameDuration);
  };

  const cancel = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    currentIndex = 0;
  };

  return { start, cancel };
}
