'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

/**
 * 赛博朋克风格的滚动动画 Hook
 * @param threshold - 触发阈值
 */
export function useCyberScroll(threshold: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { isVisible, elementRef };
}

/**
 * 赛博朋克风格的鼠标跟踪 Hook
 */
export function useCyberMouse() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return {
    mouseX,
    mouseY,
    isHovering,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}

/**
 * 赛博朋克风格的打字机效果 Hook
 * @param text - 要显示的文本
 * @param delay - 打字延迟（毫秒）
 */
export function useCyberTypewriter(text: string, delay: number = 100) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let timeout: NodeJS.Timeout;

    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        timeout = setTimeout(typeNextChar, delay);
      } else {
        setIsComplete(true);
      }
    };

    typeNextChar();

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return { displayedText, isComplete };
}

/**
 * 赛博朋克风格的故障效果 Hook
 * @param enabled - 是否启用效果
 */
export function useCyberGlitch(enabled: boolean = true) {
  const [isGlitching, setIsGlitching] = useState(false);
  const controls = useAnimation();

  const triggerGlitch = useCallback(async () => {
    if (!enabled) return;

    setIsGlitching(true);
    await controls.start({
      x: [-5, 5, -5, 5, 0],
      opacity: [1, 0.8, 1, 0.8, 1],
      transition: { duration: 0.2 },
    });
    setIsGlitching(false);
  }, [controls, enabled]);

  return { isGlitching, triggerGlitch, controls };
}

/**
 * 赛博朋克风格的粒子效果 Hook
 * @param particleCount - 粒子数量
 */
export function useCyberParticles(particleCount: number = 50) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
    }));

    setParticles(newParticles);
  }, [particleCount]);

  const updateParticles = useCallback(() => {
    setParticles((prevParticles) =>
      prevParticles.map((particle) => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx:
          particle.x < 0 || particle.x > window.innerWidth
            ? -particle.vx
            : particle.vx,
        vy:
          particle.y < 0 || particle.y > window.innerHeight
            ? -particle.vy
            : particle.vy,
      }))
    );
  }, []);

  return { particles, updateParticles };
}

/**
 * 赛博朋克风格的计数动画 Hook
 * @param end - 结束值
 * @param duration - 动画持续时间（毫秒）
 * @param start - 开始值
 */
export function useCyberCounter(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const startCounting = useCallback(() => {
    setIsAnimating(true);
    const startTime = Date.now();
    const range = end - start;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用 easeOutExpo 缓动函数
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.round(start + range * easedProgress);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(updateCount);
  }, [start, end, duration]);

  return { count, isAnimating, startCounting };
}

/**
 * 赛博朋克风格的倒计时 Hook
 * @param targetDate - 目标日期
 */
export function useCyberCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

/**
 * 赛博朋克风格的本地存储 Hook
 * @param key - 存储键
 * @param initialValue - 初始值
 */
export function useCyberStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

/**
 * 赛博朋克风格的媒体查询 Hook
 * @param query - 媒体查询字符串
 */
export function useCyberMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * 赛博朋克风格的异步状态 Hook
 * @param asyncFunction - 异步函数
 */
export function useCyberAsync<T, E = Error>(
  asyncFunction: () => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err as E);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction]);

  return { data, error, isLoading, execute };
}

/**
 * 赛博朋克风格的防抖 Hook
 * @param value - 要防抖的值
 * @param delay - 延迟时间（毫秒）
 */
export function useCyberDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
