/**
 * useBreakpoint Hook
 * 响应式断点检测 Hook
 */

'use client';

import { useMemo, useEffect, useState } from 'react';
import { useMediaQuery } from './useMediaQuery';

export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export const defaultBreakpoints: Breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export interface BreakpointValues {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  '2xl': boolean;
  is: keyof Breakpoints;
  current: number;
  largerThan: (breakpoint: keyof Breakpoints) => boolean;
  smallerThan: (breakpoint: keyof Breakpoints) => boolean;
  between: (min: keyof Breakpoints, max: keyof Breakpoints) => boolean;
}

export function useBreakpoint(
  customBreakpoints?: Partial<Breakpoints>
): BreakpointValues {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;

  const is = useMemo(() => {
    if (windowWidth >= breakpoints['2xl']) return '2xl';
    if (windowWidth >= breakpoints.xl) return 'xl';
    if (windowWidth >= breakpoints.lg) return 'lg';
    if (windowWidth >= breakpoints.md) return 'md';
    if (windowWidth >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [windowWidth, breakpoints]);

  const values = useMemo(() => {
    return {
      xs: windowWidth >= breakpoints.xs,
      sm: windowWidth >= breakpoints.sm,
      md: windowWidth >= breakpoints.md,
      lg: windowWidth >= breakpoints.lg,
      xl: windowWidth >= breakpoints.xl,
      '2xl': windowWidth >= breakpoints['2xl'],
      is,
      current: windowWidth,
      largerThan: (breakpoint: keyof Breakpoints) => {
        return windowWidth > breakpoints[breakpoint];
      },
      smallerThan: (breakpoint: keyof Breakpoints) => {
        return windowWidth < breakpoints[breakpoint];
      },
      between: (min: keyof Breakpoints, max: keyof Breakpoints) => {
        return windowWidth >= breakpoints[min] && windowWidth < breakpoints[max];
      },
    };
  }, [windowWidth, breakpoints, is]);

  return values;
}

/**
 * 使用示例:
 *
 * const { is, md, lg, xl, largerThan, between } = useBreakpoint();
 *
 * return (
 *   <div>
 *     {is === 'xs' && <MobileLayout />}
 *     {is === 'lg' && <DesktopLayout />}
 *     {between('md', 'xl') && <TabletLayout />}
 *   </div>
 * );
 */

// ============================================
// useContainerQuery Hook - 容器查询
// ============================================

export interface ContainerQueryOptions {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: string;
}

export function useContainerQuery(
  ref: React.RefObject<HTMLElement>,
  options: ContainerQueryOptions
) {
  const [matches, setMatches] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      const { width, height } = rect;
      setSize({ width, height });

      let match = true;

      if (options.minWidth !== undefined && width < options.minWidth) {
        match = false;
      }
      if (options.maxWidth !== undefined && width > options.maxWidth) {
        match = false;
      }
      if (options.minHeight !== undefined && height < options.minHeight) {
        match = false;
      }
      if (options.maxHeight !== undefined && height > options.maxHeight) {
        match = false;
      }
      if (options.aspectRatio !== undefined) {
        const [w, h] = options.aspectRatio.split('/').map(Number);
        if (w && h && Math.abs(width / height - w / h) > 0.1) {
          match = false;
        }
      }

      setMatches(match);
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    updateSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, options]);

  return { matches, size };
}

/**
 * 使用示例:
 *
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { matches, size } = useContainerQuery(containerRef, {
 *   minWidth: 600,
 *   maxWidth: 900,
 * });
 *
 * return (
 *   <div ref={containerRef}>
 *     {matches ? 'Wide container' : 'Narrow container'}
 *     Size: {size.width}x{size.height}
 *   </div>
 * );
 */

// ============================================
// useResponsive Hook - 响应式值
// ============================================

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

export function useResponsiveValue<T>(
  values: ResponsiveValue<T>,
  defaultValue?: T
): T | undefined {
  const { is } = useBreakpoint();

  return useMemo(() => {
    // 从小到大检查
    if (is === 'xs' && values.xs !== undefined) return values.xs;
    if (is === 'sm' && values.sm !== undefined) return values.sm;
    if (is === 'md' && values.md !== undefined) return values.md;
    if (is === 'lg' && values.lg !== undefined) return values.lg;
    if (is === 'xl' && values.xl !== undefined) return values.xl;
    if (is === '2xl' && values['2xl'] !== undefined) return values['2xl'];

    // 返回最接近的小屏幕的值
    if (values.xl !== undefined) return values.xl;
    if (values.lg !== undefined) return values.lg;
    if (values.md !== undefined) return values.md;
    if (values.sm !== undefined) return values.sm;
    if (values.xs !== undefined) return values.xs;

    return defaultValue;
  }, [values, is, defaultValue]);
}

/**
 * 使用示例:
 *
 * const columns = useResponsiveValue({ xs: 1, sm: 2, md: 3, lg: 4 }, 1);
 * const padding = useResponsiveValue({ xs: '8px', lg: '24px' }, '16px');
 *
 * return (
 *   <div style={{ columns, padding }}>
 *     内容
 *   </div>
 * );
 */

// ============================================
// useMatchMedia Hook - 匹配媒体查询
// ============================================

export function useMatchMedia(query: string): boolean {
  const mediaQuery = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query);
    }
    return null;
  }, [query]);

  const [matches, setMatches] = useState(() => {
    if (mediaQuery) {
      return mediaQuery.matches;
    }
    return false;
  });

  useEffect(() => {
    if (!mediaQuery) {
      return;
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [mediaQuery]);

  return matches;
}

/**
 * 使用示例:
 *
 * const isDarkMode = useMatchMedia('(prefers-color-scheme: dark)');
 * const isPrint = useMatchMedia('print');
 * const isLandscape = useMatchMedia('(orientation: landscape)');
 *
 * return (
 *   <div className={isDarkMode ? 'dark' : 'light'}>
 *     {isPrint ? 'Print layout' : 'Screen layout'}
 *   </div>
 * );
 */
