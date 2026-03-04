'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, Loader2 } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // 初始化在线状态
    setIsOnline(navigator.onLine);

    // 获取网络类型
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setConnectionType(conn.effectiveType || 'unknown');

      const handleConnectionChange = () => {
        setConnectionType(conn.effectiveType || 'unknown');
      };

      conn.addEventListener('change', handleConnectionChange);
      return () => conn.removeEventListener('change', handleConnectionChange);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getConnectionColor = () => {
    if (connectionType === '4g') return 'text-cyber-green';
    if (connectionType === '3g') return 'text-cyber-yellow';
    if (connectionType === '2g') return 'text-cyber-pink';
    return 'text-gray-400';
  };

  const getConnectionSpeed = () => {
    if (connectionType === '4g') return '快速';
    if (connectionType === '3g') return '一般';
    if (connectionType === '2g') return '缓慢';
    return '未知';
  };

  return (
    <>
      {/* 顶部状态栏指示器 */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div
              className={`mx-4 mt-4 p-4 rounded-lg border ${
                isOnline
                  ? 'bg-cyber-green/10 border-cyber-green/30'
                  : 'bg-cyber-pink/10 border-cyber-pink/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <>
                    <Wifi className="w-5 h-5 text-cyber-green" />
                    <div className="flex-1">
                      <p className="text-white font-medium">网络已连接</p>
                      <p className="text-sm text-gray-400">网络速度: {getConnectionSpeed()}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-cyber-pink" />
                    <div className="flex-1">
                      <p className="text-white font-medium">网络已断开</p>
                      <p className="text-sm text-gray-400">您正在浏览离线缓存内容</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部状态栏 */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="bg-cyber-card/90 backdrop-blur border-t border-cyber-pink/30 p-3">
              <div className="flex items-center justify-center gap-2">
                <WifiOff className="w-4 h-4 text-cyber-pink" />
                <span className="text-sm text-gray-300">离线模式</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 网络速度指示器 (开发环境) */}
      {process.env.NODE_ENV === 'development' && connectionType !== 'unknown' && (
        <div className="fixed bottom-20 right-4 z-40">
          <div className="bg-cyber-card/80 backdrop-blur border border-cyber-border rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className={getConnectionColor()}>{connectionType.toUpperCase()}</span>
              <span className="text-gray-400">{getConnectionSpeed()}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
