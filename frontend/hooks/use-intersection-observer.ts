/**
 * useIntersectionObserver Hook
 *
 * Uses Intersection Observer API to detect when an element enters or leaves the viewport.
 * Useful for lazy loading, infinite scroll, animations on scroll, etc.
 */

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
  freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverResult {
  ref: RefObject<Element>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  root = null,
  triggerOnce = false,
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverResult {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const ref = useRef<Element>(null);

  const frozen = useRef(false);

  useEffect(() => {
    const element = ref.current;

    // Skip if frozen
    if (freezeOnceVisible && frozen.current) {
      return;
    }

    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      // Fallback: just set as intersecting
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);
        setEntry(entry);

        if (isElementIntersecting && freezeOnceVisible) {
          frozen.current = true;
        }

        if (isElementIntersecting && triggerOnce) {
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [
    threshold,
    rootMargin,
    root,
    triggerOnce,
    freezeOnceVisible,
  ]);

  return { ref, isIntersecting, entry };
}

export default useIntersectionObserver;

/**
 * Usage examples:
 *
 * // 1. Lazy loading images
 * function LazyImage({ src, alt }) {
 *   const { ref, isIntersecting } = useIntersectionObserver({
 *     triggerOnce: true,
 *     threshold: 0.1,
 *   });
 *
 *   return (
 *     <img
 *       ref={ref}
 *       src={isIntersecting ? src : 'placeholder.jpg'}
 *       alt={alt}
 *     />
 *   );
 * }
 *
 * // 2. Infinite scroll
 * function InfiniteScrollList() {
 *   const { ref, isIntersecting } = useIntersectionObserver();
 *
 *   useEffect(() => {
 *     if (isIntersecting) {
 *       loadMoreItems();
 *     }
 *   }, [isIntersecting]);
 *
 *   return (
 *     <>
 *       {items.map(item => <Item key={item.id} {...item} />)}
 *       <div ref={ref}>Loading more...</div>
 *     </>
 *   );
 * }
 *
 * // 3. Scroll animations
 * function AnimatedOnScroll() {
 *   const { ref, isIntersecting } = useIntersectionObserver({
 *     threshold: 0.5,
 *   });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         opacity: isIntersecting ? 1 : 0,
 *         transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)',
 *         transition: 'all 0.3s ease-out',
 *       }}
 *     >
 *       Content that animates in when visible
 *     </div>
 *   );
 * }
 */
