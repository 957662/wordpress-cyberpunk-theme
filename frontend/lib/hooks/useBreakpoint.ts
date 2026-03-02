'use client';

import { useEffect, useState } from 'react';

/**
 * 断点定义
 */
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * 获取当前断点
 */
function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * 使用断点钩子
 * 返回当前屏幕尺寸的断点信息
 */
export function useBreakpoint() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoint = getCurrentBreakpoint(windowSize.width);

  return {
    ...windowSize,
    breakpoint,
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm' || breakpoint === 'xs',
    isMd: breakpoint === 'md' || breakpoint === 'sm' || breakpoint === 'xs',
    isLg: breakpoint === 'lg' || breakpoint === 'md' || breakpoint === 'sm' || breakpoint === 'xs',
    isXl: breakpoint === 'xl' || breakpoint === 'lg' || breakpoint === 'md' || breakpoint === 'sm' || breakpoint === 'xs',
    is2Xl: true, // 所有尺寸都小于等于 2xl
    greaterThan: {
      xs: true,
      sm: breakpoint !== 'xs',
      md: breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
      lg: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
      xl: breakpoint === 'xl' || breakpoint === '2xl',
      '2xl': breakpoint === '2xl',
    },
    lessThan: {
      xs: false,
      sm: breakpoint === 'xs',
      md: breakpoint === 'xs' || breakpoint === 'sm',
      lg: breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md',
      xl: breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md' || breakpoint === 'lg',
      '2xl': breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl',
    },
  };
}

/**
 * 使用媒体查询钩子
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/**
 * 便捷的断点检查钩子
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery('(min-width: 1536px)');
}

/**
 * 使用屏幕方向
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
}

/**
 * 使用设备像素比
 */
export function useDevicePixelRatio(): number {
  const [dpr, setDpr] = useState(() => {
    if (typeof window !== 'undefined' && window.devicePixelRatio) {
      return window.devicePixelRatio;
    }
    return 1;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.devicePixelRatio) return;

    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const handleChange = () => setDpr(window.devicePixelRatio);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return dpr;
}

/**
 * 使用深色模式偏好
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * 使用减少动画偏好
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
