/**
 * useIntersection Hook
 * 交叉观察器 Hook - 检测元素是否在视口中
 */

import { useState, useEffect, useRef, RefObject } from 'react';

export interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

export function useIntersection(
  options: UseIntersectionOptions = {}
): [RefObject<HTMLElement>, boolean] {
  const { threshold = 0, rootMargin = '0px', root = null, triggerOnce = false } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);

        if (triggerOnce && isElementIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, triggerOnce]);

  if (triggerOnce) {
    return [ref, hasIntersected];
  }

  return [ref, isIntersecting];
}

/**
 * 使用示例:
 *
 * function MyComponent() {
 *   const [ref, isVisible] = useIntersection({
 *     threshold: 0.5,
 *     triggerOnce: true
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       {isVisible ? 'Visible!' : 'Not visible'}
 *     </div>
 *   );
 * }
 */
