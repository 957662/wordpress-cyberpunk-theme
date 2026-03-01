/**
 * Intersection Observer Hook
 * 用于检测元素是否进入视口
 */

import { useEffect, useRef, RefObject, useState } from 'react';

export interface UseIntersectionObserverProps {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
  enabled?: boolean;
}

export function useIntersectionObserver<T extends Element = Element>({
  threshold = 0,
  rootMargin = '0px',
  root = null,
  triggerOnce = false,
  enabled = true,
}: UseIntersectionObserverProps = {}): [RefObject<T>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled || !ref.current) {
      return;
    }

    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && triggerOnce) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, root, triggerOnce, enabled]);

  return [ref, isIntersecting];
}

// 视口动画 Hook
export function useViewportAnimation(
  options?: UseIntersectionObserverProps
): [RefObject<Element>, boolean] {
  return useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
    ...options,
  });
}

// 懒加载图片 Hook
export function useLazyImage(src: string): [string, RefObject<HTMLImageElement>, boolean] {
  const [imageSrc, setImageSrc] = useState<string>();
  const [ref, isIntersecting] = useIntersectionObserver<HTMLImageElement>({
    triggerOnce: true,
  });

  useEffect(() => {
    if (isIntersecting && !imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc]);

  return [imageSrc || '', ref, isIntersecting];
}
