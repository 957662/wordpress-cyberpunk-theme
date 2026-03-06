/**
 * useElementSize Hook
 * 监听元素尺寸变化
 */

'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

export function useElementSize<T extends HTMLElement = HTMLElement>(): [
  RefObject<T>,
  ElementSize
] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateSize = () => {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [ref, size];
}

/**
 * useElementSize Hook（带回调）
 * @param callback - 尺寸变化回调
 */
export function useElementSizeCallback<T extends HTMLElement = HTMLElement>(
  callback: (size: ElementSize) => void
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateSize = () => {
      callback({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [callback]);

  return ref;
}
