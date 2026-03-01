'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';

// 模拟文章详情数据
const mockPost = {
  id: 1,
  slug: 'welcome-to-cyberpress',
  title: '欢迎来到 CyberPress',
  content: `
## 🚀 项目介绍

CyberPress 是一个基于 **WordPress + Next.js** 的赛博朋克风格博客平台。我们融合了现代前端技术与独特的美学设计，为您带来沉浸式的阅读体验。

### ✨ 核心特性

1. **Next.js 14** - 采用最新的 App Router，享受极致性能
2. **TypeScript** - 类型安全的开发体验
3. **Tailwind CSS** - 灵活的样式系统
4. **Framer Motion** - 丝滑的动画效果

### 🎨 设计理念

我们的设计灵感来源于赛博朋克美学：

- **霓虹色彩** - 青色、紫色、粉色的霓虹灯效果
- **发光边框** - 独特的发光效果
- **扫描线** - CRT 显示器风格的视觉效果
- **故障艺术** - Glitch 效果增添科技感

\`\`\`typescript
// 示例代码
const greeting = (name: string) => {
  return \`Hello, \${name}! Welcome to CyberPress.\`;
};

console.log(greeting('Cyber'));
\`\`\`

### 📦 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.x | 前端框架 |
| TypeScript | 5.x | 类型系统 |
| Tailwind CSS | 3.x | 样式框架 |
| Framer Motion | 11.x | 动画库 |

---

感谢您访问 CyberPress，让我们一起探索赛博朋克的无限可能！ 🎮
  `,
  date: '2024-03-01',
  readTime: '5 分钟',
  author: 'CyberPress Team',
  category: '公告',
  tags: ['公告', 'CyberPress', 'Next.js'],
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border sticky top-0 bg-cyber-dark/80 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回博客</span>
            </Link>
            <Link href="/" className="text-xl font-display font-bold">
              <span className="text-cyber-cyan">CYBER</span>
              <span className="text-cyber-purple">PRESS</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {/* Category */}
            <span className="inline-block px-3 py-1 text-xs font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full mb-4">
              {mockPost.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              {mockPost.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {mockPost.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {mockPost.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {mockPost.readTime}
              </span>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-invert prose-cyber max-w-none"
            dangerouslySetInnerHTML={{ __html: mockPost.content.replace(/\n/g, '<br/>') }}
          />

          {/* Tags */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 pt-8 border-t border-cyber-border"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-500" />
              {mockPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-cyber-muted border border-cyber-border rounded-full text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.footer>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-cyber-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CyberPress. 由 AI 开发团队自动构建 🤖
          </p>
        </div>
      </footer>
    </main>
  );
}
