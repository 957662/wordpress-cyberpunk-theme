import { useEffect, useState } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  disableHysteresis?: boolean;
}

interface UseScrollDirectionReturn {
  scrollDirection: ScrollDirection;
  isScrolling: boolean;
  scrollY: number;
}

/**
 * 监听滚动方向的 Hook
 * @param options - 配置选项
 * @returns 滚动方向、是否正在滚动、当前滚动位置
 */
export function useScrollDirection(options: UseScrollDirectionOptions = {}): UseScrollDirectionReturn {
  const { threshold = 10, disableHysteresis = false } = options;
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollTimeout: NodeJS.Timeout;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      if (
        Math.abs(scrollY - lastScrollY) >= threshold ||
        disableHysteresis
      ) {
        setScrollDirection(direction);
        lastScrollY = scrollY > 0 ? scrollY : 0;
      }

      setScrollY(scrollY);
      setIsScrolling(true);

      // 清除之前的 timeout
      clearTimeout(scrollTimeout);

      // 设置新的 timeout 来检测滚动停止
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [threshold, disableHysteresis]);

  return { scrollDirection, isScrolling, scrollY };
}

/**
 * 监听滚动进度（0-100%）
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const scrollProgress = (scrollTop / scrollableHeight) * 100;

      setProgress(Math.min(100, Math.max(0, scrollProgress)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // 初始化
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return progress;
}

/**
 * 监听元素是否在视口上方（用于粘性导航）
 */
export function useIsScrollingPast(elementRef: React.RefObject<HTMLElement>): boolean {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPast(!entry.isIntersecting && window.scrollY > 0);
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return isPast;
}
