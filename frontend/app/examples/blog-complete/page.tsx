'use client';

import React, { useState } from 'react';
import { BlogList } from '@/components/blog/BlogList';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { usePosts, useCategories, useTags } from '@/lib/wordpress';
import type { BlogPost } from '@/types/models';
import { Loader2, Grid, List } from 'lucide-react';

// 模拟数据（实际使用时从 WordPress API 获取）
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Next.js 14 App Router 完全指南',
    slug: 'nextjs-14-app-router-guide',
    excerpt: '深入了解 Next.js 14 的 App Router 特性，包括服务端组件、数据获取、路由等功能。',
    content: '',
    date: '2024-03-06',
    author: '张三',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: '前端开发',
    tags: ['Next.js', 'React', 'Web开发'],
    readingTime: 8,
    views: 1234,
    likes: 56,
    commentCount: 12,
  },
  {
    id: '2',
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    excerpt: '掌握 TypeScript 的高级类型系统，提升代码质量和开发效率。',
    content: '',
    date: '2024-03-05',
    author: '李四',
    featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: '编程语言',
    tags: ['TypeScript', '类型系统', '前端'],
    readingTime: 6,
    views: 987,
    likes: 34,
    commentCount: 8,
  },
  {
    id: '3',
    title: '使用 Tailwind CSS 构建现代 UI',
    slug: 'tailwind-css-modern-ui',
    excerpt: '学习如何使用 Tailwind CSS 快速构建美观、响应式的用户界面。',
    content: '',
    date: '2024-03-04',
    author: '王五',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
    category: 'CSS',
    tags: ['Tailwind CSS', 'UI设计', '响应式'],
    readingTime: 5,
    views: 2341,
    likes: 89,
    commentCount: 23,
  },
];

const categories = ['前端开发', '后端开发', '移动开发', '数据库', 'DevOps'];
const tags = ['React', 'Vue', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'CSS'];

export default function BlogCompleteExample() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  // 实际使用时使用 React Query hooks
  // const { data: posts, isLoading, error } = usePosts({ 
  //   page: currentPage, 
  //   per_page: pageSize,
  //   category: selectedCategory 
  // });
  
  // const { data: categories } = useCategories();
  // const { data: tags } = useTags();

  const isLoading = false;
  const posts = mockPosts;
  const totalPages = 3;
  const totalItems = 30;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            技术博客
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            分享前端、后端和全栈开发经验
          </p>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主要内容区 */}
          <div className="flex-1">
            {/* 工具栏 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  共 {totalItems} 篇文章
                </span>
                
                {/* 视图切换 */}
                <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="列表视图"
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="网格视图"
                  >
                    <Grid size={20} />
                  </button>
                </div>
              </div>

              {/* 分类筛选 */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || undefined)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">全部分类</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 加载状态 */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            )}

            {/* 博客列表/网格 */}
            {!isLoading && (
              <>
                {viewMode === 'list' ? (
                  <BlogList
                    posts={posts}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                ) : (
                  <BlogGrid
                    posts={posts}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                )}
              </>
            )}
          </div>

          {/* 侧边栏 */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <BlogSidebar
              categories={categories}
              tags={tags}
              popularPosts={posts.slice(0, 5).map(post => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                views: post.views,
              }))}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
