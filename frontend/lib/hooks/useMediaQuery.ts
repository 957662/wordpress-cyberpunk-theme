/**
 * useMediaQuery Hook
 * 媒体查询 Hook，用于响应式设计
 */

import { useEffect, useState } from 'react';

/**
 * 媒体查询 Hook
 * @param query 媒体查询字符串
 * @returns 是否匹配媒体查询
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);

    // 初始值
    setMatches(mediaQuery.matches);

    // 清除监听器
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * 断点 Hook
 * @returns 当前断点信息
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet: isMobile || isTablet,
  };
}

export default useMediaQuery;
