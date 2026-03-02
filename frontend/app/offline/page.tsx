import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Home } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 图标 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <WifiOff className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl font-bold text-white mb-4">
          离线模式
        </h1>

        {/* 描述 */}
        <p className="text-gray-400 mb-8 text-lg">
          您当前处于离线状态。请检查网络连接后重试。
        </p>

        {/* 操作按钮 */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-5 h-5" />
            重新连接
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            返回首页
          </Link>
        </div>

        {/* 提示信息 */}
        <div className="mt-12 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
          <p className="text-gray-400 text-sm">
            部分内容可能已在缓存中，您可以：
          </p>
          <ul className="mt-2 text-gray-400 text-sm space-y-1 text-left">
            <li>• 查看已访问过的页面</li>
            <li>• 浏览缓存的博客文章</li>
            <li>• 查看作品集</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
