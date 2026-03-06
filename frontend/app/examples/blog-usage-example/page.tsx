/**
 * 博客组件使用示例
 *
 * 这个文件展示了如何使用统一的博客组件
 */

'use client';

import React, { useState } from 'react';
import {
  BlogCardUnified,
  BlogListUnified,
  BlogGridUnified,
} from '@/components/blog/index-unified';
// 或者从主入口导入
// import { BlogCard, BlogList, BlogGrid } from '@/components/blog';

// 模拟数据 - WordPress API 格式
const wordPressPosts = [
  {
    id: 1,
    date: '2024-03-06T10:00:00',
    slug: 'getting-started-with-nextjs',
    title: { rendered: 'Next.js 14 入门指南' },
    excerpt: { rendered: '<p>学习如何使用 Next.js 14 构建现代化的 Web 应用...</p>' },
    content: { rendered: '<p>完整的内容...</p>' },
    author: 1,
    featured_media: 0,
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
          alt_text: 'Next.js',
        },
      ],
      'wp:term': [
        [
          { id: 1, name: '前端开发', slug: 'frontend' },
          { id: 2, name: 'React', slug: 'react' },
        ],
        [
          { id: 3, name: 'Next.js', slug: 'nextjs' },
        ],
      ],
      author: [
        {
          id: 1,
          name: '张三',
          slug: 'zhangsan',
          avatar_urls: {
            '96': 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
          },
        },
      ],
    },
  },
  {
    id: 2,
    date: '2024-03-05T14:30:00',
    slug: 'typescript-best-practices',
    title: { rendered: 'TypeScript 最佳实践' },
    excerpt: { rendered: '<p>探索 TypeScript 的高级特性和最佳实践...</p>' },
    content: { rendered: '<p>完整的内容...</p>' },
    author: 1,
    featured_media: 0,
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
          alt_text: 'TypeScript',
        },
      ],
      'wp:term': [
        [
          { id: 1, name: '前端开发', slug: 'frontend' },
        ],
        [
          { id: 4, name: 'TypeScript', slug: 'typescript' },
        ],
      ],
      author: [
        {
          id: 1,
          name: '张三',
          slug: 'zhangsan',
          avatar_urls: {
            '96': 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
          },
        },
      ],
    },
  },
];

// 模拟数据 - 自定义格式
const customPosts = [
  {
    id: '3',
    title: '赛博朋克风格设计指南',
    slug: 'cyberpunk-design-guide',
    excerpt: '学习如何创建令人惊叹的赛博朋克风格用户界面...',
    featuredImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086',
    author: {
      id: '2',
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    },
    categories: [
      { id: '5', name: '设计', slug: 'design' },
      { id: '6', name: 'UI/UX', slug: 'ui-ux' },
    ],
    tags: [
      { id: '7', name: '赛博朋克', slug: 'cyberpunk' },
      { id: '8', name: '设计系统', slug: 'design-system' },
    ],
    publishedAt: '2024-03-04T09:15:00',
    readTime: 8,
    viewCount: 1234,
    likeCount: 56,
    commentCount: 12,
  },
  {
    id: '4',
    title: 'Tailwind CSS 高级技巧',
    slug: 'tailwind-css-advanced',
    excerpt: '掌握 Tailwind CSS 的高级功能和技巧...',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2',
    author: {
      id: '2',
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    },
    categories: [
      { id: '1', name: '前端开发', slug: 'frontend' },
    ],
    tags: [
      { id: '9', name: 'Tailwind CSS', slug: 'tailwindcss' },
      { id: '10', name: 'CSS', slug: 'css' },
    ],
    publishedAt: '2024-03-03T16:45:00',
    readTime: 6,
    viewCount: 892,
    likeCount: 34,
    commentCount: 8,
  },
];

export default function BlogUsageExamplePage() {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'compact' | 'featured'>('default');

  // 模拟分页
  const totalPages = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 在这里添加你的数据获取逻辑
    console.log('加载第', page, '页');
  };

  const handleLike = (postId: string | number) => {
    console.log('点赞文章:', postId);
    // 在这里添加你的点赞逻辑
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* 页面头部 */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            博客组件使用示例
          </h1>
          <p className="text-gray-400">
            展示如何使用统一的博客组件系统
          </p>
        </div>

        {/* 控制面板 */}
        <div className="mb-8 p-6 rounded-lg bg-dark-bg/50 border border-dark-border">
          <h2 className="text-xl font-bold text-white mb-4">配置选项</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedVariant('default')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedVariant === 'default'
                  ? 'bg-cyber-cyan text-dark-bg'
                  : 'bg-dark-bg/50 text-gray-400 hover:text-white'
              }`}
            >
              默认卡片
            </button>
            <button
              onClick={() => setSelectedVariant('compact')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedVariant === 'compact'
                  ? 'bg-cyber-cyan text-dark-bg'
                  : 'bg-dark-bg/50 text-gray-400 hover:text-white'
              }`}
            >
              紧凑卡片
            </button>
            <button
              onClick={() => setSelectedVariant('featured')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedVariant === 'featured'
                  ? 'bg-cyber-cyan text-dark-bg'
                  : 'bg-dark-bg/50 text-gray-400 hover:text-white'
              }`}
            >
              特色卡片
            </button>
            <button
              onClick={() => setLoading(!loading)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                loading
                  ? 'bg-cyber-pink text-white'
                  : 'bg-dark-bg/50 text-gray-400 hover:text-white'
              }`}
            >
              {loading ? '加载中' : '加载状态'}
            </button>
          </div>
        </div>

        {/* 示例 1: 单个卡片 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">示例 1: 单个卡片</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* WordPress 格式数据 */}
            <div>
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">
                WordPress API 数据
              </h3>
              <BlogCardUnified
                post={wordPressPosts[0]}
                variant={selectedVariant}
              />
            </div>

            {/* 自定义格式数据 */}
            <div>
              <h3 className="text-lg font-semibold text-cyber-purple mb-4">
                自定义格式数据
              </h3>
              <BlogCardUnified
                post={customPosts[0]}
                variant={selectedVariant}
              />
            </div>

            {/* 紧凑变体 */}
            <div>
              <h3 className="text-lg font-semibold text-cyber-pink mb-4">
                Compact 变体
              </h3>
              <BlogCardUnified
                post={customPosts[1]}
                variant="compact"
              />
            </div>
          </div>
        </section>

        {/* 示例 2: 博客列表 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            示例 2: 博客列表（默认变体）
          </h2>
          <BlogListUnified
            posts={[...wordPressPosts, ...customPosts]}
            loading={loading}
            variant="default"
            columns={3}
            showFeatured
            featuredCount={1}
            showPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>

        {/* 示例 3: 博客列表 - Compact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            示例 3: 博客列表（Compact 变体）
          </h2>
          <BlogListUnified
            posts={customPosts}
            loading={false}
            variant="compact"
            columns={2}
          />
        </section>

        {/* 示例 4: 博客网格 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">示例 4: 博客网格</h2>
          <BlogGridUnified
            posts={[...wordPressPosts, ...customPosts]}
            columns={3}
            gap="lg"
          />
        </section>

        {/* 示例 5: 带交互的列表 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            示例 5: 带点击事件的列表
          </h2>
          <BlogListUnified
            posts={customPosts}
            variant="magazine"
            columns={2}
          />
        </section>

        {/* 代码示例 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">代码示例</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-dark-bg/50 border border-dark-border">
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">
                基础用法
              </h3>
              <pre className="overflow-x-auto text-sm text-gray-300">
{`import { BlogListUnified } from '@/components/blog';

function MyBlogPage() {
  return (
    <BlogListUnified
      posts={posts}
      loading={loading}
      variant="default"
      columns={3}
      showFeatured
      featuredCount={1}
      showPagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}`}
              </pre>
            </div>

            <div className="p-6 rounded-lg bg-dark-bg/50 border border-dark-border">
              <h3 className="text-lg font-semibold text-cyber-purple mb-4">
                使用 WordPress API 数据
              </h3>
              <pre className="overflow-x-auto text-sm text-gray-300">
{`// 组件会自动适配 WordPress API 格式
<BlogCardUnified post={wpPost} variant="featured" />

// 或使用适配器手动转换
import { adaptWordPressPost } from '@/lib/blog/adapters';
const blogPost = adaptWordPressPost(wpPost);`}
              </pre>
            </div>

            <div className="p-6 rounded-lg bg-dark-bg/50 border border-dark-border">
              <h3 className="text-lg font-semibold text-cyber-pink mb-4">
                数据获取示例
              </h3>
              <pre className="overflow-x-auto text-sm text-gray-300">
{`// 使用 React Query
import { useQuery } from '@tanstack/react-query';

function BlogPage() {
  const { data: posts, loading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  return <BlogListUnified posts={posts} loading={loading} />;
}`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
