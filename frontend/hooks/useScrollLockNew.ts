import { useEffect, useRef } from 'react';

/**
 * useScrollLock Hook
 * 用于锁定/解锁页面滚动
 */
export function useScrollLock(isLocked: boolean): void {
  const originalOverflow = useRef<string>('');

  useEffect(() => {
    if (isLocked) {
      // 保存原始 overflow 值
      originalOverflow.current = document.body.style.overflow;

      // 禁用滚动
      document.body.style.overflow = 'hidden';

      // 防止 iOS 回弹效果
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // 恢复原始值
      document.body.style.overflow = originalOverflow.current;
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // 清理
    return () => {
      document.body.style.overflow = originalOverflow.current;
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isLocked]);
}

export default useScrollLock;
