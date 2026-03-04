/**
 * PWA 应用页面
 * 支持安装提示和离线访问
 * CyberPress Platform
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AppPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // 监听安装提示事件
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 监听网络状态
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始化网络状态
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cyber-cyan/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-cyber-cyan"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            应用已安装
          </h1>
          <p className="text-gray-400">
            CyberPress 已作为独立应用运行
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 网络状态指示器 */}
      {!isOnline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-cyber-pink text-white px-4 py-2 text-center text-sm font-medium"
        >
          您当前处于离线状态，部分功能可能不可用
        </motion.div>
      )}

      {/* 主内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 头部 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              CyberPress Platform
            </h1>
            <p className="text-gray-400 text-lg">
              现代化的赛博朋克风格博客平台
            </p>
          </motion.div>

          {/* 功能卡片 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg p-6"
            >
              <div className="w-12 h-12 mb-4 rounded-lg bg-cyber-cyan/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyber-cyan"
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
              <h3 className="text-xl font-semibold text-white mb-2">
                PWA 支持
              </h3>
              <p className="text-gray-400">
                可安装为桌面应用，支持离线访问
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-cyber-dark/50 backdrop-blur-sm border border-cyber-purple/20 rounded-lg p-6"
            >
              <div className="w-12 h-12 mb-4 rounded-lg bg-cyber-purple/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyber-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                极速性能
              </h3>
              <p className="text-gray-400">
                优化的加载速度和流畅的交互体验
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-cyber-dark/50 backdrop-blur-sm border border-cyber-pink/20 rounded-lg p-6"
            >
              <div className="w-12 h-12 mb-4 rounded-lg bg-cyber-pink/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyber-pink"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                推送通知
              </h3>
              <p className="text-gray-400">
                实时接收重要更新和消息通知
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-cyber-dark/50 backdrop-blur-sm border border-cyber-green/20 rounded-lg p-6"
            >
              <div className="w-12 h-12 mb-4 rounded-lg bg-cyber-green/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyber-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                安全可靠
              </h3>
              <p className="text-gray-400">
                现代化的安全措施和数据保护
              </p>
            </motion.div>
          </div>

          {/* 安装按钮 */}
          {isInstallable && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-semibold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-cyber-cyan/50 transition-all duration-300"
              >
                安装应用到桌面
              </button>
              <p className="text-gray-400 text-sm mt-2">
                一键安装，无需应用商店
              </p>
            </motion.div>
          )}

          {/* 网络状态 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-cyber-green' : 'bg-cyber-pink'
              }`}
            />
            {isOnline ? '在线' : '离线'}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
