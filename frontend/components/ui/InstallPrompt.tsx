/**
 * PWA 安装提示组件
 * CyberPress Platform
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  className?: string;
  delay?: number;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  className = '',
  delay = 3000,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // 检查是否已拒绝安装
    const hasDismissed = localStorage.getItem('install-prompt-dismissed');
    if (hasDismissed) {
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 延迟显示提示
      setTimeout(() => {
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, delay);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [delay, dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-cyber-dark/95 backdrop-blur-lg border border-cyber-cyan/30 rounded-xl p-6 shadow-2xl shadow-cyber-cyan/20 z-50 ${className}`}
        >
          {/* 关闭按钮 */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="关闭"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* 内容 */}
          <div className="flex items-start gap-4">
            {/* 图标 */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* 文本 */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                安装 CyberPress
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                一键安装到桌面，享受更流畅的体验
              </p>

              {/* 按钮 */}
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyber-cyan/50 transition-all duration-300"
                >
                  立即安装
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  暂不
                </button>
              </div>
            </div>
          </div>

          {/* 装饰线 */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
