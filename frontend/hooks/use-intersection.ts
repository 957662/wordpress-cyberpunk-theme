/**
 * useIntersection Hook
 * 交集观察 Hook - 用于检测元素是否在视口中
 */

import { useState, useRef, RefObject } from 'react';

export interface UseIntersectionOptions {
  /** 触发的阈值 (0-1) */
  threshold?: number | number[];
  /** 根元素 */
  root?: Element | null;
  /** 根边距 */
  rootMargin?: string;
  /** 是否只触发一次 */
  triggerOnce?: boolean;
}

export function useIntersection<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0, root = null, rootMargin = '0px', triggerOnce = false } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 如果已经触发过且只触发一次，则不再观察
    if (triggerOnce && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && triggerOnce) {
          setHasIntersected(true);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, root, rootMargin, triggerOnce, hasIntersected]);

  return [ref, isIntersecting];
}

// 使用示例:
// const [ref, isVisible] = useIntersection({ threshold: 0.5 });
// <div ref={ref}>{isVisible && '现在可见'}</div>
