'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatAssistant from '@/components/ai-chat';
import { SystemMonitor } from '@/components/performance/SystemMonitor';
import { EnhancedCodeBlock } from '@/components/code-display/EnhancedCodeBlock';
import { SmartSearch } from '@/components/smart-search/SmartSearch';

export default function ComponentShowcase2026() {
  const [selectedTab, setSelectedTab] = useState<'chat' | 'monitor' | 'code' | 'search'>('chat');

  const tabs = [
    { id: 'chat', name: 'AI 聊天助手', icon: '🤖' },
    { id: 'monitor', name: '系统监控', icon: '📊' },
    { id: 'code', name: '代码展示', icon: '💻' },
    { id: 'search', name: '智能搜索', icon: '🔍' },
  ] as const;

  const sampleCode = `// CyberPress Platform - 示例代码
import React, { useState, useEffect } from 'react';

interface CyberComponentProps {
  theme: 'cyber' | 'neon' | 'holo';
  intensity: number;
}

export const CyberComponent: React.FC<CyberComponentProps> = ({
  theme,
  intensity = 100
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const effect = new CyberEffect(theme, intensity);
    return () => effect.dispose();
  }, [theme, intensity]);

  return (
    <div className={\`cyber-container \${theme}\`}>
      <h1>赛博朋克组件</h1>
      <p>强度: {intensity}%</p>
      <button onClick={() => setActive(!active)}>
        {active ? '停用' : '启用'}
      </button>
    </div>
  );
};

export default CyberComponent;`;

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <div className="border-b border-cyber-cyan/20 bg-cyber-dark/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">新组件演示</h1>
          <p className="text-cyber-cyan/50">展示最新创建的赛博朋克风格组件</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-lg shadow-cyber-cyan/30'
                  : 'bg-cyber-dark/50 border border-cyber-cyan/30 text-cyber-cyan/70 hover:border-cyber-cyan hover:text-cyber-cyan'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">AI 聊天助手</h2>
                <p className="text-cyber-cyan/70 mb-6">
                  一个赛博朋克风格的 AI 聊天界面，支持实时对话、打字指示器和多种主题。
                  点击右下角的按钮开始体验。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyber-cyan">特性</h3>
                    <ul className="space-y-1 text-sm text-cyber-cyan/70">
                      <li>✨ 流畅的动画效果</li>
                      <li>💬 实时打字指示器</li>
                      <li>🎨 多种主题切换</li>
                      <li>📱 响应式设计</li>
                      <li>⌨️ 键盘快捷键支持</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyber-cyan">使用示例</h3>
                    <pre className="text-xs text-cyber-cyan/50 bg-cyber-dark/50 p-3 rounded-lg overflow-x-auto">
{`<AIChatAssistant
  initialMessage="你好！"
  theme="cyber"
  position="bottom-right"
  onMessageSend={handleSend}
/>`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Demo Area */}
              <div className="bg-cyber-muted/10 border border-cyber-cyan/20 rounded-xl p-8 min-h-[400px] relative">
                <p className="text-cyber-cyan/50 text-center mb-4">聊天助手将出现在右下角</p>
              </div>

              {/* AI Chat Assistant Component */}
              <AIChatAssistant
                initialMessage="你好！我是 AI 助手，有什么可以帮你的吗？"
                theme="cyber"
                position="bottom-right"
              />
            </motion.div>
          )}

          {selectedTab === 'monitor' && (
            <motion.div
              key="monitor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">系统监控</h2>
                <p className="text-cyber-cyan/70 mb-6">
                  实时显示系统性能指标，包括 CPU、内存、磁盘使用率等。
                  数据每 2 秒自动更新。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyber-cyan">特性</h3>
                    <ul className="space-y-1 text-sm text-cyber-cyan/70">
                      <li>📊 实时数据更新</li>
                      <li>📈 性能趋势图表</li>
                      <li>⚠️ 智能阈值警告</li>
                      <li>🔄 手动刷新功能</li>
                      <li>📦 紧凑模式支持</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyber-cyan">使用示例</h3>
                    <pre className="text-xs text-cyber-cyan/50 bg-cyber-dark/50 p-3 rounded-lg overflow-x-auto">
{`<SystemMonitor
  refreshInterval={2000}
  showDetails={true}
  compact={false}
/>`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Demo Area */}
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-6">
                <SystemMonitor
                  refreshInterval={2000}
                  showDetails={true}
                  compact={false}
                />
              </div>
            </motion.div>
          )}

          {selectedTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">代码展示组件</h2>
                <p className="text-cyber-cyan/70 mb-6">
                  增强的代码块组件，支持语法高亮、行号、复制、下载等功能。
                  提供多种主题和内联代码组件。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyber-cyan">特性</h3>
                    <ul className="space-y-1 text-sm text-cyber-cyan/70">
                      <li>🎨 多主题切换</li>
                      <li>📋 一键复制代码</li>
                      <li>💾 下载代码文件</li>
                      <li>🔢 行号显示</li>
                      <li>📏 字符和行数统计</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyber-cyan">使用示例</h3>
                    <pre className="text-xs text-cyber-cyan/50 bg-cyber-dark/50 p-3 rounded-lg overflow-x-auto">
{`<EnhancedCodeBlock
  code={code}
  language="typescript"
  filename="example.ts"
  showLineNumbers={true}
  allowExpand={true}
/>`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Demo Area */}
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-6">
                <EnhancedCodeBlock
                  code={sampleCode}
                  language="typescript"
                  filename="CyberComponent.tsx"
                  title="赛博朋克组件示例"
                  showLineNumbers={true}
                  theme="cyber"
                  allowExpand={true}
                />
              </div>

              {/* Inline Code Demo */}
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">内联代码示例</h3>
                <p className="text-cyber-cyan/70 mb-4">
                  你可以在文本中使用内联代码来高亮显示代码片段。
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['default', 'success', 'warning', 'error'].map((variant) => (
                    <button
                      key={variant}
                      className="px-3 py-1.5 rounded-lg bg-cyber-muted/50 border border-cyber-cyan/30 text-cyber-cyan text-sm"
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">智能搜索</h2>
                <p className="text-cyber-cyan/70 mb-6">
                  带即时预览和搜索建议的智能搜索组件。支持最近搜索、热门搜索和键盘导航。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyber-cyan">特性</h3>
                    <ul className="space-y-1 text-sm text-cyber-cyan/70">
                      <li>⚡ 实时搜索建议</li>
                      <li>🕐 最近搜索历史</li>
                      <li>🔥 热门搜索趋势</li>
                      <li>⌨️ 键盘快捷键</li>
                      <li>🎯 多类型结果</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyber-cyan">使用示例</h3>
                    <pre className="text-xs text-cyber-cyan/50 bg-cyber-dark/50 p-3 rounded-lg overflow-x-auto">
{`<SmartSearch
  placeholder="搜索..."
  maxResults={8}
  showRecent={true}
  showTrending={true}
  onSearch={handleSearch}
  onSelect={handleSelect}
/>`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Demo Area */}
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-12 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  <SmartSearch
                    placeholder="搜索文章、用户、标签..."
                    maxResults={8}
                    showRecent={true}
                    showTrending={true}
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">使用说明</h3>
                <div className="space-y-2 text-sm text-cyber-cyan/70">
                  <p>💡 <strong>提示：</strong> 点击输入框开始搜索，支持键盘导航</p>
                  <p>⌨️ <strong>快捷键：</strong> 使用 ↑↓ 键选择结果，Enter 键确认</p>
                  <p>🔍 <strong>搜索：</strong> 输入任意关键词查看搜索结果</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-cyber-cyan/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-cyber-cyan/50 text-sm">
          <p>CyberPress Platform - 新组件演示页面 (2026)</p>
          <p className="mt-1">使用 Next.js 14 + TypeScript + Tailwind CSS 构建</p>
        </div>
      </div>
    </div>
  );
}
