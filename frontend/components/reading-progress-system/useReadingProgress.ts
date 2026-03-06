'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseReadingProgressOptions {
  containerRef?: RefObject<HTMLElement>;
  threshold?: number;
  debounceMs?: number;
}

interface ReadingProgressData {
  progress: number;
  isReading: boolean;
  timeSpent: number;
  wordsRead: number;
  scrollDepth: number;
}

export function useReadingProgress(options: UseReadingProgressOptions = {}) {
  const {
    containerRef,
    threshold = 0.1,
    debounceMs = 100,
  } = options;

  const [data, setData] = useState<ReadingProgressData>({
    progress: 0,
    isReading: false,
    timeSpent: 0,
    wordsRead: 0,
    scrollDepth: 0,
  });

  const startTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let scrollTop = 0;
    let scrollHeight = 0;
    let clientHeight = 0;
    let maxScrollDepth = 0;

    const calculateProgress = () => {
      if (containerRef?.current) {
        const container = containerRef.current;
        scrollTop = container.scrollTop;
        scrollHeight = container.scrollHeight - container.clientHeight;
      } else {
        scrollTop = window.scrollY;
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        clientHeight = window.innerHeight;
      }

      // Track maximum scroll depth
      if (scrollTop > maxScrollDepth) {
        maxScrollDepth = scrollTop;
      }

      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      const isReading = progress > threshold && progress < 95;

      return { progress, isReading, scrollDepth: maxScrollDepth };
    };

    const updateProgress = () => {
      const { progress, isReading, scrollDepth } = calculateProgress();
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

      setData(prev => ({
        ...prev,
        progress: Math.round(progress),
        isReading,
        timeSpent: elapsed,
        scrollDepth: Math.round((scrollDepth / scrollHeight) * 100) || 0,
      }));
    };

    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateProgress();
      }, debounceMs);
    };

    // Initial calculation
    updateProgress();

    // Add scroll listener
    const targetElement = containerRef?.current || window;
    targetElement.addEventListener('scroll', handleScroll, { passive: true });

    // Update time spent every second
    const intervalId = setInterval(() => {
      setData(prev => {
        if (prev.isReading) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          return { ...prev, timeSpent: elapsed };
        }
        return prev;
      });
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      targetElement.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, [containerRef, threshold, debounceMs]);

  return data;
}

interface UseReadingTimeOptions {
  wordsPerMinute?: number;
  content?: string;
}

export function useReadingTime(options: UseReadingTimeOptions = {}) {
  const { wordsPerMinute = 200, content = '' } = options;

  const [readingTime, setReadingTime] = useState({
    estimated: 0,
    actual: 0,
    words: 0,
  });

  useEffect(() => {
    if (!content) return;

    const words = content.trim().split(/\s+/).length;
    const estimated = Math.ceil(words / wordsPerMinute);

    setReadingTime(prev => ({
      ...prev,
      words,
      estimated,
    }));
  }, [content, wordsPerMinute]);

  // Track actual reading time
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000 / 60);
      setReadingTime(prev => ({
        ...prev,
        actual: elapsed,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return readingTime;
}

interface UseScrollDepthOptions {
  depthMarkers?: number[];
  containerRef?: RefObject<HTMLElement>;
  onDepthReached?: (depth: number) => void;
}

export function useScrollDepth(options: UseScrollDepthOptions = {}) {
  const {
    depthMarkers = [25, 50, 75, 90, 100],
    containerRef,
    onDepthReached,
  } = options;

  const [reachedDepth, setReachedDepth] = useState<number[]>([]);
  const maxDepthRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = 0;
      let scrollHeight = 0;

      if (containerRef?.current) {
        const container = containerRef.current;
        scrollTop = container.scrollTop;
        scrollHeight = container.scrollHeight - container.clientHeight;
      } else {
        scrollTop = window.scrollY;
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      }

      const currentDepth = (scrollTop / scrollHeight) * 100;

      // Update maximum depth
      if (currentDepth > maxDepthRef.current) {
        maxDepthRef.current = currentDepth;

        // Check if any depth markers have been reached
        depthMarkers.forEach(marker => {
          if (currentDepth >= marker && !reachedDepth.includes(marker)) {
            setReachedDepth(prev => [...prev, marker]);
            onDepthReached?.(marker);
          }
        });
      }
    };

    const targetElement = containerRef?.current || window;
    targetElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      targetElement.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, depthMarkers, reachedDepth, onDepthReached]);

  return {
    reachedDepth,
    maxDepth: maxDepthRef.current,
  };
}
