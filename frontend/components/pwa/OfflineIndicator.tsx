'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div
            className={`mx-auto mt-4 max-w-md px-4 py-3 rounded-lg ${
              isOnline
                ? 'bg-cyber-green/20 border border-cyber-green/50'
                : 'bg-cyber-pink/20 border border-cyber-pink/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {isOnline ? (
                <>
                  <Wifi className="w-5 h-5 text-cyber-green" />
                  <div>
                    <p className="font-semibold text-cyber-green">网络已连接</p>
                    <p className="text-sm text-gray-300">你的网络连接已恢复</p>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-cyber-pink" />
                  <div>
                    <p className="font-semibold text-cyber-pink">网络已断开</p>
                    <p className="text-sm text-gray-300">你正在离线浏览，部分功能可能受限</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
