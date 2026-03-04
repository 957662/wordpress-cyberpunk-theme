'use client';

import { useState, useEffect } from 'react';

export interface NetworkState {
  online: boolean;
  offline: boolean;
  downlink: number | null;
  effectiveType: string | null;
  rtt: number | null;
  saveData: boolean | null;
}

/**
 * 网络状态 Hook
 * 监控网络连接状态
 */
export function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(() => {
    if (typeof window === 'undefined' || !('navigator' in window)) {
      return {
        online: true,
        offline: false,
        downlink: null,
        effectiveType: null,
        rtt: null,
        saveData: null,
      };
    }

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    return {
      online: navigator.onLine,
      offline: !navigator.onLine,
      downlink: connection?.downlink ?? null,
      effectiveType: connection?.effectiveType ?? null,
      rtt: connection?.rtt ?? null,
      saveData: connection?.saveData ?? null,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('navigator' in window)) {
      return;
    }

    const handleOnline = () => {
      setState((prev) => ({ ...prev, online: true, offline: false }));
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, online: false, offline: true }));
    };

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    const handleConnectionChange = () => {
      if (connection) {
        setState((prev) => ({
          ...prev,
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
          rtt: connection.rtt,
          saveData: connection.saveData,
        }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return state;
}

/**
 * 在线状态 Hook
 * 简化的在线/离线检测
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState(() => {
    if (typeof window === 'undefined' || !('navigator' in window)) {
      return true;
    }
    return navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('navigator' in window)) {
      return;
    }

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}
