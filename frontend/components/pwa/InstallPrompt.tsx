'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

/**
 * PWA 安装提示接口
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * InstallPrompt 组件属性
 */
interface InstallPromptProps {
  /** 自定义提示内容 */
  customContent?: ReactNode;
  /** 延迟显示时间（毫秒） */
  delay?: number;
  /** 显示时长（毫秒，0为不自动关闭） */
  duration?: number;
  /** 是否在移动端显示 */
  showOnMobile?: boolean;
  /** 是否在桌面端显示 */
  showOnDesktop?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * PWA 安装提示组件
 * 引导用户安装 PWA 应用
 */
export const InstallPrompt: React.FC<InstallPromptProps> = ({
  customContent,
  delay = 3000,
  duration = 0,
  showOnMobile = true,
  showOnDesktop = true,
  className = '',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测设备类型
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|ipad|iphone|ipod/i.test(userAgent) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // 检查是否已安装
  useEffect(() => {
    const checkInstalled = () => {
      // 检查是否在 standalone 模式下运行
      const isInStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      setIsInstalled(isInStandaloneMode);
    };

    checkInstalled();
  }, []);

  // 监听 beforeinstallprompt 事件
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      // 阻止默认安装提示
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // 延迟显示自定义提示
      if (!isInstalled) {
        setTimeout(() => {
          const shouldShow =
            (isMobile && showOnMobile) || (!isMobile && showOnDesktop);
          setShowPrompt(shouldShow);
        }, delay);
      }
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
  }, [delay, isMobile, showOnMobile, showOnDesktop, isInstalled]);

  // 自动关闭提示
  useEffect(() => {
    if (duration > 0 && showPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, showPrompt]);

  // 处理安装点击
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // 显示安装提示
    deferredPrompt.prompt();

    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  // 关闭提示
  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // 如果已安装或不显示，不渲染
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  // 默认提示内容
  const defaultContent = (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Download className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-white text-lg">安装应用</h3>
        <p className="text-gray-400 text-sm">
          {isMobile
            ? '添加到主屏幕，获得更好的体验'
            : '安装到桌面，获得原生应用体验'}
        </p>
      </div>
      <button
        onClick={handleInstall}
        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
      >
        安装
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}
        >
          <div className="bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 p-4">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
            {customContent || defaultContent}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 使用 PWA 安装提示的 Hook
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    // 检查是否已安装
    const checkInstalled = () => {
      const isInStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsInstalled(isInStandaloneMode);
    };

    checkInstalled();
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setCanInstall(false);

    return outcome === 'accepted';
  };

  return {
    canInstall,
    isInstalled,
    promptInstall,
  };
}

export default InstallPrompt;
