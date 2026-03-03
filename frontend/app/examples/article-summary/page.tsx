'use client';

/**
 * Article Summary Examples - 文章摘要组件示例
 */

import { ArticleSummary } from '@/components/article-summary';

const sampleArticle = `
# 深入理解 React Server Components

React Server Components (RSC) 是 React 18 引入的一项革命性功能，
它允许我们在服务器上渲染组件，从而显著提升应用性能。

## 什么是 Server Components？

Server Components 是一种特殊的组件，它们只在服务器上运行，
不会被打包发送到客户端。这意味着：

- 可以直接访问数据库和文件系统
- 不会增加客户端 JavaScript 包大小
- 可以使用服务器端的 Node.js API

## 主要优势

### 1. 减少客户端 JavaScript

由于 Server Components 不会发送到客户端，
因此可以显著减少需要下载的 JavaScript 代码量。

### 2. 直接访问后端资源

Server Components 可以直接查询数据库、读取文件等，
无需创建 API 端点。

### 3. 自动代码分割

Server Components 和 Client Components 之间的边界
自然地形成了代码分割点。

## 使用场景

Server Components 特别适合：
- 数据获取组件
- 内容展示组件
- 布局组件
- 高阶组件

## 最佳实践

1. 默认使用 Server Components
2. 只在需要交互时使用 Client Components
3. 保持组件职责单一
4. 合理组织组件结构

## 总结

React Server Components 代表了 React 开发的新范式，
通过合理使用 Server 和 Client Components，
我们可以构建出性能更优、体验更好的 Web 应用。
`.repeat(3);

export default function ArticleSummaryExamples() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            文章摘要组件
          </h1>
          <p className="text-xl text-gray-400">
            使用 AI 自动生成文章摘要
          </p>
        </div>

        {/* 文章摘要组件 */}
        <div className="mb-12">
          <ArticleSummary
            content={sampleArticle}
            defaultExpanded={true}
          />
        </div>

        {/* 文章内容 */}
        <div className="cyber-card p-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
              示例文章
            </h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {sampleArticle}
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="cyber-card p-6 mt-12">
          <h2 className="text-xl font-bold text-white mb-4">功能特性</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-3">
                AI 智能摘要
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>自动提取关键信息</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>生成要点列表</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>总结主要收获</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>支持展开/收起</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyber-purple mb-3">
                用户体验
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-purple">✓</span>
                  <span>平滑动画效果</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-purple">✓</span>
                  <span>一键复制摘要</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-purple">✓</span>
                  <span>加载状态提示</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-purple">✓</span>
                  <span>响应式设计</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">使用方法</h3>
            <pre className="bg-cyber-dark/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`import { ArticleSummary } from '@/components/article-summary';

<ArticleSummary
  content={articleContent}
  defaultExpanded={false}
/>`}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg">
            <p className="text-sm text-cyber-purple">
              💡 注意：当前使用模拟数据。实际使用时需要集成 AI API
              (如 OpenAI、Claude 等) 来生成真实的摘要内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
