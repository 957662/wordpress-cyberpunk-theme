/**
 * useResizeObserver Hook
 * 监听元素尺寸变化的通用 Hook
 */

'use client';

import { useEffect, useRef, RefObject, useState } from 'react';

export interface ResizeObserverEntry {
  target: Element;
  contentRect: DOMRectReadOnly;
  borderBoxSize?: ResizeObserverSize[];
  contentBoxSize?: ResizeObserverSize[];
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: (entry: ResizeObserverEntry) => void
): void;

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  callback: (entry: ResizeObserverEntry) => void
): RefObject<T>;

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  refOrCallback: RefObject<T> | ((entry: ResizeObserverEntry) => void),
  callback?: (entry: ResizeObserverEntry) => void
): RefObject<T> | void {
  const internalRef = useRef<T>(null);
  const internalCallbackRef = useRef<(entry: ResizeObserverEntry) => void>();

  // 判断第一个参数是 ref 还是 callback
  const isRef = 'current' in refOrCallback;

  const ref = isRef ? (refOrCallback as RefObject<T>) : internalRef;
  const actualCallback = isRef
    ? callback!
    : (refOrCallback as (entry: ResizeObserverEntry) => void);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    internalCallbackRef.current = actualCallback;

    const observer = new ResizeObserver((entries) => {
      if (internalCallbackRef.current) {
        entries.forEach((entry) => {
          internalCallbackRef.current!(entry);
        });
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, actualCallback]);

  // 如果第一个参数是 callback，返回 ref
  if (!isRef) {
    return internalRef;
  }
}

/**
 * useResizeObserverSize Hook（返回尺寸）
 */
export function useResizeObserverSize<T extends HTMLElement = HTMLElement>(): [
  RefObject<T>,
  { width: number; height: number } | undefined
] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, size];
}

/**
 * useResizeObserverEntries Hook（返回所有 entries）
 */
export function useResizeObserverEntries<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>
): ResizeObserverEntry[] {
  const [entries, setEntries] = useState<ResizeObserverEntry[]>([]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      setEntries(entries);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return entries;
}
