/**
 * 网络状态指示器组件
 * CyberPress Platform
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NetworkStatusProps {
  position?: 'top' | 'bottom';
  showIndicator?: boolean;
  className?: string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  position = 'top',
  showIndicator = true,
  className = '',
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // 初始化网络状态
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <>
      {/* 离线横幅 */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: position === 'top' ? '-100%' : '100%' }}
            animate={{ y: 0 }}
            exit={{ y: position === 'top' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed ${positionClass} left-0 right-0 z-50 bg-gradient-to-r from-cyber-pink to-cyber-purple text-white px-4 py-3 ${className}`}
          >
            <div className="container mx-auto flex items-center justify-center gap-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
              <span className="font-medium">
                您当前处于离线状态，部分功能可能不可用
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 网络状态指示器 */}
      {showIndicator && (
        <div
          className={`fixed bottom-4 left-4 z-40 bg-cyber-dark/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 ${className}`}
        >
          <div className="flex items-center gap-2">
            {/* 状态指示点 */}
            <div className="relative">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-cyber-green' : 'bg-cyber-pink'
                }`}
              />
              {!isOnline && (
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyber-pink animate-ping" />
              )}
            </div>

            {/* 状态文本 */}
            <span className="text-sm text-gray-400">
              {isOnline ? '在线' : '离线'}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default NetworkStatus;
