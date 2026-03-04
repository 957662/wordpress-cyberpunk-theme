/**
 * useScrollLock Hook
 * 滚动锁定 Hook - 用于禁止/启用页面滚动
 */

import { useEffect, useRef } from 'react';

export function useScrollLock(enabled: boolean = true) {
  const originalOverflow = useRef<string>('');

  useEffect(() => {
    if (!enabled) return;

    // 保存原始 overflow 值
    originalOverflow.current = document.body.style.overflow;

    // 锁定滚动
    document.body.style.overflow = 'hidden';

    return () => {
      // 恢复原始 overflow 值
      document.body.style.overflow = originalOverflow.current;
    };
  }, [enabled]);
}

// 使用示例:
// useScrollLock(isModalOpen);
