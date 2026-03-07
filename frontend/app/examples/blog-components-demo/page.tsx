'use client';

import React, { useState, useEffect } from 'react';
import { BlogList } from '@/components/blog/BlogList';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogCardUnified } from '@/components/blog/BlogCardUnified';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { LoadingState } from '@/components/blog/LoadingState';
import type { BlogPost } from '@/types/models/blog';
import { cn } from '@/lib/utils';

// 模拟数据 - 标准格式
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: '探索 Next.js 14 的新特性',
    slug: 'exploring-nextjs-14',
    excerpt: 'Next.js 14 带来了许多令人兴奋的新特性，包括 Turbopack、部分预渲染等。让我们一起深入了解这些改进如何提升开发体验。',
    content: '<p>详细内容...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    author: {
      id: '1',
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    category: {
      id: '1',
      name: '前端开发',
      slug: 'frontend',
    },
    tags: [
      { id: '1', name: 'Next.js', slug: 'nextjs' },
      { id: '2', name: 'React', slug: 'react' },
    ],
    date: '2024-03-01T10:00:00Z',
    readingTime: 8,
    viewCount: 1234,
    likeCount: 56,
    commentCount: 12,
  },
  {
    id: '2',
    title: 'TypeScript 高级技巧分享',
    slug: 'typescript-advanced-tips',
    excerpt: '掌握这些 TypeScript 高级技巧，让你的代码更加健壮和易于维护。本文将详细介绍泛型、条件类型等高级特性。',
    content: '<p>详细内容...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop',
    author: {
      id: '2',
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    },
    category: {
      id: '1',
      name: '前端开发',
      slug: 'frontend',
    },
    tags: [
      { id: '3', name: 'TypeScript', slug: 'typescript' },
    ],
    date: '2024-03-02T14:30:00Z',
    readingTime: 12,
    viewCount: 856,
    likeCount: 42,
    commentCount: 8,
  },
  {
    id: '3',
    title: '构建高性能的 React 应用',
    slug: 'building-high-performance-react-apps',
    excerpt: '性能优化是构建现代 Web 应用的关键。本文将分享多种 React 性能优化技巧和最佳实践。',
    content: '<p>详细内容...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    author: {
      id: '1',
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    category: {
      id: '2',
      name: '性能优化',
      slug: 'performance',
    },
    tags: [
      { id: '1', name: 'Next.js', slug: 'nextjs' },
      { id: '4', name: '性能优化', slug: 'performance' },
    ],
    date: '2024-03-03T09:15:00Z',
    readingTime: 10,
    viewCount: 2341,
    likeCount: 89,
    commentCount: 23,
  },
  {
    id: '4',
    title: 'CSS Grid vs Flexbox：何时使用哪个',
    slug: 'css-grid-vs-flexbox',
    excerpt: 'CSS Grid 和 Flexbox 都是强大的布局工具，但它们各自适用于不同的场景。本文将帮助你理解它们的区别和使用场景。',
    content: '<p>详细内容...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop',
    author: {
      id: '3',
      name: '王五',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    category: {
      id: '3',
      name: 'CSS',
      slug: 'css',
    },
    tags: [
      { id: '5', name: 'CSS Grid', slug: 'css-grid' },
      { id: '6', name: 'Flexbox', slug: 'flexbox' },
    ],
    date: '2024-03-04T16:45:00Z',
    readingTime: 6,
    viewCount: 567,
    likeCount: 28,
    commentCount: 5,
  },
  {
    id: '5',
    title: '现代 JavaScript 异步编程指南',
    slug: 'modern-javascript-async-programming',
    excerpt: '深入理解 async/await、Promise 和异步编程模式，掌握处理异步操作的优雅方式。',
    content: '<p>详细内容...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop',
    author: {
      id: '2',
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    },
    category: {
      id: '4',
      name: 'JavaScript',
      slug: 'javascript',
    },
    tags: [
      { id: '7', name: 'JavaScript', slug: 'javascript' },
      { id: '8', name: '异步编程', slug: 'async' },
    ],
    date: '2024-03-05T11:20:00Z',
    readingTime: 15,
    viewCount: 1892,
    likeCount: 67,
    commentCount: 18,
  },
  {
    id: '6',
    title: 'Tailwind CSS 实用技巧大全',
    slug: 'tailwind-css-practical-tips',
    excerpt: 'Tailwind CSS 是一个功能强大的实用工具优先的 CSS 框架。本文将分享一些实用技巧和最佳实践。',
    content: '<p>详细内容...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop',
    author: {
      id: '3',
      name: '王五',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    category: {
      id: '3',
      name: 'CSS',
      slug: 'css',
    },
    tags: [
      { id: '9', name: 'Tailwind CSS', slug: 'tailwind' },
      { id: '10', name: 'CSS', slug: 'css' },
    ],
    date: '2024-03-06T13:00:00Z',
    readingTime: 9,
    viewCount: 1456,
    likeCount: 54,
    commentCount: 11,
  },
];

// 分类数据
const categories = [
  { id: '1', name: '全部', slug: 'all' },
  { id: '2', name: '前端开发', slug: 'frontend' },
  { id: '3', name: '性能优化', slug: 'performance' },
  { id: '4', name: 'CSS', slug: 'css' },
  { id: '5', name: 'JavaScript', slug: 'javascript' },
];

type ViewMode = 'grid' | 'list' | 'cyber';

export default function BlogComponentsDemoPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(2);

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setLoading(false);
    };
    loadData();
  }, []);

  // 过滤文章
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category?.slug === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // 处理分类选择
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            博客组件集成演示
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            展示 BlogList、BlogGrid 和 BlogCardUnified 组件的完整集成
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 工具栏 */}
        <div className="mb-8 space-y-4">
          {/* 搜索栏 */}
          <BlogSearch
            onSearch={handleSearch}
            placeholder="搜索文章..."
            className="w-full"
          />

          {/* 分类和视图切换 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* 分类过滤 */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              className="flex-wrap"
            />

            {/* 视图切换 */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                )}
              >
                网格视图
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                )}
              >
                列表视图
              </button>
              <button
                onClick={() => setViewMode('cyber')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  viewMode === 'cyber'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                )}
              >
                赛博风格
              </button>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              找到 <strong className="text-gray-900 dark:text-white">{filteredPosts.length}</strong> 篇文章
            </span>
            {searchQuery && (
              <span className="text-gray-600 dark:text-gray-400">
                搜索: <strong className="text-gray-900 dark:text-white">"{searchQuery}"</strong>
              </span>
            )}
          </div>
        </div>

        {/* 加载状态 */}
        {loading && <LoadingState />}

        {/* 文章列表 */}
        {!loading && (
          <>
            {viewMode === 'grid' && (
              <BlogGrid
                posts={filteredPosts}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPosts.length}
                onPageChange={handlePageChange}
                columns={3}
              />
            )}

            {viewMode === 'list' && (
              <BlogList
                posts={filteredPosts}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPosts.length}
                onPageChange={handlePageChange}
              />
            )}

            {viewMode === 'cyber' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCardUnified
                    key={post.id}
                    post={post}
                    variant="default"
                  />
                ))}
              </div>
            )}

            {/* 空状态 */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  未找到相关文章
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  请尝试其他搜索词或分类
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>博客组件集成演示 - CyberPress Platform</p>
        </div>
      </footer>
    </div>
  );
}
