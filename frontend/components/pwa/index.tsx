/**
 * PWA Install Prompt Component
 * PWA 安装提示组件
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Chrome } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 检测 iOS 设备
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) &&
!(window.MSStream);
    setIsIOS(isIOSDevice);

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 延迟显示提示，给用户时间浏览网站
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // 检测是否已安装
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkIfInstalled();

    // 检查是否已经显示过提示
    const hasShownPrompt = localStorage.getItem('pwa-install-prompt-shown');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (!hasShownPrompt && !isStandalone && isIOSDevice) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // 显示安装提示
    deferredPrompt.prompt();

    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // 清除 deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);

    // 记录已显示过提示
    localStorage.setItem('pwa-install-prompt-shown', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-shown', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="cyber-card p-4 border-2 border-cyber-cyan/30 bg-cyber-dark/95 backdrop-blur-xl">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-cyber-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Chrome className="w-6 h-6 text-cyber-cyan" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                安装应用
              </h3>
              <p className="text-sm text-gray-400">
                {isIOS ? (
                  <>
                    在 Safari 中点击分享按钮，然后选择"添加到主屏幕"
                  </>
                ) : (
                  <>
                    安装我们的应用，获得更好的体验
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isIOS && (
              <CyberButton
                variant="primary"
                size="sm"
                fullWidth
                icon={<Download className="w-4 h-4" />}
                onClick={handleInstallClick}
              >
                立即安装
              </CyberButton>
            )}
            <CyberButton
              variant="outline"
              size="sm"
              fullWidth={!isIOS}
              onClick={handleDismiss}
            >
              稍后再说
            </CyberButton>
          </div>

          {/* iOS 安装指引 */}
          {isIOS && (
            <div className="mt-4 p-3 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/20">
              <div className="flex items-center gap-2 text-sm text-cyber-cyan">
                <span className="font-semibold">步骤：</span>
              </div>
              <ol className="mt-2 space-y-1 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-4 h-4 bg-cyber-cyan/20 rounded-full flex items-center justify-center text-cyber-cyan text-xs font-bold">1</span>
                  <span>点击底部的分享按钮 ⎋</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-4 h-4 bg-cyber-cyan/20 rounded-full flex items-center justify-center text-cyber-cyan text-xs font-bold">2</span>
                  <span>向下滚动并点击"添加到主屏幕"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-4 h-4 bg-cyber-cyan/20 rounded-full flex items-center justify-center text-cyber-cyan text-xs font-bold">3</span>
                  <span>点击"添加"完成安装</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PWAInstallPrompt;
