/**
 * useOnlineStatus Hook
 *
 * 监听网络在线状态的 Hook
 */

import { useState, useEffect } from 'react';

/**
 * useOnlineStatus Hook
 * @returns 是否在线
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  });

  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // 添加事件监听
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 清理
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * useOnlineStatusWithRetry Hook
 * 带重试逻辑的在线状态 Hook
 */
export interface OnlineStatusWithRetry {
  isOnline: boolean;
  retryCount: number;
  lastOfflineTime: Date | null;
  retry: () => void;
}

export function useOnlineStatusWithRetry(): OnlineStatusWithRetry {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  });
  const [retryCount, setRetryCount] = useState(0);
  const [lastOfflineTime, setLastOfflineTime] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOfflineTime(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const retry = () => {
    setRetryCount((prev) => prev + 1);
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      setIsOnline(true);
    }
  };

  return {
    isOnline,
    retryCount,
    lastOfflineTime,
    retry,
  };
}
