'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

/**
 * OfflineBanner 组件属性
 */
interface OfflineBannerProps {
  /** 自定义在线消息 */
  onlineMessage?: string;
  /** 自定义离线消息 */
  offlineMessage?: string;
  /** 显示重试按钮 */
  showRetry?: boolean;
  /** 重试回调 */
  onRetry?: () => void;
  /** 自动隐藏延迟（毫秒） */
  autoHideDelay?: number;
  /** 自定义类名 */
  className?: string;
}

/**
 * 离线提示横幅组件
 * 显示网络连接状态
 */
export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  onlineMessage = '网络已连接',
  offlineMessage = '网络连接已断开',
  showRetry = true,
  onRetry,
  autoHideDelay = 3000,
  className = '',
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // 初始状态检查
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);

      // 自动隐藏在线提示
      if (autoHideDelay > 0) {
        setTimeout(() => {
          setShowBanner(false);
        }, autoHideDelay);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoHideDelay]);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-0 left-0 right-0 z-50 ${
            isOnline
              ? 'bg-green-950/95 border-green-500/50'
              : 'bg-red-950/95 border-red-500/50'
          } backdrop-blur-md border-b shadow-lg ${className}`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              {isOnline ? (
                <>
                  <Wifi className="w-5 h-5 text-green-400" />
                  <span className="text-green-100 font-medium">{onlineMessage}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-400" />
                  <span className="text-red-100 font-medium">{offlineMessage}</span>
                  {showRetry && (
                    <button
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-red-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`}
                      />
                      重试
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 使用网络状态的 Hook
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [offlineTime, setOfflineTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineTime(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getOfflineDuration = () => {
    if (!offlineTime) return 0;
    return Date.now() - offlineTime.getTime();
  };

  return {
    isOnline,
    wasOffline,
    offlineTime,
    getOfflineDuration,
  };
}

/**
 * 网络状态指示器组件
 */
export const NetworkIndicator: React.FC<{
  showLabel?: boolean;
  className?: string;
}> = ({ showLabel = false, className = '' }) => {
  const { isOnline } = useNetworkStatus();

  return (
    <div
      className={`flex items-center gap-2 ${className} ${
        isOnline ? 'text-green-400' : 'text-red-400'
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
        }`}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isOnline ? '在线' : '离线'}
        </span>
      )}
    </div>
  );
};

export default OfflineBanner;
