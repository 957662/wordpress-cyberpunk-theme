/**
 * useBreakpoint Hook
 * 响应式断点检测
 */

import { useState, useEffect } from 'react';

// Tailwind CSS 默认断点
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= breakpoints['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setBreakpoint('md');
      } else {
        setBreakpoint('sm');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// 检测是否匹配指定断点
export function useMatchBreakpoint(minBreakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const minWidth = breakpoints[minBreakpoint];

    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);

    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [minBreakpoint]);

  return matches;
}

// 常用的断点检查 Hook
export function useIsMobile(): boolean {
  return useMatchBreakpoint('md');
}

export function useIsTablet(): boolean {
  const isMd = useMatchBreakpoint('md');
  const isLg = useMatchBreakpoint('lg');
  return isMd && !isLg;
}

export function useIsDesktop(): boolean {
  return useMatchBreakpoint('lg');
}
