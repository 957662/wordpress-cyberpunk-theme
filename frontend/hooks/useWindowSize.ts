/**
 * useWindowSize Hook
 *
 * 监听窗口尺寸变化的 Hook
 */

import { useState, useEffect } from 'react';

/**
 * 窗口尺寸
 */
export interface WindowSize {
  width: number;
  height: number;
}

/**
 * 获取窗口尺寸
 */
function getSize(): WindowSize {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * useWindowSize Hook
 * @returns 窗口尺寸
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(getSize);

  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize(getSize());
    };

    // 添加事件监听
    window.addEventListener('resize', handleResize);
    
    // 立即执行一次
    handleResize();

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

/**
 * useBreakpoint Hook
 * 基于窗口宽度返回断点
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BreakpointResult {
  breakpoint: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
}

const breakpoints: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useBreakpoint(): BreakpointResult {
  const { width } = useWindowSize();

  const getBreakpoint = (): Breakpoint => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const breakpoint = getBreakpoint();

  return {
    breakpoint,
    isXs: width >= breakpoints.xs,
    isSm: width >= breakpoints.sm,
    isMd: width >= breakpoints.md,
    isLg: width >= breakpoints.lg,
    isXl: width >= breakpoints.xl,
    is2Xl: width >= breakpoints['2xl'],
  };
}
