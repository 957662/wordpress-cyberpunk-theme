/**
 * useInView Hook
 * 检测元素是否在视口中可见
 */

import { useState, useEffect, useRef } from 'react';

interface InViewOptions {
  /**
   * 触发阈值 (0-1)
   * @default 0
   */
  threshold?: number | number[];

  /**
   * 根元素
   * @default null (使用 viewport)
   */
  root?: Element | null;

  /**
   * 根元素的边距
   */
  rootMargin?: string;

  /**
   * 是否只触发一次
   * @default false
   */
  triggerOnce?: boolean;

  /**
   * 初始延迟 (ms)
   */
  initialDelay?: number;
}

interface InViewReturn {
  ref: React.RefObject<HTMLDivElement>;
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

export function useInView(options: InViewOptions = {}): InViewReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
    initialDelay = 0,
  } = options;

  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const ref = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 初始延迟
    if (initialDelay > 0) {
      const timer = setTimeout(() => {
        // 延迟后检查
      }, initialDelay);
      return () => clearTimeout(timer);
    }

    // 检查是否已经触发过
    if (triggerOnce && hasTriggered.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setEntry(entry);

          if (triggerOnce) {
            hasTriggered.current = true;
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setInView(false);
          setEntry(entry);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce, initialDelay]);

  return { ref, inView, entry };
}
