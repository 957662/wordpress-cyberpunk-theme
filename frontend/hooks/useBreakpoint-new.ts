'use client';

/**
 * useBreakpoint Hook
 * Responsive breakpoint detection
 */

import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface BreakpointMap {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  '2xl': boolean;
}

const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useBreakpoint() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  });

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate current breakpoint
  const getCurrentBreakpoint = (): Breakpoint => {
    const width = windowSize.width;

    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  };

  // Check if current breakpoint is above or below given breakpoint
  const isAbove = (breakpoint: Breakpoint): boolean => {
    return windowSize.width >= BREAKPOINTS[breakpoint];
  };

  const isBelow = (breakpoint: Breakpoint): boolean => {
    return windowSize.width < BREAKPOINTS[breakpoint];
  };

  // Get all breakpoint states
  const breakpoints: BreakpointMap = {
    xs: windowSize.width >= BREAKPOINTS.xs,
    sm: windowSize.width >= BREAKPOINTS.sm,
    md: windowSize.width >= BREAKPOINTS.md,
    lg: windowSize.width >= BREAKPOINTS.lg,
    xl: windowSize.width >= BREAKPOINTS.xl,
    '2xl': windowSize.width >= BREAKPOINTS['2xl'],
  };

  return {
    width: windowSize.width,
    breakpoint: getCurrentBreakpoint(),
    isAbove,
    isBelow,
    ...breakpoints,
  };
}
