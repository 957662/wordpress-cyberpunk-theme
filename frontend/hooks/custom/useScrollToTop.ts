import { useEffect } from 'react';

/**
 * 滚动到顶部 Hook
 * @param condition - 触发滚动的条件（依赖项）
 */
export function useScrollToTop(condition: any = true) {
  useEffect(() => {
    if (condition) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [condition]);
}
