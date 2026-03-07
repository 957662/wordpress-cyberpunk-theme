'use client';

import { useEffect, useRef, RefObject, useState, useCallback } from 'react';

export interface UseIntersectionObserverProps {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

export interface UseIntersectionObserverResult {
  ref: RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

/**
 * useIntersectionObserver - 交叉观察器 Hook
 * 用于检测元素是否进入视口
 */
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  triggerOnce = false,
  enabled = true,
}: UseIntersectionObserverProps = {}): UseIntersectionObserverResult {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;
    if (!element) return;

    // 检查浏览器支持
    if (!('IntersectionObserver' in window)) {
      // 不支持时默认返回 true
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        // 如果只触发一次且已相交，则取消观察
        if (triggerOnce && entry.isIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce, enabled]);

  return { ref, isIntersecting, entry };
}

/**
 * useInView - 简化的视口检测 Hook
 */
export function useInView(options?: UseIntersectionObserverProps) {
  const { ref, isIntersecting } = useIntersectionObserver(options);
  return [ref, isIntersecting] as const;
}

/**
 * useLazyLoad - 懒加载 Hook
 * 当元素进入视口时才加载内容
 */
export function useLazyLoad(offset = '100px') {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: offset,
    triggerOnce: true,
  });

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isIntersecting, isLoaded]);

  return { ref, isLoaded, isIntersecting };
}

/**
 * useAnimateOnScroll - 滚动动画 Hook
 * 当元素进入视口时触发动画
 */
export function useAnimateOnScroll(
  animationClass: string,
  options?: UseIntersectionObserverProps
) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    ...options,
  });

  useEffect(() => {
    if (isIntersecting) {
      setShouldAnimate(true);
    }
  }, [isIntersecting]);

  return { ref, shouldAnimate };
}

/**
 * useScrollProgress - 滚动进度 Hook
 * 计算页面或元素的滚动进度
 */
export function useScrollProgress(elementRef?: RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = elementRef?.current || document.documentElement;
    const targetElement = elementRef?.current ? element : window;

    const handleScroll = () => {
      if (elementRef?.current) {
        // 元素滚动进度
        const { scrollTop, scrollHeight, clientHeight } = element as HTMLElement;
        const scrolled = scrollTop / (scrollHeight - clientHeight);
        setProgress(Math.min(1, Math.max(0, scrolled)));
      } else {
        // 页面滚动进度
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrolled = scrollTop / (scrollHeight - clientHeight);
        setProgress(Math.min(1, Math.max(0, scrolled)));
      }
    };

    targetElement.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化

    return () => {
      targetElement.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef]);

  return progress;
}

/**
 * useScrollDirection - 滚动方向 Hook
 * 检测用户是向上还是向下滚动
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return scrollDirection;
}

/**
 * useParallax - 视差滚动 Hook
 * 创建视差滚动效果
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const { top } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 只在元素在视口附近时计算
      if (top < windowHeight && top > -windowHeight) {
        const yPos = (windowHeight - top) * speed;
        setOffset(yPos);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
}

/**
 * useSticky - 粘性元素 Hook
 * 检测元素是否处于粘性状态
 */
export function useSticky() {
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        setIsSticky(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isSticky };
}

export default useIntersectionObserver;
