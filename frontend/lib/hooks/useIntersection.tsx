'use client';

import { useEffect, useState, RefObject } from 'react';

export interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

export interface UseIntersectionReturn {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
  observer?: IntersectionObserver;
}

/**
 * Hook to detect when an element intersects with the viewport
 *
 * @param ref - React ref object to observe
 * @param options - Intersection Observer options
 * @returns Object containing isIntersecting boolean and entry data
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const { isIntersecting } = useIntersection(ref, {
 *   threshold: 0.5,
 *   triggerOnce: true,
 * });
 *
 * return (
 *   <div ref={ref} className={isIntersecting ? 'visible' : 'hidden'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useIntersection<T extends Element>(
  ref: RefObject<T>,
  options: UseIntersectionOptions = {}
): UseIntersectionReturn {
  const {
    threshold = 0,
    rootMargin = '0px',
    triggerOnce = false,
    root = null,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        if (entry.isIntersecting && triggerOnce) {
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
  }, [ref, threshold, rootMargin, triggerOnce, root]);

  return { isIntersecting, entry };
}

/**
 * Hook to detect when multiple elements intersect with the viewport
 *
 * @param refs - Array of React ref objects to observe
 * @param options - Intersection Observer options
 * @returns Object containing intersection states for each ref
 *
 * @example
 * ```tsx
 * const ref1 = useRef<HTMLDivElement>(null);
 * const ref2 = useRef<HTMLDivElement>(null);
 * const intersections = useMultipleIntersections([ref1, ref2]);
 *
 * return (
 *   <>
 *     <div ref={ref1} className={intersections[0]?.isIntersecting ? 'visible' : 'hidden'}>
 *       Content 1
 *     </div>
 *     <div ref={ref2} className={intersections[1]?.isIntersecting ? 'visible' : 'hidden'}>
 *       Content 2
 *     </div>
 *   </>
 * );
 * ```
 */
export function useMultipleIntersections<T extends Element>(
  refs: RefObject<T>[],
  options: UseIntersectionOptions = {}
): Array<UseIntersectionReturn> {
  const intersections = refs.map((ref) => useIntersection(ref, options));
  return intersections;
}

/**
 * Hook to detect when an element is fully visible in the viewport
 *
 * @param ref - React ref object to observe
 * @param options - Intersection Observer options
 * @returns Boolean indicating if element is fully visible
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const isFullyVisible = useIsFullyVisible(ref);
 *
 * return (
 *   <div ref={ref} className={isFullyVisible ? 'opacity-100' : 'opacity-50'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useIsFullyVisible<T extends Element>(
  ref: RefObject<T>,
  options: Omit<UseIntersectionOptions, 'threshold'> = {}
): boolean {
  const { isIntersecting } = useIntersection(ref, {
    ...options,
    threshold: 1,
  });

  return isIntersecting;
}

/**
 * Hook to detect when an element is partially visible in the viewport
 *
 * @param ref - React ref object to observe
 * @param fraction - Fraction of element that must be visible (0-1)
 * @param options - Intersection Observer options
 * @returns Boolean indicating if element is partially visible
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const isHalfVisible = useIsPartiallyVisible(ref, 0.5);
 *
 * return (
 *   <div ref={ref} className={isHalfVisible ? 'opacity-100' : 'opacity-50'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useIsPartiallyVisible<T extends Element>(
  ref: RefObject<T>,
  fraction: number = 0.5,
  options: UseIntersectionOptions = {}
): boolean {
  const { isIntersecting } = useIntersection(ref, {
    ...options,
    threshold: fraction,
  });

  return isIntersecting;
}
