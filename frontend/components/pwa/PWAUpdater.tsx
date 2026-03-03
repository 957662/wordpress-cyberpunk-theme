'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, RefreshCw } from 'lucide-react';
import { CyberButton } from '../cyber/cyber-button';

export function PWAUpdater() {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // 监听 Service Worker 更新
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 有新版本可用
              setWaitingServiceWorker(newWorker);
              setShowUpdatePrompt(true);
            }
          });
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingServiceWorker) {
      // 告诉 Service Worker 跳过等待
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });

      // 刷新页面以应用更新
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="cyber-card p-6 max-w-md w-full border-2 border-cyber-purple">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-cyber-purple/20 rounded-lg">
              <Download className="w-8 h-8 text-cyber-purple" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyber-purple">新版本可用</h3>
              <p className="text-sm text-gray-400 mt-1">
                CyberPress 已有新版本更新
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-sm">
              更新内容：
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-400">
              <li>• 性能优化和 bug 修复</li>
              <li>• 新功能和改进</li>
              <li>• 安全性增强</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <CyberButton
              onClick={handleUpdate}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              立即更新
            </CyberButton>
            <CyberButton
              onClick={handleDismiss}
              variant="outline"
              className="px-6"
            >
              稍后
            </CyberButton>
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center">
            更新后页面将自动刷新
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
