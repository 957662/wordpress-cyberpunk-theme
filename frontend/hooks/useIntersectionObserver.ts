'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Intersection Observer Hook
 * 用于检测元素是否进入视口
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<Element>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0,
        rootMargin: '0%',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, options.root]);

  return { ref, isIntersecting, entry };
}

/**
 * Once Intersection Observer Hook
 * 只触发一次的视口检测（用于懒加载、动画触发等）
 */
export function useOnceIntersectionObserver(
  options: IntersectionObserverInit = {}
): {
  ref: React.RefObject<Element>;
  hasIntersected: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const [hasIntersected, setHasIntersected] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<Element>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasIntersected) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          setEntry(entry);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: '0%',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options.threshold, options.rootMargin, options.root]);

  return { ref, hasIntersected, entry };
}

/**
 * Lazy Load Hook
 * 用于图片懒加载
 */
export function useLazyLoad(
  options: IntersectionObserverInit = { rootMargin: '50px' }
): {
  ref: React.RefObject<Element>;
  shouldLoad: boolean;
} {
  const { ref, hasIntersected } = useOnceIntersectionObserver(options);
  return { ref, shouldLoad: hasIntersected };
}

/**
 * In Viewport Hook
 * 简化的在视口检测
 */
export function useInViewport(
  options: IntersectionObserverInit = {}
): [React.RefObject<Element>, boolean] {
  const { ref, isIntersecting } = useIntersectionObserver(options);
  return [ref, isIntersecting];
}
