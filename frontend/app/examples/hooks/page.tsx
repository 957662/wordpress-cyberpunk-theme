'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { useClickOutside } from '@/lib/hooks/useClickOutside';
import { useClipboard } from '@/lib/hooks/useClipboard';
import { useOnline } from '@/lib/hooks/useNetwork';

export default function HooksExamplePage() {
  // useDebounce 示例
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);

  // useLocalStorage 示例
  const [name, setName] = useLocalStorage('name', '');
  const [count, setCount] = useLocalStorage('count', 0);

  // useClickOutside 示例
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useClickOutside(() => setIsModalOpen(false));

  // useClipboard 示例
  const { copy, isCopied } = useClipboard();

  // useOnline 示例
  const isOnline = useOnline();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            自定义 Hooks 示例
          </h1>
          <p className="text-gray-400">
            探索我们的自定义 React Hooks
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* useDebounce */}
          <Card>
            <CardHeader>
              <CardTitle>useDebounce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  搜索内容
                </label>
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="输入搜索内容..."
                />
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">防抖后的值：</p>
                <p className="text-cyan-400 font-mono">
                  {debouncedValue || '(等待输入...)'}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                延迟 500ms 后更新，减少不必要的计算
              </p>
            </CardContent>
          </Card>

          {/* useLocalStorage */}
          <Card>
            <CardHeader>
              <CardTitle>useLocalStorage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  保存名字
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入你的名字..."
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => setCount(count + 1)}
                >
                  计数: {count}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCount(0)}
                >
                  重置
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                刷新页面后数据仍然保存
              </p>
            </CardContent>
          </Card>

          {/* useClickOutside */}
          <Card>
            <CardHeader>
              <CardTitle>useClickOutside</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsModalOpen(true)}>
                打开模态框
              </Button>

              {isModalOpen && (
                <div
                  ref={modalRef as any}
                  className="absolute inset-0 flex items-center justify-center bg-black/50"
                >
                  <div className="bg-gray-800 rounded-lg p-6 max-w-sm">
                    <h3 className="text-white font-semibold mb-2">
                      模态框
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      点击外部区域关闭此模态框
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      关闭
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                点击模态框外部自动关闭
              </p>
            </CardContent>
          </Card>

          {/* useClipboard */}
          <Card>
            <CardHeader>
              <CardTitle>useClipboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <code className="text-sm text-cyan-400">
                  npm install cyberpress-platform
                </code>
              </div>
              <Button
                onClick={() => copy('npm install cyberpress-platform')}
                variant={isCopied ? 'success' : 'default'}
              >
                {isCopied ? '✓ 已复制' : '复制命令'}
              </Button>
              <p className="text-xs text-gray-500">
                一键复制到剪贴板
              </p>
            </CardContent>
          </Card>

          {/* useOnline */}
          <Card>
            <CardHeader>
              <CardTitle>useOnline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-white">
                  {isOnline ? '在线' : '离线'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                实时监控网络连接状态
              </p>
            </CardContent>
          </Card>

          {/* 说明卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>更多 Hooks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• useThrottle - 节流函数</li>
                <li>• useIntersectionObserver - 视口检测</li>
                <li>• useMediaQuery - 响应式断点</li>
                <li>• useKeyboard - 键盘快捷键</li>
                <li>• useAsync - 异步状态管理</li>
                <li>• useVirtualList - 虚拟滚动</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
