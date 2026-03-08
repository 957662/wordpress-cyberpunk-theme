/**
 * Offline Page
 * 离线页面 - 当用户离线时显示
 */

import Link from 'next/link';
import { WifiOff, RefreshCw, Home, BookOpen } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-cyber-cyan/10 rounded-full border-2 border-cyber-cyan/30">
            <WifiOff className="w-12 h-12 text-cyber-cyan" />
          </div>
        </div>

        {/* Message */}
        <div className="cyber-card p-8 text-center border border-cyber-cyan/30 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            您已离线
          </h1>

          <p className="text-gray-400 mb-6">
            看起来您的网络连接已断开。请检查您的网络设置后重试。
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <CyberButton
              variant="primary"
              size="lg"
              fullWidth
              icon={<RefreshCw className="w-5 h-5" />}
              onClick={handleRetry}
            >
              重新加载
            </CyberButton>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <CyberButton
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon={<Home className="w-5 h-5" />}
                >
                  首页
                </CyberButton>
              </Link>

              <Link href="/blog" className="flex-1">
                <CyberButton
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon={<BookOpen className="w-5 h-5" />}
                >
                  博客
                </CyberButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="cyber-card p-6 border border-cyber-border/50">
          <h2 className="text-lg font-semibold text-white mb-4">
            故障排除提示
          </h2>

          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan mt-0.5">•</span>
              <span>检查您的 Wi-Fi 或移动数据连接</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan mt-0.5">•</span>
              <span>尝试重新启动您的路由器</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan mt-0.5">•</span>
              <span>检查是否有可用的离线内容</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan mt-0.5">•</span>
              <span>如果问题持续存在，请联系您的网络服务提供商</span>
            </li>
          </ul>
        </div>

        {/* Offline Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>CyberPress 支持离线浏览已缓存的内容</p>
          <p className="mt-1">部分功能可能在离线时不可用</p>
        </div>
      </div>
    </div>
  );
}
