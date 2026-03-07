'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

/**
 * Click Outside Hook
 * 检测是否点击了元素外部
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  options: {
    disabled?: boolean;
    ignoreClass?: string;
  } = {}
): void {
  const { disabled = false, ignoreClass } = options;

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (ref.current && !ref.current.contains(target)) {
        if (ignoreClass && target.closest(`.${ignoreClass}`)) {
          return;
        }
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ref, callback, disabled, ignoreClass]);
}

/**
 * Click Outside with Escape Hook
 * 点击外部或按 ESC 键触发
 */
export function useClickOutsideWithEscape(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  options: {
    disabled?: boolean;
    ignoreClass?: string;
    captureEscape?: boolean;
  } = {}
): void {
  const { disabled = false, ignoreClass, captureEscape = true } = options;

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (ref.current && !ref.current.contains(target)) {
        if (ignoreClass && target.closest(`.${ignoreClass}`)) {
          return;
        }
        callback();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    if (captureEscape) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ref, callback, disabled, ignoreClass, captureEscape]);
}

/**
 * Click Outside State Hook
 * 返回状态和控制函数
 */
export function useClickOutsideState(
  initialState: boolean = false,
  options: {
    ignoreClass?: string;
  } = {}
): {
  ref: RefObject<HTMLElement>;
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  toggle: () => void;
} {
  const [isActive, setIsActive] = useState(initialState);
  const ref = useRef<HTMLElement>(null);

  const activate = () => setIsActive(true);
  const deactivate = () => setIsActive(false);
  const toggle = () => setIsActive(prev => !prev);

  useClickOutside(ref, deactivate, {
    disabled: !isActive,
    ...options,
  });

  return { ref, isActive, activate, deactivate, toggle };
}
