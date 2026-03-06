import { useEffect, useRef } from 'react';

export function useScrollLock(isLocked: boolean = true) {
  const originalOverflow = useRef<typeof document.body.style.overflow>('');

  useEffect(() => {
    if (isLocked) {
      // 保存原始 overflow 值
      originalOverflow.current = document.body.style.overflow;
      // 锁定滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复滚动
      document.body.style.overflow = originalOverflow.current;
    }

    return () => {
      // 清理时恢复滚动
      document.body.style.overflow = originalOverflow.current;
    };
  }, [isLocked]);
}
