import { useState, useEffect } from 'react';

export interface NetworkConnection {
  /** 网络类型 */
  type: string;
  /** 是否有效 */
  effectiveType: string;
  /** 下行速度 (Mbps) */
  downlink: number;
  /** 往返时间 (ms) */
  rtt: number;
  /** 是否启用省流量模式 */
  saveData: boolean;
}

export interface UseNetworkStatusReturn {
  /** 是否在线 */
  isOnline: boolean;
  /** 网络连接信息 */
  connection: NetworkConnection | null;
  /** 上次在线时间 */
  lastOnline: number | null;
  /** 是否支持网络信息 API */
  isSupported: boolean;
}

const defaultConnection: NetworkConnection = {
  type: 'unknown',
  effectiveType: 'unknown',
  downlink: 0,
  rtt: 0,
  saveData: false,
};

/**
 * 网络状态 Hook
 *
 * @example
 * ```tsx
 * const { isOnline, connection, lastOnline } = useNetworkStatus();
 *
 * return (
 *   <div>
 *     <p>Online: {isOnline ? 'Yes' : 'No'}</p>
 *     {connection && (
 *       <p>Connection: {connection.effectiveType}</p>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useNetworkStatus(): UseNetworkStatusReturn {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [connection, setConnection] = useState<NetworkConnection | null>(null);
  const [lastOnline, setLastOnline] = useState<number | null>(null);

  // 检测是否支持网络信息 API
  const isSupported = typeof navigator !== 'undefined' &&
    'connection' in navigator &&
    // @ts-ignore - NavigatorConnection is not in standard types
    navigator.connection !== undefined;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 更新在线状态
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(Date.now());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    // @ts-ignore - NavigatorConnection
    const conn = navigator.connection;

    // 更新连接信息
    const updateConnection = () => {
      // @ts-ignore - NavigatorConnection
      const nav = navigator.connection;
      setConnection({
        type: nav.type || 'unknown',
        effectiveType: nav.effectiveType || 'unknown',
        downlink: nav.downlink || 0,
        rtt: nav.rtt || 0,
        saveData: nav.saveData || false,
      });
    };

    // 初始更新
    updateConnection();

    // 监听连接变化
    conn.addEventListener('change', updateConnection);

    return () => {
      conn.removeEventListener('change', updateConnection);
    };
  }, [isSupported]);

  return {
    isOnline,
    connection,
    lastOnline,
    isSupported,
  };
}

export default useNetworkStatus;
