'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// 网络状态类型
// =====================================================

export type NetworkStatus = 'online' | 'offline' | 'slow';

export interface NetworkInfo {
  status: NetworkStatus;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

// =====================================================
// 网络状态指示器组件
// =====================================================

interface NetworkIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showDetails?: boolean;
  className?: string;
}

export function NetworkIndicator({
  position = 'bottom-right',
  showDetails = false,
  className = '',
}: NetworkIndicatorProps) {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    status: 'online',
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检查在线状态
    const updateOnlineStatus = () => {
      setNetworkInfo(prev => ({
        ...prev,
        status: navigator.onLine ? 'online' : 'offline',
      }));

      // 显示通知
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };

    // 初始化状态
    updateOnlineStatus();

    // 监听在线/离线事件
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // 获取网络连接信息
  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (!connection) return;

    const updateConnectionInfo = () => {
      const effectiveType = connection.effectiveType;
      const isSlow = effectiveType === 'slow-2g' || effectiveType === '2g';

      setNetworkInfo(prev => ({
        ...prev,
        status: navigator.onLine ? (isSlow ? 'slow' : 'online') : 'offline',
        effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      }));
    };

    updateConnectionInfo();

    connection.addEventListener('change', updateConnectionInfo);

    return () => {
      connection.removeEventListener('change', updateConnectionInfo);
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getStatusIcon = () => {
    switch (networkInfo.status) {
      case 'online':
        return <Wifi className="w-5 h-5 text-cyber-green" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-cyber-pink" />;
      case 'slow':
        return <AlertTriangle className="w-5 h-5 text-cyber-yellow" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (networkInfo.status) {
      case 'online':
        return '网络已连接';
      case 'offline':
        return '网络已断开';
      case 'slow':
        return '网络速度较慢';
      default:
        return '网络状态未知';
    }
  };

  const getStatusColor = () => {
    switch (networkInfo.status) {
      case 'online':
        return 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green';
      case 'offline':
        return 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink';
      case 'slow':
        return 'bg-cyber-yellow/10 border-cyber-yellow/30 text-cyber-yellow';
      default:
        return 'bg-gray-700/10 border-gray-700/30 text-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${getPositionClasses()} z-50 ${className}`}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${getStatusColor()}`}>
            {getStatusIcon()}
            <div>
              <p className="text-sm font-medium">{getStatusText()}</p>
              {showDetails && networkInfo.effectiveType && (
                <p className="text-xs opacity-75 mt-1">
                  网络类型: {networkInfo.effectiveType}
                  {networkInfo.downlink && ` • ${networkInfo.downlink}Mbps`}
                  {networkInfo.rtt && ` • ${networkInfo.rtt}ms`}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =====================================================
// 网络状态 Hook
// =====================================================

export function useNetworkStatus() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    status: 'online',
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      setNetworkInfo(prev => ({
        ...prev,
        status: navigator.onLine ? 'online' : 'offline',
      }));
    };

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (!connection) return;

    const updateConnectionInfo = () => {
      const effectiveType = connection.effectiveType;
      const isSlow = effectiveType === 'slow-2g' || effectiveType === '2g';

      setNetworkInfo(prev => ({
        ...prev,
        status: navigator.onLine ? (isSlow ? 'slow' : 'online') : 'offline',
        effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      }));
    };

    updateConnectionInfo();
    connection.addEventListener('change', updateConnectionInfo);

    return () => {
      connection.removeEventListener('change', updateConnectionInfo);
    };
  }, []);

  return networkInfo;
}

// =====================================================
// 网络状态横幅组件
// =====================================================

interface NetworkBannerProps {
  position?: 'top' | 'bottom';
  showOnlyWhenOffline?: boolean;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export function NetworkBanner({
  position = 'top',
  showOnlyWhenOffline = true,
  actionButton,
}: NetworkBannerProps) {
  const networkInfo = useNetworkStatus();

  if (showOnlyWhenOffline && networkInfo.status !== 'offline') {
    return null;
  }

  const getBannerColor = () => {
    switch (networkInfo.status) {
      case 'online':
        return 'bg-cyber-green/10 border-cyber-green/30';
      case 'offline':
        return 'bg-cyber-pink/10 border-cyber-pink/30';
      case 'slow':
        return 'bg-cyber-yellow/10 border-cyber-yellow/30';
      default:
        return 'bg-gray-700/10 border-gray-700/30';
    }
  };

  const getIcon = () => {
    switch (networkInfo.status) {
      case 'online':
        return <Wifi className="w-5 h-5 text-cyber-green" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-cyber-pink" />;
      case 'slow':
        return <AlertTriangle className="w-5 h-5 text-cyber-yellow" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  const getMessage = () => {
    switch (networkInfo.status) {
      case 'online':
        return '网络连接正常';
      case 'offline':
        return '网络连接已断开，请检查您的网络设置';
      case 'slow':
        return '网络连接较慢，可能影响使用体验';
      default:
        return '网络状态未知';
    }
  };

  return (
    <motion.div
      className={`fixed left-0 right-0 ${position === 'top' ? 'top-0' : 'bottom-0'} z-50 ${getBannerColor()} border-b backdrop-blur-sm`}
      initial={{ y: position === 'top' ? '-100%' : '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <p className="text-sm font-medium">{getMessage()}</p>
          </div>

          {actionButton && networkInfo.status === 'offline' && (
            <button
              onClick={actionButton.onClick}
              className="px-4 py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan rounded-lg transition-colors text-sm font-medium"
            >
              {actionButton.text}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =====================================================
// 离线页面组件
// =====================================================

interface OfflinePageProps {
  title?: string;
  message?: string;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

export function OfflinePage({
  title = '您已离线',
  message = '请检查您的网络连接后重试',
  showRetryButton = true,
  onRetry,
}: OfflinePageProps) {
  const networkInfo = useNetworkStatus();

  if (networkInfo.status !== 'offline') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="bg-cyber-pink/10 rounded-full p-8 inline-block mb-6">
            <WifiOff className="w-24 h-24 text-cyber-pink" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 mb-8">{message}</p>

        {showRetryButton && (
          <div className="flex flex-col gap-4">
            <button
              onClick={onRetry || (() => window.location.reload())}
              className="px-6 py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan rounded-lg transition-colors font-medium"
            >
              重试
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              刷新页面
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// 默认导出
// =====================================================

export default NetworkIndicator;
