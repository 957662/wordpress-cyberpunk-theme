/**
 * 响应式断点 Hook
 * 检测当前屏幕尺寸断点
 */

'use client';

import { useEffect, useState } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface Breakpoints {
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
  current: Breakpoint | 'xs';
}

const breakpointValues: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useBreakpoints(): Breakpoints {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = windowSize.width;

  const getCurrentBreakpoint = (): Breakpoint | 'xs' => {
    if (width >= breakpointValues['2xl']) return '2xl';
    if (width >= breakpointValues.xl) return 'xl';
    if (width >= breakpointValues.lg) return 'lg';
    if (width >= breakpointValues.md) return 'md';
    if (width >= breakpointValues.sm) return 'sm';
    return 'xs';
  };

  return {
    isSm: width >= breakpointValues.sm,
    isMd: width >= breakpointValues.md,
    isLg: width >= breakpointValues.lg,
    isXl: width >= breakpointValues.xl,
    is2Xl: width >= breakpointValues['2xl'],
    current: getCurrentBreakpoint(),
  };
}

export default useBreakpoints;
