/**
 * 扩展 Widget 展示页面
 * 展示所有新创建的 Widget 组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowIcon } from '@/components/icons';
import {
  CalendarWidget,
  SocialLinksWidget,
  NewsletterWidget,
  PopularPostsWidget,
  RelatedPostsWidget,
} from '@/components/widgets';

// 模拟数据
const mockPosts = [
  {
    id: 1,
    title: { rendered: 'Next.js 14 App Router 完全指南' },
    slug: 'nextjs-14-app-router-guide',
    excerpt: { rendered: '深入了解 Next.js 14 的新特性和最佳实践...' },
    date: '2026-03-01T10:00:00',
    comment_count: 42,
    tags: [1, 2, 3],
    categories: [1, 2],
    views: 15234,
  },
  {
    id: 2,
    title: { rendered: '赛博朋克风格 UI 设计实践' },
    slug: 'cyberpunk-ui-design',
    excerpt: { rendered: '探索赛博朋克风格在现代 Web 设计中的应用...' },
    date: '2026-02-28T14:30:00',
    comment_count: 28,
    tags: [2, 4],
    categories: [1],
    views: 12567,
  },
  {
    id: 3,
    title: { rendered: 'TypeScript 高级类型技巧' },
    slug: 'typescript-advanced-types',
    excerpt: { rendered: '掌握 TypeScript 的高级类型系统...' },
    date: '2026-02-25T09:15:00',
    comment_count: 35,
    tags: [3, 5],
    categories: [2],
    views: 9876,
  },
  {
    id: 4,
    title: { rendered: 'React Server Components 详解' },
    slug: 'react-server-components',
    excerpt: { rendered: '了解 React Server Components 的工作原理...' },
    date: '2026-02-20T16:45:00',
    comment_count: 51,
    tags: [1, 3, 5],
    categories: [1, 2],
    views: 18765,
  },
  {
    id: 5,
    title: { rendered: 'Tailwind CSS 性能优化技巧' },
    slug: 'tailwind-css-optimization',
    excerpt: { rendered: '提升 Tailwind CSS 项目性能的实用技巧...' },
    date: '2026-02-15T11:20:00',
    comment_count: 19,
    tags: [4, 6],
    categories: [3],
    views: 8234,
  },
];

const socialLinks = [
  { platform: 'github' as const, url: 'https://github.com', name: 'GitHub', description: '查看我的开源项目' },
  { platform: 'twitter' as const, url: 'https://twitter.com', name: 'Twitter', description: '关注我的最新动态' },
  { platform: 'email' as const, url: 'mailto:hello@cyberpress.dev', name: 'Email', description: '发送邮件联系我' },
  { platform: 'rss' as const, url: '/rss.xml', name: 'RSS Feed', description: '订阅文章更新' },
];

const postDates = [
  new Date('2026-03-01'),
  new Date('2026-02-28'),
  new Date('2026-02-25'),
  new Date('2026-02-20'),
  new Date('2026-02-15'),
  new Date('2026-03-05'),
  new Date('2026-03-07'),
];

export default function WidgetsExpandedPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 页面头部 */}
      <header className="relative overflow-hidden border-b border-cyber-border">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              扩展 Widget 展示
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              探索赛博朋克风格的扩展 Widget 组件
            </p>
            <Link
              href="/widgets-demo"
              className="inline-flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple transition-colors"
            >
              <span>返回基础 Widget 展示</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Widget 网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 日历 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CalendarWidget
              postDates={postDates}
              showPostDates={true}
              onDateClick={(date) => console.log('点击日期:', date)}
            />
          </motion.div>

          {/* 社交链接 Widget - 列表样式 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SocialLinksWidget
              links={socialLinks}
              title="社交媒体"
              variant="list"
              showDescription={true}
            />
          </motion.div>

          {/* 邮件订阅 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <NewsletterWidget
              description="订阅我们的邮件列表，获取最新文章和资讯"
              onSubscribe={async (email) => {
                console.log('订阅邮箱:', email);
              }}
            />
          </motion.div>

          {/* 热门文章 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PopularPostsWidget
              posts={mockPosts}
              count={5}
              sortBy="views"
              title="热门文章"
              showRank={true}
              showStats={true}
            />
          </motion.div>

          {/* 相关文章 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RelatedPostsWidget
              currentPost={mockPosts[0]}
              allPosts={mockPosts}
              count={4}
              relateBy="both"
              title="相关文章"
              showTaxonomy={true}
            />
          </motion.div>

          {/* 社交链接 Widget - 网格样式 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SocialLinksWidget
              links={socialLinks}
              title="关注我们"
              variant="grid"
              iconSize="md"
            />
          </motion.div>
        </div>

        {/* 使用说明 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 p-8 rounded-lg bg-cyber-card border border-cyber-border"
        >
          <h2 className="text-2xl font-bold text-white mb-6">使用说明</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-2">CalendarWidget</h3>
              <p className="text-gray-400 mb-3">
                日历组件，可显示有文章发布的日期标记。
              </p>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<CalendarWidget
  postDates={[new Date('2026-03-01'), new Date('2026-03-07')]}
  showPostDates={true}
  onDateClick={(date) => console.log(date)}
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-2">SocialLinksWidget</h3>
              <p className="text-gray-400 mb-3">
                社交媒体链接组件，支持多种显示样式。
              </p>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`const links = [
  { platform: 'github', url: 'https://github.com', name: 'GitHub' },
  { platform: 'twitter', url: 'https://twitter.com', name: 'Twitter' },
];

<SocialLinksWidget
  links={links}
  variant="list" // 'grid' | 'list' | 'icons'
  showDescription={true}
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-2">NewsletterWidget</h3>
              <p className="text-gray-400 mb-3">
                邮件订阅组件，包含完整的表单验证和状态反馈。
              </p>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<NewsletterWidget
  title="订阅更新"
  description="获取最新的文章和资讯"
  onSubscribe={async (email) => {
    await subscribeUser(email);
  }}
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-2">PopularPostsWidget</h3>
              <p className="text-gray-400 mb-3">
                热门文章组件，基于浏览量或评论数排序。
              </p>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<PopularPostsWidget
  posts={posts}
  count={5}
  sortBy="views" // 'views' | 'comments' | 'recent'
  showRank={true}
  showStats={true}
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-2">RelatedPostsWidget</h3>
              <p className="text-gray-400 mb-3">
                相关文章组件，基于标签或分类推荐相关内容。
              </p>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<RelatedPostsWidget
  currentPost={currentPost}
  allPosts={allPosts}
  relateBy="both" // 'tags' | 'categories' | 'both'
  showTaxonomy={true}
/>`}</code>
              </pre>
            </div>
          </div>
        </motion.section>

        {/* 返回链接 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
          >
            <span>返回首页</span>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
