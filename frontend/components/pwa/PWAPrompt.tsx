/**
 * PWAPrompt Component
 * PWA 安装提示组件
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // 阻止默认的安装提示
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 延迟显示自定义提示
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // 显示原生安装提示
    deferredPrompt.prompt();

    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    } else {
      console.log('PWA dismissed');
    }

    // 清除 deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // 检查是否已经安装
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 检查是否在 PWA 模式下运行
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  // 如果已经安装或不显示提示，则不渲染
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="cyber-card p-4 border border-cyber-cyan/30 shadow-neon-cyan">
          <div className="flex items-start gap-3">
            {/* App Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1">
                安装 CyberPress
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                安装应用以获得更好的体验，离线访问，快速启动。
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <CyberButton
                  size="sm"
                  variant="primary"
                  onClick={handleInstall}
                  className="flex-1"
                >
                  安装
                </CyberButton>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors"
                >
                  暂不
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
