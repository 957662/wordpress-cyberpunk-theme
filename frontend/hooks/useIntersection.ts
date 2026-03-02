'use client';

import { useState, useEffect, RefObject } from 'react';

interface UseIntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersection(
  ref: RefObject<Element>,
  options: UseIntersectionOptions = {}
): [boolean, IntersectionObserverEntry | null] {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const node = ref?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, JSON.stringify(threshold), root, rootMargin, frozen]);

  return [isVisible, entry];
}

export function useOnScreen(
  ref: RefObject<Element>,
  options: UseIntersectionOptions = {}
): boolean {
  const [isIntersecting] = useIntersection(ref, options);
  return isIntersecting;
}

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll(
  ref: RefObject<Element>,
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
): void {
  const { threshold = 0.5, rootMargin = '0px', enabled = true } = options;

  const [isIntersecting, entry] = useIntersection(ref, {
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (isIntersecting && enabled) {
      callback();
    }
  }, [isIntersecting, enabled, callback, entry]);
}
