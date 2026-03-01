'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

// 模拟文章数据（后续会从 WordPress API 获取）
const mockPosts = [
  {
    id: 1,
    slug: 'welcome-to-cyberpress',
    title: '欢迎来到 CyberPress',
    excerpt: '探索赛博朋克风格的现代博客体验，感受科技与美学的完美融合。',
    date: '2024-03-01',
    readTime: '5 分钟',
    category: '公告',
  },
  {
    id: 2,
    slug: 'nextjs-14-features',
    title: 'Next.js 14 新特性详解',
    excerpt: '深入了解 Next.js 14 的 Server Actions、Partial Prerendering 等革命性特性。',
    date: '2024-02-28',
    readTime: '10 分钟',
    category: '技术',
  },
  {
    id: 3,
    slug: 'cyberpunk-design-system',
    title: '赛博朋克设计系统指南',
    excerpt: '从配色到动效，打造沉浸式赛博朋克用户体验的完整指南。',
    date: '2024-02-25',
    readTime: '8 分钟',
    category: '设计',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-display font-bold">
              <span className="text-cyber-cyan">CYBER</span>
              <span className="text-cyber-purple">PRESS</span>
            </Link>
            <div className="flex gap-6">
              <Link href="/blog" className="text-cyber-cyan hover:text-cyber-pink transition-colors">
                博客
              </Link>
              <Link href="/portfolio" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                作品集
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                关于
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-display font-bold mb-4"
          >
            <span className="text-glow-cyan text-cyber-cyan">博客</span>
            <span className="text-white">文章</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            探索技术、设计与创意的无限可能
          </motion.p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card group cursor-pointer"
              >
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                {/* Read More */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-cyber-cyan hover:text-cyber-pink transition-colors"
                >
                  <span>阅读全文</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-cyber-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CyberPress. 由 AI 开发团队自动构建 🤖
          </p>
        </div>
      </footer>
    </main>
  );
}
