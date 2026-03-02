/**
 * CyberPress Platform - useScroll Hook
 * 滚动 Hook
 */

import { useState, useEffect } from 'react';

/**
 * 滚动位置 Hook
 * 返回元素的滚动位置
 * 
 * @param element - 要监听的元素（默认为 window）
 * @returns 滚动位置对象
 * 
 * @example
 * ```tsx
 * const { x, y } = useScroll();
 * const isScrolled = y > 100;
 * ```
 */
export function useScroll(element?: HTMLElement | null) {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const target = element || window;

    const handleScroll = () => {
      if (element) {
        setScrollPosition({
          x: element.scrollLeft,
          y: element.scrollTop,
        });
      } else {
        setScrollPosition({
          x: window.scrollX,
          y: window.scrollY,
        });
      }
    };

    // 添加事件监听器
    target.addEventListener('scroll', handleScroll, { passive: true });

    // 初始设置
    handleScroll();

    // 清理函数
    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [element]);

  return scrollPosition;
}

/**
 * 滚动方向 Hook
 * 返回当前的滚动方向
 * 
 * @returns 滚动方向 ('up' | 'down' | null)
 * 
 * @example
 * ```tsx
 * const scrollDirection = useScrollDirection();
 * const isScrollingDown = scrollDirection === 'down';
 * ```
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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return scrollDirection;
}

/**
 * 滚动到底部 Hook
 * 返回是否滚动到底部
 * 
 * @param offset - 底部偏移量（像素）
 * @returns 是否滚动到底部
 * 
 * @example
 * ```tsx
 * const isAtBottom = useScrollAtBottom(100);
 * 
 * useEffect(() => {
 *   if (isAtBottom) {
 *     loadMore();
 *   }
 * }, [isAtBottom]);
 * ```
 */
export function useScrollAtBottom(offset: number = 0) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setIsAtBottom(scrollTop + windowHeight >= documentHeight - offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offset]);

  return isAtBottom;
}

/**
 * 滚动进度 Hook
 * 返回页面滚动进度百分比
 * 
 * @returns 滚动进度 (0-100)
 * 
 * @example
 * ```tsx
 * const scrollProgress = useScrollProgress();
 * 
 * return (
 *   <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
 * );
 * ```
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollableHeight = documentHeight - windowHeight;
      const currentProgress = (scrollTop / scrollableHeight) * 100;

      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progress;
}

export default useScroll;
