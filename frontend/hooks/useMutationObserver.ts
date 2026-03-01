/**
 * useMutationObserver Hook
 * 监听 DOM 变化的 Hook
 */

'use client';

import { useEffect, useRef, RefObject } from 'react';

export function useMutationObserver(
  ref: RefObject<HTMLElement>,
  callback: MutationCallback,
  options: MutationObserverInit = {}
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new MutationObserver((entries, observer) => {
      callbackRef.current(entries, observer);
    });

    observer.observe(element, options);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);
}

/**
 * useMutationObserverAttributes Hook（监听属性变化）
 */
export function useMutationObserverAttributes(
  ref: RefObject<HTMLElement>,
  attributeName: string,
  callback: (value: string | null) => void
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new MutationObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.attributeName === attributeName) {
          const value = (entry.target as HTMLElement).getAttribute(attributeName);
          callback(value);
        }
      });
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: [attributeName],
    });

    return () => {
      observer.disconnect();
    };
  }, [ref, attributeName, callback]);
}

/**
 * useMutationObserverContent Hook（监听内容变化）
 */
export function useMutationObserverContent(
  ref: RefObject<HTMLElement>,
  callback: (content: string) => void
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new MutationObserver(() => {
      callback(element.textContent || '');
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);
}
