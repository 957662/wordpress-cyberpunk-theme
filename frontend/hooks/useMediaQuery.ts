/**
 * CyberPress Platform - useMediaQuery Hook
 * 媒体查询 Hook
 */

import { useState, useEffect } from 'react';

/**
 * 媒体查询 Hook
 * 监听并返回媒体查询的匹配状态
 * 
 * @param query - 媒体查询字符串
 * @returns 是否匹配
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const isPrint = useMediaQuery('print');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 设置初始值
    setMatches(mediaQuery.matches);

    // 添加监听器
    mediaQuery.addEventListener('change', handler);

    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * 预定义的媒体查询 Hook
 */

/**
 * 检测是否为移动设备（宽度 <= 768px）
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/**
 * 检测是否为平板设备（768px < 宽度 <= 1024px）
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

/**
 * 检测是否为桌面设备（宽度 > 1024px）
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}

/**
 * 检测系统是否为深色模式
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * 检测系统是否为浅色模式
 */
export function usePrefersLightMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: light)');
}

/**
 * 检测是否启用了减少动画偏好
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * 检测是否为高对比度模式
 */
export function usePrefersHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)');
}

/**
 * 检测是否为竖屏方向
 */
export function useIsPortrait(): boolean {
  return useMediaQuery('(orientation: portrait)');
}

/**
 * 检测是否为横屏方向
 */
export function useIsLandscape(): boolean {
  return useMediaQuery('(orientation: landscape)');
}

/**
 * 检测设备是否支持触摸
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}

/**
 * 检测设备是否支持精确指针（鼠标）
 */
export function useIsPointerDevice(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

export default useMediaQuery;
