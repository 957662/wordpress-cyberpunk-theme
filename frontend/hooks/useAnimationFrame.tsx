import { useEffect, useRef } from 'react';

/**
 * useAnimationFrame Hook
 *
 * 用于创建高性能的动画循环
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const progress = useRef(0);
 *
 *   useAnimationFrame((deltaTime) => {
 *     progress.current += deltaTime * 0.001;
 *     // 更新动画状态
 *   });
 *
 *   return <div style={{ transform: `rotate(${progress.current}deg)` }} />;
 * }
 * ```
 */
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  deps: React.DependencyList = []
) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return requestRef;
}

/**
 * useAnimationLoop Hook
 *
 * 用于创建带帧率控制的动画循环
 *
 * @example
 * ```tsx
 * function GameLoop() {
 *   useAnimationLoop(
 *     () => {
 *       // 游戏逻辑
 *     },
 *     60 // 目标 60 FPS
 *   );
 *
 *   return <div>游戏运行中...</div>;
 * }
 * ```
 */
export function useAnimationLoop(
  callback: () => void,
  fps: number = 60,
  deps: React.DependencyList = []
) {
  const frameInterval = 1000 / fps;
  const lastFrameTime = useRef<number>(0);

  useAnimationFrame(
    (deltaTime) => {
      const now = performance.now();
      const elapsed = now - lastFrameTime.current;

      if (elapsed > frameInterval) {
        lastFrameTime.current = now - (elapsed % frameInterval);
        callback();
      }
    },
    [fps, callback, ...deps]
  );
}

/**
 * useSpringAnimation Hook
 *
 * 用于创建弹簧动画效果
 *
 * @example
 * ```tsx
 * function SpringBox() {
 *   const [value, setValue] = useSpringAnimation(0, {
 *     stiffness: 100,
 *     damping: 10,
 *     mass: 1
 *   });
 *
 *   return (
 *     <div
 *       onClick={() => setValue(100)}
 *       style={{ transform: `translateX(${value}px)` }}
 *     />
 *   );
 * }
 * ```
 */
export function useSpringAnimation(
  initialValue: number,
  config: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  } = {}
): [number, (value: number) => void, boolean] {
  const { stiffness = 100, damping = 10, mass = 1 } = config;

  const current = useRef(initialValue);
  const target = useRef(initialValue);
  const velocity = useRef(0);
  const isAnimating = useRef(false);

  const [value, setValue] = React.useState(initialValue);

  useAnimationFrame(() => {
    const displacement = target.current - current.current;
    const springForce = stiffness * displacement;
    const dampingForce = -damping * velocity.current;
    const acceleration = (springForce + dampingForce) / mass;

    velocity.current += acceleration / 60;
    current.current += velocity.current / 60;

    setValue(current.current);

    // 检查动画是否完成
    if (Math.abs(displacement) < 0.01 && Math.abs(velocity.current) < 0.01) {
      isAnimating.current = false;
      current.current = target.current;
      velocity.current = 0;
    } else {
      isAnimating.current = true;
    }
  }, [stiffness, damping, mass]);

  const setTarget = React.useCallback((newTarget: number) => {
    target.current = newTarget;
    isAnimating.current = true;
  }, []);

  return [value, setTarget, isAnimating.current];
}

import React from 'react';

/**
 * useValueTransition Hook
 *
 * 用于数值平滑过渡
 *
 * @example
 * ```tsx
 * function Counter({ target }: { target: number }) {
 *   const current = useValueTransition(target, 0.1);
 *
 *   return <div>{Math.round(current)}</div>;
 * }
 * ```
 */
export function useValueTransition(
  target: number,
  lerpFactor: number = 0.1
): number {
  const current = useRef(target);

  useAnimationFrame(() => {
    const diff = target - current.current;
    if (Math.abs(diff) > 0.001) {
      current.current += diff * lerpFactor;
    } else {
      current.current = target;
    }
  }, [target, lerpFactor]);

  return current.current;
}

/**
 * useTime Hook
 *
 * 获取动画时间戳
 *
 * @example
 * ```tsx
 * function TimeDisplay() {
 *   const time = useTime();
 *
 *   return <div>{time.toFixed(0)}ms</div>;
 * }
 * ```
 */
export function useTime(): number {
  const [time, setTime] = React.useState(0);

  useAnimationFrame((deltaTime) => {
    setTime((prev) => prev + deltaTime);
  }, []);

  return time;
}

/**
 * useFPS Hook
 *
 * 监控当前帧率
 *
 * @example
 * ```tsx
 * function FPSCounter() {
 *   const fps = useFPS();
 *
 *   return <div>FPS: {fps.toFixed(1)}</div>;
 * }
 * ```
 */
export function useFPS(): number {
  const [fps, setFPS] = React.useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useAnimationFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    if (elapsed >= 1000) {
      setFPS((frameCount.current / elapsed) * 1000);
      frameCount.current = 0;
      lastTime.current = now;
    }
  }, []);

  return fps;
}

/**
 * useTween Hook
 *
 * 缓动动画
 *
 * @example
 * ```tsx
 * function FadeIn() {
 *   const opacity = useTween({
 *     from: 0,
 *     to: 1,
 *     duration: 1000,
 *     easing: (t) => t * (2 - t) // easeOutQuad
 *   });
 *
 *   return <div style={{ opacity }} />;
 * }
 * ```
 */
export function useTween(config: {
  from: number;
  to: number;
  duration: number;
  easing?: (t: number) => number;
  autoPlay?: boolean;
}): {
  value: number;
  play: () => void;
  pause: () => void;
  reset: () => void;
  isPlaying: boolean;
  progress: number;
} {
  const { from, to, duration, easing = (t) => t, autoPlay = true } = config;

  const [value, setValue] = React.useState(from);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [progress, setProgress] = React.useState(0);

  const startTime = useRef<number | null>(null);
  const requestRef = useRef<number>();

  const animate = (time: number) => {
    if (startTime.current === null) {
      startTime.current = time;
    }

    const elapsed = time - startTime.current;
    const t = Math.min(elapsed / duration, 1);
    const easedValue = easing(t);

    setProgress(t);
    setValue(from + (to - from) * easedValue);

    if (t < 1 && isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  const play = React.useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (progress >= 1) {
        startTime.current = null;
        setProgress(0);
      }
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, progress]);

  const pause = React.useCallback(() => {
    setIsPlaying(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const reset = React.useCallback(() => {
    startTime.current = null;
    setProgress(0);
    setValue(from);
  }, [from]);

  React.useEffect(() => {
    if (autoPlay) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [autoPlay]);

  return { value, play, pause, reset, isPlaying, progress };
}

// 缓动函数集合
export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: (t: number) => {
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
  }
};
