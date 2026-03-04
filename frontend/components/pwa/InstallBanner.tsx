'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Home, Smartphone } from 'lucide-react';

export interface InstallBannerProps {
  autoHideDelay?: number;
  showDelay?: number;
}

export function InstallBanner({
  autoHideDelay = 10000,
  showDelay = 5000,
}: InstallBannerProps = {}) {
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInstalled);

    // Check platform
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Don't show if already installed
    if (isInstalled) {
      return;
    }

    // Check if previously dismissed
    const dismissed = localStorage.getItem('install-banner-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Show banner after delay
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, showDelay);

    // Auto hide after delay
    const autoHideTimer = setTimeout(() => {
      setShowBanner(false);
    }, showDelay + autoHideDelay);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoHideTimer);
    };
  }, [showDelay, autoHideDelay]);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('install-banner-dismissed', Date.now().toString());
  };

  const handleInstall = () => {
    if (isIOS) {
      alert('安装说明:\n\n1. 点击底部的分享按钮\n2. 向下滚动找到"添加到主屏幕"\n3. 点击"添加"完成安装');
    } else {
      // For Android/Desktop, the PWAInstallPrompt will handle it
      window.location.reload();
    }
  };

  if (isStandalone || !showBanner) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink p-4 shadow-neon-cyan"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">安装 CyberPress</h3>
                <p className="text-white/80 text-sm">
                  {isIOS ? '添加到主屏幕，体验更佳' : '安装应用，获得原生体验'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 px-4 py-2 bg-white text-cyber-cyan font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                安装
              </button>

              <button
                onClick={handleDismiss}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InstallBanner;
