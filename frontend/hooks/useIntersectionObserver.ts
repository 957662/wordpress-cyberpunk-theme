'use client';

import { useEffect, useRef, RefObject, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: RefObject<HTMLDivElement>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  triggerOnce = false,
}: UseIntersectionObserverProps = {}): UseIntersectionObserverReturn {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(element);
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
  }, [threshold, root, rootMargin, triggerOnce]);

  return { ref, isIntersecting, entry };
}

// 使用 Intersection Observer 的懒加载 Hook
export function useLazyLoad(src: string) {
  const [imageSrc, setImageSrc] = useState<string>();
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });

  useEffect(() => {
    if (isIntersecting && !imageSrc) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
      };
      img.src = src;
    }
  }, [isIntersecting, src, imageSrc]);

  return { ref, imageSrc, isLoaded: !!imageSrc };
}

// 视差滚动 Hook
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const { ref } = useIntersectionObserver();

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed]);

  return { ref, offset };
}

// 滚动触发动画 Hook
export function useScrollTrigger(threshold: number = 0.1) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold });
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isIntersecting && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isIntersecting, hasTriggered]);

  return { ref, isVisible: isIntersecting, hasTriggered };
}
