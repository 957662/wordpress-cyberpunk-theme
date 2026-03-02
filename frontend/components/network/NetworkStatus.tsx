'use client';

/**
 * Network Status Component
 * 网络状态组件 - 检测并显示在线/离线状态
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

type ConnectionStatus = 'online' | 'offline' | 'checking';

interface NetworkStatusProps {
  position?: 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
  showDetails?: boolean;
  theme?: 'dark' | 'light';
  autoHide?: boolean;
  hideDelay?: number;
  onReconnect?: () => void;
}

export function NetworkStatus({
  position = 'top',
  align = 'center',
  showDetails = false,
  theme = 'dark',
  autoHide = true,
  hideDelay = 3000,
  onReconnect,
}: NetworkStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>('online');
  const [isVisible, setIsVisible] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<{
    type?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  }>({});

  // 检查网络状态
  const checkNetworkStatus = useCallback(() => {
    setStatus('checking');
    setIsVisible(true);

    // 检查 navigator.onLine
    const isOnline = navigator.onLine;

    setTimeout(() => {
      setStatus(isOnline ? 'online' : 'offline');

      // 获取连接信息
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        setConnectionInfo({
          type: conn.type,
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
        });
      }

      if (isOnline && onReconnect) {
        onReconnect();
      }

      if (autoHide && isOnline) {
        setTimeout(() => {
          setIsVisible(false);
        }, hideDelay);
      }
    }, 500);
  }, [autoHide, hideDelay, onReconnect]);

  // 监听在线/离线事件
  useEffect(() => {
    const handleOnline = () => {
      checkNetworkStatus();
    };

    const handleOffline = () => {
      setStatus('offline');
      setIsVisible(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始检查
    checkNetworkStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkNetworkStatus]);

  // 监听连接信息变化
  useEffect(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;

      const handleConnectionChange = () => {
        setConnectionInfo({
          type: conn.type,
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
        });
      };

      conn.addEventListener('change', handleConnectionChange);

      return () => {
        conn.removeEventListener('change', handleConnectionChange);
      };
    }
  }, []);

  // 位置样式
  const getPositionClasses = () => {
    const positionMap = {
      top: 'top-4',
      bottom: 'bottom-4',
    };

    const alignMap = {
      left: 'left-4',
      center: 'left-1/2 -translate-x-1/2',
      right: 'right-4',
    };

    return `${positionMap[position]} ${alignMap[align]}`;
  };

  // 主题样式
  const themeClasses = theme === 'dark'
    ? 'bg-gray-900/95 text-white border-gray-700'
    : 'bg-white/95 text-gray-900 border-gray-300';

  // 状态图标和颜色
  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <Wifi className="text-green-500" size={20} />;
      case 'offline':
        return <WifiOff className="text-red-500" size={20} />;
      case 'checking':
        return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return '网络已连接';
      case 'offline':
        return '网络已断开';
      case 'checking':
        return '检测中...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'border-green-500';
      case 'offline':
        return 'border-red-500';
      case 'checking':
        return 'border-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          className={`
            fixed z-50 px-4 py-3 rounded-lg backdrop-blur-sm border shadow-lg
            ${getPositionClasses()} ${themeClasses} ${getStatusColor()}
            flex items-center gap-3 min-w-[200px]
          `}
        >
          {/* 图标 */}
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>

          {/* 状态文本 */}
          <div className="flex-1">
            <div className="font-medium text-sm">
              {getStatusText()}
            </div>

            {/* 详细信息 */}
            {showDetails && connectionInfo.effectiveType && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="text-xs text-gray-400 mt-1"
              >
                {connectionInfo.effectiveType && (
                  <div>网络类型: {connectionInfo.effectiveType}</div>
                )}
                {connectionInfo.downlink && (
                  <div>下行速度: {connectionInfo.downlink} Mbps</div>
                )}
                {connectionInfo.rtt && (
                  <div>延迟: {connectionInfo.rtt} ms</div>
                )}
              </motion.div>
            )}
          </div>

          {/* 刷新按钮（仅在离线时显示） */}
          {status === 'offline' && (
            <button
              onClick={checkNetworkStatus}
              className="flex-shrink-0 p-1 rounded hover:bg-gray-700 transition-colors"
              title="重新检测"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook 版本
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState({
    type: '',
    effectiveType: '',
    downlink: 0,
    rtt: 0,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('connection' in navigator) {
      const conn = (navigator as any).connection;

      const updateConnectionInfo = () => {
        setConnectionInfo({
          type: conn.type || '',
          effectiveType: conn.effectiveType || '',
          downlink: conn.downlink || 0,
          rtt: conn.rtt || 0,
        });
      };

      updateConnectionInfo();
      conn.addEventListener('change', updateConnectionInfo);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        conn.removeEventListener('change', updateConnectionInfo);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    ...connectionInfo,
  };
}

export default NetworkStatus;
