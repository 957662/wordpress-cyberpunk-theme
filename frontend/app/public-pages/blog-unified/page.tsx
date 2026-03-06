/**
 * Blog Unified Page - 统一的博客首页
 * 展示如何使用新的统一组件
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, Filter } from 'lucide-react';
import { BlogListUnified } from '@/components/blog/BlogListUnified';
import { BlogGridUnified } from '@/components/blog/BlogGridUnified';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

// 模拟数据
const mockPosts: Post[] = [
  {
    id: '1',
    title: '探索赛博朋克世界的未来科技',
    slug: 'future-tech-in-cyberpunk',
    excerpt: '赛博朋克世界中的科技幻想正在逐渐变为现实。从脑机接口到全息投影，让我们一起探索这些前沿技术...',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    author: {
      id: '1',
      name: 'Alex Cyber',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    category: '科技',
    tags: ['赛博朋克', '未来科技', 'AI'],
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
    readingTime: 8,
    views: 1234,
    likes: 56,
    comments: 12,
  },
  {
    id: '2',
    title: 'Next.js 14 App Router 完全指南',
    slug: 'nextjs-14-app-router-guide',
    excerpt: '深入理解 Next.js 14 的 App Router 架构，包括服务器组件、客户端组件、路由组织等核心概念...',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
    author: {
      id: '2',
      name: 'Sarah Dev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    category: '开发',
    tags: ['Next.js', 'React', '前端开发'],
    createdAt: '2024-03-04T15:30:00Z',
    updatedAt: '2024-03-04T15:30:00Z',
    readingTime: 12,
    views: 2345,
    likes: 89,
    comments: 34,
  },
  {
    id: '3',
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    excerpt: '掌握 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等强大特性...',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop',
    author: {
      id: '3',
      name: 'Mike Code',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
    category: '编程',
    tags: ['TypeScript', '类型系统', 'JavaScript'],
    createdAt: '2024-03-03T09:00:00Z',
    updatedAt: '2024-03-03T09:00:00Z',
    readingTime: 10,
    views: 987,
    likes: 45,
    comments: 8,
  },
  {
    id: '4',
    title: 'Tailwind CSS 最佳实践',
    slug: 'tailwind-css-best-practices',
    excerpt: '学习如何高效使用 Tailwind CSS 构建现代化的用户界面，包括组件抽象、主题定制等...',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format&fit=crop',
    author: {
      id: '4',
      name: 'Jenny Design',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jenny',
    },
    category: '设计',
    tags: ['Tailwind CSS', 'CSS', 'UI设计'],
    createdAt: '2024-03-02T14:20:00Z',
    updatedAt: '2024-03-02T14:20:00Z',
    readingTime: 6,
    views: 1567,
    likes: 67,
    comments: 15,
  },
  {
    id: '5',
    title: 'Framer Motion 动画教程',
    slug: 'framer-motion-tutorial',
    excerpt: '使用 Framer Motion 创建流畅的动画效果，从基础到进阶，让你的应用充满活力...',
    content: '',
    author: {
      id: '5',
      name: 'Tom Animation',
    },
    category: '动画',
    tags: ['Framer Motion', '动画', 'React'],
    createdAt: '2024-03-01T11:00:00Z',
    readingTime: 7,
  },
  {
    id: '6',
    title: 'PostgreSQL 性能优化指南',
    slug: 'postgresql-performance',
    excerpt: '深入了解 PostgreSQL 的性能优化技巧，包括索引设计、查询优化、配置调优等...',
    content: '',
    author: {
      id: '6',
      name: 'Lisa DB',
    },
    category: '数据库',
    tags: ['PostgreSQL', '数据库', '性能优化'],
    createdAt: '2024-02-29T16:45:00Z',
    readingTime: 15,
  },
];

export default function BlogUnifiedPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 获取所有分类
  const categories = ['全部', ...Array.from(new Set(mockPosts.map((p) => p.category || '未分类')))];

  // 过滤文章
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === '全部' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 模拟加载更多
  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const newPosts = mockPosts.map((post) => ({
        ...post,
        id: `${post.id}-${Date.now()}`,
      }));
      setPosts([...posts, ...newPosts]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-deep-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-cyber-cyan/20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/10 via-transparent to-cyber-cyan/10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-mono">
              <span className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                BLOG
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              探索技术前沿，分享开发经验
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 工具栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-deep-black/80 border border-cyber-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/60 transition-colors"
            />
          </div>

          {/* 过滤器和布局切换 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 分类过滤 */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyber-cyan" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === '全部' ? null : category)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-mono transition-colors',
                      selectedCategory === category || (category === '全部' && !selectedCategory)
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                        : 'bg-deep-black/80 text-gray-400 border border-cyber-cyan/20 hover:border-cyber-cyan/40'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 布局切换 */}
            <div className="flex items-center gap-2 border border-cyber-cyan/20 rounded-lg p-1">
              <button
                onClick={() => setLayout('grid')}
                className={cn(
                  'p-2 rounded transition-colors',
                  layout === 'grid'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={cn(
                  'p-2 rounded transition-colors',
                  layout === 'list'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 结果统计 */}
          <div className="text-sm text-gray-500 font-mono">
            找到 {filteredPosts.length} 篇文章
          </div>
        </motion.div>

        {/* 文章列表/网格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {layout === 'list' ? (
            <BlogListUnified
              posts={filteredPosts}
              layout="list"
              loading={loading}
              hasMore={true}
              onLoadMore={handleLoadMore}
              emptyMessage="没有找到匹配的文章"
            />
          ) : (
            <BlogGridUnified
              posts={filteredPosts}
              columns={3}
              gap="md"
              cardVariant="compact"
              loading={loading}
              hasMore={true}
              onLoadMore={handleLoadMore}
              showLoadMore={true}
              emptyMessage="没有找到匹配的文章"
            />
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-cyan/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm font-mono">
            Built with{' '}
            <span className="text-cyber-cyan">❤</span>
            {' '}using Next.js 14 + TypeScript
          </div>
        </div>
      </footer>
    </div>
  );
}
