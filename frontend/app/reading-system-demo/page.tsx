'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ReadingProgressSystem,
  CompactReadingProgress,
  FloatingReadingProgress,
  DetailedReadingStats,
} from '@/components/reading-progress-system/ReadingProgressSystem';
import { useReadingProgress, useReadingTime } from '@/components/reading-progress-system/useReadingProgress';
import { calculateReadingTime } from '@/components/reading-progress-system/utils';

// Sample blog post content
const SAMPLE_POST = `
# 深入理解 React Server Components

React Server Components (RSC) 是 React 18 引入的一个新特性，它允许组件在服务器上渲染，
从而减少发送到客户端的 JavaScript 代码量。

## 什么是 Server Components？

Server Components 是一种特殊的 React 组件，它们只在服务器上运行，永远不会发送到客户端。
这意味着它们可以直接访问后端资源，如数据库、文件系统等。

## 主要优势

### 1. 减少客户端 JavaScript

传统的 React 应用需要将所有组件代码发送到客户端，这会增加初始加载时间。
Server Components 只发送渲染后的 HTML，大大减少了 JavaScript 代码量。

### 2. 直接访问后端资源

Server Components 可以直接访问数据库、文件系统和其他后端资源，
无需创建额外的 API 端点。

### 3. 自动代码分割

Server Components 的导入会被自动分割，只有客户端组件会被包含在最终的 JavaScript bundle 中。

## 使用示例

\`\`\`jsx
// Server Component (默认)
async function BlogPost({ id }) {
  const post = await db.posts.findUnique({ where: { id } });

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Client Component */}
      <LikeButton postId={post.id} />
    </article>
  );
}

// Client Component
'use client';
function LikeButton({ postId }) {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(l => l + 1)}>
      ❤️ {likes}
    </button>
  );
}
\`\`\`

## 最佳实践

1. **将数据获取逻辑放在 Server Components 中**
2. **只在需要交互时使用 Client Components**
3. **在组件边界使用 'use client' 指令**
4. **保持 Server Components 的纯粹性**

## 性能考虑

Server Components 可以显著提升应用的性能，特别是在以下场景：

- 大型内容网站
- 数据密集型应用
- 需要快速首屏加载的页面

## 总结

React Server Components 是一个强大的特性，它改变了我们构建 React 应用的方式。
通过合理使用 Server Components 和 Client Components，
我们可以构建更快、更高效的 Web 应用。
`;

export default function ReadingSystemDemoPage() {
  const [selectedTheme, setSelectedTheme] = useState<'cyan' | 'purple' | 'pink' | 'green'>('cyan');
  const [selectedPosition, setSelectedPosition] = useState<'top' | 'bottom' | 'floating'>('top');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const readingTime = calculateReadingTime(SAMPLE_POST);
  const progress = useReadingProgress();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            阅读进度追踪系统演示
          </h1>
          <p className="text-gray-400 mt-2">
            体验全新的阅读进度追踪功能
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-4">自定义选项</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Theme Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                主题颜色
              </label>
              <div className="flex gap-2">
                {(['cyan', 'purple', 'pink', 'green'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      selectedTheme === theme
                        ? 'border-white scale-110'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    style={{
                      backgroundColor: theme === 'cyan' ? '#00f0ff' :
                                     theme === 'purple' ? '#9d00ff' :
                                     theme === 'pink' ? '#ff0080' : '#00ff88',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Position Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                显示位置
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value as any)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="top">顶部</option>
                <option value="bottom">底部</option>
                <option value="floating">浮动</option>
              </select>
            </div>

            {/* Advanced Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                显示选项
              </label>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`w-full px-4 py-2 rounded-lg border transition-all ${
                  showAdvanced
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-gray-300'
                }`}
              >
                {showAdvanced ? '详细模式' : '简洁模式'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Reading Progress Component */}
        <ReadingProgressSystem
          content={SAMPLE_POST}
          theme={selectedTheme}
          position={selectedPosition}
          showStats={showAdvanced}
          showProgress
          showTime
          className="mb-8"
        />

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="mb-8 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20">
              <h2 className="text-2xl font-bold mb-4">文章信息</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">字数</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {readingTime.wordCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">预计阅读时间</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {readingTime.formatted}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">当前进度</div>
                  <div className="text-2xl font-bold text-pink-400">
                    {progress.progress}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">阅读时长</div>
                  <div className="text-2xl font-bold text-green-400">
                    {Math.floor(progress.timeSpent / 60)}m {progress.timeSpent % 60}s
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-200">
                {SAMPLE_POST}
              </pre>
            </div>
          </div>

          {/* Scroll to bottom indicator */}
          {progress.progress < 95 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10 text-center text-gray-400"
            >
              ↓ 继续向下滚动查看更多内容
            </motion.div>
          )}
        </motion.article>

        {/* Usage Examples */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6">使用示例</h2>

          <div className="space-y-6">
            {/* Example 1 */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                1. 简洁模式 (顶部)
              </h3>
              <p className="text-gray-400 mb-4">
                只显示进度条，适合极简风格
              </p>
              <code className="block p-4 bg-black/50 rounded text-sm">
                {`<CompactReadingProgress content={content} />`}
              </code>
            </div>

            {/* Example 2 */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                2. 浮动模式 (右下角)
              </h3>
              <p className="text-gray-400 mb-4">
                浮动在页面右下角，不占用布局空间
              </p>
              <code className="block p-4 bg-black/50 rounded text-sm">
                {`<FloatingReadingProgress content={content} />`}
              </code>
            </div>

            {/* Example 3 */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-3 text-green-400">
                3. 详细模式 (底部)
              </h3>
              <p className="text-gray-400 mb-4">
                显示完整的阅读统计信息
              </p>
              <code className="block p-4 bg-black/50 rounded text-sm">
                {`<DetailedReadingStats content={content} />`}
              </code>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
