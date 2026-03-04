'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Rocket } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 检测 iOS 设备
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // 检查是否已安装
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      return; // 已安装，不显示提示
    }

    // 监听 beforeinstallprompt 事件
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // 延迟显示提示，提升用户体验
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleAppInstalled = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 保存用户的选择到 localStorage
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // 检查用户是否在7天内已关闭过提示
  const checkDismissedTime = () => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      return daysSinceDismissed < 7;
    }
    return false;
  };

  if (checkDismissedTime() || !showPrompt) {
    return null;
  }

  // iOS 显示不同的提示
  if (isIOS) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-cyber-card border border-cyber-cyan/30 rounded-lg p-4 shadow-lg shadow-cyber-cyan/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-cyber-cyan mb-1">
                  安装 CyberPress
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  在 Safari 浏览器中,点击分享按钮,然后选择"添加到主屏幕"
                </p>
                <button
                  onClick={handleDismiss}
                  className="w-full px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/20 transition-colors"
                >
                  知道了
                </button>
              </div>

              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Android/Desktop 显示标准安装提示
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="bg-cyber-card border border-cyber-cyan/30 rounded-lg p-4 shadow-lg shadow-cyber-cyan/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-cyber-cyan mb-1">
                安装应用
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                安装 CyberPress 到桌面，获得更好的体验
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  立即安装
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 border border-cyber-border text-gray-300 rounded-lg hover:border-cyber-cyan/50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
