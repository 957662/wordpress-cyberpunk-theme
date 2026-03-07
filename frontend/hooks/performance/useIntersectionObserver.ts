'use client';

import { useEffect, useState, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

interface UseIntersectionObserverReturn {
  isIntersecting: boolean;
  hasIntersected: boolean;
  entry: IntersectionObserverEntry | null;
  ref: RefObject<Element>;
}

/**
 * Hook for observing element intersection with viewport
 * Useful for lazy loading, scroll animations, and more
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
    enabled = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    // Check if browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback: consider element as intersecting
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }

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
  }, [threshold, root, rootMargin, triggerOnce, enabled, hasIntersected]);

  return {
    isIntersecting,
    hasIntersected,
    entry,
    ref: elementRef,
  };
}

/**
 * Hook for lazy loading components when they come into view
 */
export function useLazyLoad(
  options: UseIntersectionObserverOptions = {}
): { ref: RefObject<Element>; isVisible: boolean; hasLoaded: boolean } {
  const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    ...options,
  });

  return {
    ref,
    isVisible: isIntersecting,
    hasLoaded: hasIntersected,
  };
}

/**
 * Hook for infinite scroll functionality
 */
export function useInfiniteScroll(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
): { ref: RefObject<Element>; isIntersecting: boolean } {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    ...options,
  });

  useEffect(() => {
    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting, callback]);

  return { ref, isIntersecting };
}

/**
 * Hook for viewport-based animations
 */
export function useViewportAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<Element>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    ref: elementRef,
    isVisible,
  };
}
