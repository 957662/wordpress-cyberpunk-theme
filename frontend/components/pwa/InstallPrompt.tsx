'use client';

/**
 * CyberPress Platform - PWA Install Prompt Component
 * PWA 安装提示组件
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Safari } from 'lucide-react';
import { CyberButton } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallPromptProps {
  showDelay?: number;
  dismissDuration?: number;
  className?: string;
}

export function PWAInstallPrompt({
  showDelay = 3000,
  dismissDuration = 7 * 24 * 60 * 60 * 1000,
  className,
}: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < dismissDuration) {
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => {
        setShowPrompt(true);
      }, showDelay);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showDelay, dismissDuration]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96',
          'bg-gradient-to-br from-cyber-dark to-cyber-muted',
          'border border-cyber-cyan/30 rounded-2xl p-4',
          'shadow-2xl shadow-cyber-cyan/20',
          'z-50',
          className
        )}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold mb-1">
              安装 CyberPress
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {isIOS
                ? '在 Safari 浏览器中点击分享按钮，然后选择"添加到主屏幕"'
                : '将应用安装到主屏幕，获得更好的使用体验'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isIOS ? (
            <CyberButton
              variant="primary"
              size="sm"
              onClick={handleInstall}
              className="flex-1 gap-2"
            >
              <Download className="w-4 h-4" />
              立即安装
            </CyberButton>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-400 flex-1">
              <Safari className="w-4 h-4" />
              <span>使用 Safari 浏览器</span>
            </div>
          )}
          <CyberButton
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
          >
            稍后
          </CyberButton>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <ul className="text-xs text-gray-400 space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyber-cyan rounded-full" />
              离线访问
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyber-cyan rounded-full" />
              更快的加载速度
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyber-cyan rounded-full" />
              原生应用体验
            </li>
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PWAInstallPrompt;
