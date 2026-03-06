/**
 * useScrollDirection Hook
 * 检测滚动方向
 */

import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export function useScrollDirection(threshold: number = 10) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      if (
        scrollY > threshold &&
        scrollY !== lastScrollY &&
        direction !== scrollDirection
      ) {
        setScrollDirection(direction);
      }

      // 检测是否已滚动
      setIsScrolled(scrollY > threshold);

      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    const throttledUpdate = () => {
      if (!window.scrollTimeout) {
        window.scrollTimeout = window.setTimeout(() => {
          updateScrollDirection();
          window.scrollTimeout = null;
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledUpdate);
    return () => {
      if (window.scrollTimeout) {
        clearTimeout(window.scrollTimeout);
      }
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, [threshold, scrollDirection]);

  return { scrollDirection, isScrolled };
}

declare global {
  interface Window {
    scrollTimeout: NodeJS.Timeout | null;
  }
}
