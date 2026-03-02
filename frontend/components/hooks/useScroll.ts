/**
 * useScroll Hook
 * 监听滚动位置的 Hook
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface ScrollState {
  scrollX: number;
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  isScrolling: boolean;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
  scrollTop: boolean;
  scrollBottom: boolean;
  scrollLeft: boolean;
  scrollRight: boolean;
}

export interface UseScrollOptions {
  throttle?: number;
  offset?: number;
  element?: HTMLElement | Window | null;
}

export function useScroll(options: UseScrollOptions = {}) {
  const { throttle = 100, offset = 10, element = null } = options;

  const [state, setState] = useState<ScrollState>({
    scrollX: 0,
    scrollY: 0,
    scrollDirection: null,
    isScrolling: false,
    isScrollingUp: false,
    isScrollingDown: false,
    scrollTop: true,
    scrollBottom: false,
    scrollLeft: true,
    scrollRight: false,
  });

  const prevScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTime = useRef(0);

  const scrollTo = useCallback(
    (x: number, y: number) => {
      const target = element || window;
      if (target === window) {
        window.scrollTo(x, y);
      } else if (target instanceof HTMLElement) {
        target.scrollTo(x, y);
      }
    },
    [element]
  );

  const scrollToTop = useCallback(() => {
    scrollTo(0, 0);
  }, [scrollTo]);

  const scrollToBottom = useCallback(() => {
    const target = element || window;
    let scrollHeight: number;

    if (target === window) {
      scrollHeight = document.documentElement.scrollHeight;
    } else if (target instanceof HTMLElement) {
      scrollHeight = target.scrollHeight;
    } else {
      return;
    }

    scrollTo(0, scrollHeight);
  }, [element, scrollTo]);

  const scrollBy = useCallback(
    (x: number, y: number) => {
      const target = element || window;
      if (target === window) {
        window.scrollBy(x, y);
      } else if (target instanceof HTMLElement) {
        target.scrollBy(x, y);
      }
    },
    [element]
  );

  useEffect(() => {
    const target = element || window;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < throttle) {
        return;
      }
      lastScrollTime.current = now;

      let scrollX = 0;
      let scrollY = 0;
      let innerWidth = 0;
      let innerHeight = 0;
      let scrollWidth = 0;
      let scrollHeight = 0;

      if (target === window) {
        scrollX = window.scrollX || document.documentElement.scrollLeft;
        scrollY = window.scrollY || document.documentElement.scrollTop;
        innerWidth = window.innerWidth;
        innerHeight = window.innerHeight;
        scrollWidth = document.documentElement.scrollWidth;
        scrollHeight = document.documentElement.scrollHeight;
      } else if (target instanceof HTMLElement) {
        scrollX = target.scrollLeft;
        scrollY = target.scrollTop;
        innerWidth = target.clientWidth;
        innerHeight = target.clientHeight;
        scrollWidth = target.scrollWidth;
        scrollHeight = target.scrollHeight;
      } else {
        return;
      }

      const scrollDirection = scrollY > prevScrollY.current ? 'down' : 'up';

      setState((prevState) => ({
        scrollX,
        scrollY,
        scrollDirection,
        isScrolling: true,
        isScrollingUp: scrollDirection === 'up',
        isScrollingDown: scrollDirection === 'down',
        scrollTop: scrollY <= offset,
        scrollBottom: scrollY + innerHeight >= scrollHeight - offset,
        scrollLeft: scrollX <= offset,
        scrollRight: scrollX + innerWidth >= scrollWidth - offset,
      }));

      prevScrollY.current = scrollY;

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 设置新的定时器来检测滚动停止
      timeoutRef.current = setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          isScrolling: false,
        }));
      }, throttle + 50);
    };

    // 初始化
    handleScroll();

    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [element, throttle, offset]);

  return {
    ...state,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollBy,
  };
}

/**
 * 使用示例:
 *
 * const { scrollY, scrollDirection, isScrolling, scrollToTop } = useScroll({
 *   throttle: 100,
 *   offset: 50,
 * });
 */

// ============================================
// useScrollTo Hook - 滚动到指定元素
// ============================================

export interface UseScrollToOptions {
  offset?: number;
  behavior?: ScrollBehavior;
  element?: HTMLElement | Window;
}

export function useScrollTo(options: UseScrollToOptions = {}) {
  const { offset = 0, behavior = 'smooth', element = null } = options;

  const scrollToElement = useCallback(
    (targetElement: HTMLElement | string | null) => {
      let el: HTMLElement | null = null;

      if (typeof targetElement === 'string') {
        el = document.querySelector(targetElement);
      } else if (targetElement instanceof HTMLElement) {
        el = targetElement;
      }

      if (!el) {
        console.warn('Target element not found');
        return;
      }

      const targetRect = el.getBoundingClientRect();
      const absoluteElementTop = targetRect.top + window.scrollY;
      const targetPosition = absoluteElementTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior,
      });
    },
    [offset, behavior]
  );

  return { scrollToElement };
}

/**
 * 使用示例:
 *
 * const { scrollToElement } = useScrollTo({ offset: 80 });
 *
 * scrollToElement('#section-1');
 * scrollToElement(document.querySelector('.hero'));
 */

// ============================================
// useInfiniteScroll Hook - 无限滚动
// ============================================

export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  onIntersect?: () => void | Promise<void>;
  enabled?: boolean;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions = {}) {
  const { threshold = 0, rootMargin = '0px', onIntersect, enabled = true } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const target = targetRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && !isLoadingRef.current && onIntersect) {
          isLoadingRef.current = true;
          setIsIntersecting(true);

          try {
            await onIntersect();
          } finally {
            isLoadingRef.current = false;
            setIsIntersecting(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, onIntersect, enabled]);

  return {
    targetRef,
    isIntersecting,
  };
}

/**
 * 使用示例:
 *
 * const { targetRef, isIntersecting } = useInfiniteScroll({
 *   threshold: 0.1,
 *   rootMargin: '100px',
 *   onIntersect: async () => {
 *     await loadMorePosts();
 *   },
 * });
 *
 * return (
 *   <>
 *     <PostList posts={posts} />
 *     <div ref={targetRef} />
 *   </>
 * );
 */
