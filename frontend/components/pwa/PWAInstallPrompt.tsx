'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '@/lib/pwa/install-pwa';

interface PWAInstallPromptProps {
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  className?: string;
  showClose?: boolean;
}

const colorSchemes = {
  cyan: {
    primary: 'from-cyan-500 to-blue-500',
    secondary: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
  },
  purple: {
    primary: 'from-purple-500 to-pink-500',
    secondary: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
  },
  pink: {
    primary: 'from-pink-500 to-rose-500',
    secondary: 'text-pink-400',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
  },
  green: {
    primary: 'from-green-500 to-emerald-500',
    secondary: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
  },
  orange: {
    primary: 'from-orange-500 to-amber-500',
    secondary: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
  },
  blue: {
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
  },
};

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  colorScheme = 'cyan',
  className = '',
  showClose = true,
}) => {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = React.useState(false);
  const colors = colorSchemes[colorScheme];

  if (!isInstallable || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-40 ${className}`}
    >
      <div className={`backdrop-blur-md bg-gray-900/90 border ${colors.border} rounded-xl p-4 shadow-2xl`}>
        <div className="flex items-start gap-4">
          {/* 图标 */}
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors.primary} flex items-center justify-center flex-shrink-0`}>
            <Download className="w-6 h-6 text-white" />
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${colors.secondary} mb-1`}>
              安装应用
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              将 CyberPress 安装到您的设备上，享受更好的使用体验！
            </p>

            {/* 按钮 */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={promptInstall}
                className={`px-4 py-2 bg-gradient-to-r ${colors.primary} text-white text-sm font-medium rounded-lg`}
              >
                立即安装
              </motion.button>

              {showClose && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDismissed(true)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700"
                >
                  暂不安装
                </motion.button>
              )}
            </div>
          </div>

          {/* 关闭按钮 */}
          {showClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDismissed(true)}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* 特性列表 */}
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <ul className="text-xs text-gray-400 space-y-1">
            <li>✓ 离线访问</li>
            <li>✓ 更快的加载速度</li>
            <li>✓ 原生应用体验</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default PWAInstallPrompt;
