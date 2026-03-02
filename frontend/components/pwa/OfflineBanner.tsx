'use client';

/**
 * CyberPress Platform - Offline Banner Component
 * 离线横幅组件
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, X } from 'lucide-react';
import { CyberButton } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface OfflineBannerProps {
  className?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export function OfflineBanner({
  className,
  autoHide = false,
  autoHideDelay = 5000,
}: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (autoHide) {
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
  }, [autoHide, autoHideDelay]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {!isOnline && showBanner && (
        <motion.div
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '-100%' }}
          className={cn(
            'fixed top-0 left-0 right-0 z-50',
            'bg-gradient-to-r from-red-600/95 to-red-500/95',
            'backdrop-blur-sm border-b border-red-400/30',
            'shadow-lg shadow-red-500/20',
            className
          )}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <WifiOff className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">
                    网络连接已断开
                  </p>
                  <p className="text-red-100 text-xs">
                    请检查您的网络连接
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <CyberButton
                  variant="secondary"
                  size="sm"
                  onClick={handleRetry}
                  className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  重试
                </CyberButton>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 text-white/80 hover:text-white transition-colors"
                  aria-label="关闭"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isOnline && showBanner && (
        <motion.div
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '-100%' }}
          className={cn(
            'fixed top-0 left-0 right-0 z-50',
            'bg-gradient-to-r from-green-600/95 to-green-500/95',
            'backdrop-blur-sm border-b border-green-400/30',
            'shadow-lg shadow-green-500/20',
            className
          )}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">
                    网络已重新连接
                  </p>
                  <p className="text-green-100 text-xs">
                    您可以继续浏览
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="p-1.5 text-white/80 hover:text-white transition-colors flex-shrink-0"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OfflineBanner;
