'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 滚动锁定 Hook
 * 用于防止背景滚动（常用于 Modal、Drawer 等组件）
 */
export function useScrollLock(isLocked: boolean = true): void {
  const originalOverflowRef = useRef<string>('');
  const originalPaddingRightRef = useRef<string>('');

  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const body = document.body;
    originalOverflowRef.current = body.style.overflow;
    originalPaddingRightRef.current = body.style.paddingRight;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';

    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      body.style.overflow = originalOverflowRef.current;
      body.style.paddingRight = originalPaddingRightRef.current;
    };
  }, [isLocked]);
}

/**
 * 目标元素滚动锁定 Hook
 */
export function useTargetScrollLock(
  targetRef: React.RefObject<HTMLElement>,
  isLocked: boolean = true
): void {
  const originalOverflowRef = useRef<string>('');

  useEffect(() => {
    if (!isLocked || !targetRef.current) {
      return;
    }

    const element = targetRef.current;
    originalOverflowRef.current = element.style.overflow;

    element.style.overflow = 'hidden';

    return () => {
      element.style.overflow = originalOverflowRef.current;
    };
  }, [isLocked, targetRef]);
}

/**
 * 滚动锁定状态 Hook
 * 返回当前锁定状态和控制函数
 */
export function useScrollLockState() {
  const [isLocked, setIsLocked] = useState(false);

  useScrollLock(isLocked);

  return {
    isLocked,
    lock: () => setIsLocked(true),
    unlock: () => setIsLocked(false),
    toggle: () => setIsLocked(prev => !prev),
  };
}
