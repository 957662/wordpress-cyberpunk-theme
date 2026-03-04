'use client';

/**
 * Utils Demo Page
 * 工具函数演示页面
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage, useMediaQuery } from '@/lib/hooks';
import { copyToClipboard } from '@/lib/clipboard';

export default function UtilsDemoNewPage() {
  const [text, setText] = useState('Hello, CyberPress!');
  const [debouncedText, setDebouncedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [name, setName, removeName] = useLocalStorage('name', 'Guest');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    setIsCopied(success);
    if (success) {
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Utility Functions Demo
          </h1>
          <p className="text-xl text-gray-400">
            探索实用的工具函数和 Hooks
          </p>
        </motion.div>

        {/* Clipboard Utils */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">剪贴板工具</h2>
          <div className="cyber-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white"
                placeholder="输入要复制的文本"
              />
              <button
                onClick={handleCopy}
                className="px-6 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-semibold"
              >
                {isCopied ? '已复制!' : '复制'}
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              点击复制按钮将文本复制到剪贴板。复制成功后会显示提示。
            </p>
          </div>
        </section>

        {/* LocalStorage Hook */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">LocalStorage Hook</h2>
          <div className="cyber-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white"
                placeholder="输入你的名字"
              />
              <button
                onClick={removeName}
                className="px-6 py-2 bg-cyber-purple text-white rounded-lg font-semibold"
              >
                清除
              </button>
            </div>
            <p className="text-gray-400">
              当前值: <span className="text-cyber-cyan font-mono">{name}</span>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              这个值会保存到 localStorage，刷新页面后依然存在。
            </p>
          </div>
        </section>

        {/* Media Query Hook */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Media Query Hook</h2>
          <div className="cyber-card p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isMobile ? 'bg-cyber-cyan/20 border-2 border-cyber-cyan' : 'bg-cyber-dark border border-cyber-border'}`}>
                <div className="text-white font-semibold mb-2">移动设备</div>
                <div className={`text-2xl font-bold ${isMobile ? 'text-cyber-cyan' : 'text-gray-600'}`}>
                  {isMobile ? '✓' : '✗'}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDesktop ? 'bg-cyber-purple/20 border-2 border-cyber-purple' : 'bg-cyber-dark border border-cyber-border'}`}>
                <div className="text-white font-semibold mb-2">桌面设备</div>
                <div className={`text-2xl font-bold ${isDesktop ? 'text-cyber-purple' : 'text-gray-600'}`}>
                  {isDesktop ? '✓' : '✗'}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${!isMobile && !isDesktop ? 'bg-cyber-pink/20 border-2 border-cyber-pink' : 'bg-cyber-dark border border-cyber-border'}`}>
                <div className="text-white font-semibold mb-2">平板设备</div>
                <div className={`text-2xl font-bold ${!isMobile && !isDesktop ? 'text-cyber-pink' : 'text-gray-600'}`}>
                  {!isMobile && !isDesktop ? '✓' : '✗'}
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              调整浏览器窗口大小查看响应式检测效果。
            </p>
          </div>
        </section>

        {/* Debounce Demo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">防抖 (Debounce)</h2>
          <div className="cyber-card p-6">
            <input
              type="text"
              onChange={(e) => {
                setText(e.target.value);
                // 模拟防抖效果
                setTimeout(() => {
                  setDebouncedText(e.target.value);
                }, 500);
              }}
              className="w-full px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white mb-4"
              placeholder="输入文本（500ms 防抖）"
            />
            <div className="space-y-2">
              <p className="text-gray-400">
                输入值: <span className="text-cyber-cyan font-mono">{text || '-'}</span>
              </p>
              <p className="text-gray-400">
                防抖值: <span className="text-cyber-purple font-mono">{debouncedText || '-'}</span>
              </p>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              防抖会延迟执行，直到用户停止输入 500ms 后才更新值。
            </p>
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">代码示例</h2>
          <div className="space-y-4">
            <div className="cyber-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">使用剪贴板工具</h3>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-cyber-cyan">
{`import { copyToClipboard } from '@/lib/clipboard';

// 复制文本
await copyToClipboard('Hello, World!');`}
                </code>
              </pre>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">使用 LocalStorage Hook</h3>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-cyber-cyan">
{`import { useLocalStorage } from '@/lib/hooks';

const [name, setName, removeName] = useLocalStorage('name', 'Guest');

// 设置值
setName('John');

// 删除值
removeName();`}
                </code>
              </pre>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">使用 Media Query Hook</h3>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-cyber-cyan">
{`import { useMediaQuery } from '@/lib/hooks';

const isMobile = useMediaQuery('(max-width: 768px)');
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

if (isMobile) {
  // 移动设备逻辑
}`}
                </code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
