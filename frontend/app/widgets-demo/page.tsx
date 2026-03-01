/**
 * Widget 系统演示页面
 * 展示所有 Widget 组件的使用
 */

'use client';

import { RecentPostsWidget, TagCloudWidget, CategoryWidget, SearchWidget, AuthorWidget } from '@/components/widgets';
import { GlitchText } from '@/components/effects/GlitchText';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function WidgetsDemoPage() {
  // 模拟数据
  const mockPosts = [
    {
      id: 1,
      title: { rendered: '探索 Next.js 14 的新特性' },
      slug: 'exploring-nextjs-14',
      excerpt: { rendered: 'Next.js 14 带来了许多令人兴奋的新特性...' },
      date: '2024-01-15T10:00:00',
    },
    {
      id: 2,
      title: { rendered: 'TypeScript 最佳实践指南' },
      slug: 'typescript-best-practices',
      excerpt: { rendered: '在项目中使用 TypeScript 的最佳实践...' },
      date: '2024-01-14T14:30:00',
    },
    {
      id: 3,
      title: { rendered: 'Tailwind CSS 高级技巧' },
      slug: 'tailwind-css-advanced',
      excerpt: { rendered: '掌握 Tailwind CSS 的高级用法...' },
      date: '2024-01-13T09:15:00',
    },
    {
      id: 4,
      title: { rendered: 'React Server Components 深度解析' },
      slug: 'react-server-components',
      excerpt: { rendered: '理解 React Server Components 的工作原理...' },
      date: '2024-01-12T16:45:00',
    },
    {
      id: 5,
      title: { rendered: 'Framer Motion 动画入门' },
      slug: 'framer-motion-guide',
      excerpt: { rendered: '使用 Framer Motion 创建流畅的动画效果...' },
      date: '2024-01-11T11:20:00',
    },
  ];

  const mockTags = [
    { id: 1, name: 'React', slug: 'react', count: 45 },
    { id: 2, name: 'Next.js', slug: 'nextjs', count: 38 },
    { id: 3, name: 'TypeScript', slug: 'typescript', count: 32 },
    { id: 4, name: 'Tailwind CSS', slug: 'tailwindcss', count: 28 },
    { id: 5, name: 'JavaScript', slug: 'javascript', count: 25 },
    { id: 6, name: 'CSS', slug: 'css', count: 20 },
    { id: 7, name: 'HTML', slug: 'html', count: 18 },
    { id: 8, name: 'Node.js', slug: 'nodejs', count: 15 },
    { id: 9, name: 'API', slug: 'api', count: 12 },
    { id: 10, name: '性能优化', slug: 'performance', count: 10 },
  ];

  const mockCategories = [
    { id: 1, name: '前端开发', slug: 'frontend', count: 85, description: 'Web 前端技术相关文章' },
    { id: 2, name: '后端开发', slug: 'backend', count: 42, description: '服务端开发技术' },
    { id: 3, name: 'DevOps', slug: 'devops', count: 28, description: '开发运维相关' },
    { id: 4, name: '设计', slug: 'design', count: 35, description: 'UI/UX 设计' },
    { id: 5, name: '工具', slug: 'tools', count: 55, description: '开发工具推荐' },
  ];

  const mockAuthor = {
    name: 'CyberPress Team',
    bio: '我们是一个专注于构建现代化 Web 应用的开发团队。热爱分享技术，追求极致的用户体验。',
    avatar: '',
    email: 'team@cyberpress.dev',
    twitter: 'https://twitter.com/cyberpress',
    github: 'https://github.com/cyberpress',
    website: 'https://cyberpress.dev',
  };

  return (
    <main className="min-h-screen bg-cyber-dark py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold mb-4">
            <GlitchText text="Widget 系统" />
          </h1>
          <p className="text-gray-400 text-lg">
            CyberPress 平台的侧边栏组件展示
          </p>
        </motion.div>

        {/* Widget 展示网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 搜索 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SearchWidget />
          </motion.div>

          {/* 作者 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AuthorWidget author={mockAuthor} />
          </motion.div>

          {/* 分类 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CategoryWidget categories={mockCategories} />
          </motion.div>

          {/* 标签云 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2"
          >
            <TagCloudWidget
              tags={mockTags}
              minSize={0.8}
              maxSize={1.4}
              showCount
            />
          </motion.div>

          {/* 最新文章 Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 lg:col-span-3"
          >
            <RecentPostsWidget
              posts={mockPosts}
              count={5}
              showDate
              showExcerpt
              title="最新发布"
            />
          </motion.div>
        </div>

        {/* 使用说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 cyber-card"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            使用说明
          </h2>
          <div className="space-y-4 text-gray-400">
            <div>
              <h3 className="text-cyber-cyan font-semibold mb-2">Widget 基础组件</h3>
              <p>所有 Widget 都继承自基础 Widget 组件，支持折叠、自定义样式等功能。</p>
            </div>
            <div>
              <h3 className="text-cyber-cyan font-semibold mb-2">导入方式</h3>
              <pre className="bg-cyber-darker p-4 rounded-lg overflow-x-auto">
                <code className="text-cyber-cyan">
                  {`import { RecentPostsWidget, TagCloudWidget } from '@/components/widgets';`}
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-cyber-cyan font-semibold mb-2">数据来源</h3>
              <p>在实际应用中，这些 Widget 会从 WordPress REST API 获取数据。本演示使用模拟数据。</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
