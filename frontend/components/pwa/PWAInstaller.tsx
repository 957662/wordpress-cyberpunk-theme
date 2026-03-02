/**
 * PWA安装提示组件
 * 检测并引导用户安装PWA应用
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Home } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // 检测iOS设备
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // iOS设备延迟显示提示（假设用户对应用有兴趣）
    if (isIOSDevice) {
      const hasSeenPrompt = sessionStorage.getItem('ios-install-prompt');
      const timer = setTimeout(() => {
        if (!hasSeenPrompt) {
          setShowInstallPrompt(true);
        }
      }, 30000); // 30秒后显示
      return () => clearTimeout(timer);
    }

    // 监听beforeinstallprompt事件
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 延迟显示提示，让用户先浏览内容
      const timer = setTimeout(() => {
        const hasSeenPrompt = sessionStorage.getItem('pwa-install-prompt');
        if (!hasSeenPrompt) {
          setShowInstallPrompt(true);
        }
      }, 15000); // 15秒后显示

      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA安装被接受');
    } else {
      console.log('PWA安装被拒绝');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
    sessionStorage.setItem('pwa-install-prompt', 'true');
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    if (isIOS) {
      sessionStorage.setItem('ios-install-prompt', 'true');
    } else {
      sessionStorage.setItem('pwa-install-prompt', 'true');
    }
  };

  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <Card variant="hologram" className="p-4 relative">
            {/* 关闭按钮 */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 内容 */}
            <div className="flex gap-4">
              {/* 图标 */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-white">CP</span>
                </div>
              </div>

              {/* 文本 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg mb-1">
                  {isIOS ? '添加到主屏幕' : '安装应用'}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {isIOS
                    ? '在 Safari 中点击分享按钮，然后选择"添加到主屏幕"'
                    : '安装 CyberPress 到您的设备，享受更好的体验'}
                </p>

                {/* 安装按钮 */}
                {!isIOS && (
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    立即安装
                  </Button>
                )}

                {/* iOS 指示 */}
                {isIOS && (
                  <div className="flex items-center gap-2 text-sm text-cyber-cyan">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm-.5 2.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 010 1h-1a.5.5 0 010-1h1z" />
                    </svg>
                    <span>点击分享按钮</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
