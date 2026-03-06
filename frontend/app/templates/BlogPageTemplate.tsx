/**
 * BlogPageTemplate
 * 博客页面模板组件
 *
 * 这是一个可复用的博客页面布局模板
 */

import React from 'react';
import { BlogList, BlogGrid } from '@/components/blog';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { BlogStats } from '@/components/blog/BlogStats';
import { LoadingState } from '@/components/blog/LoadingState';
import { EmptyState } from '@/components/blog/EmptyState';
import type { BlogCardData, BlogFilters } from '@/types/blog';
import { cn } from '@/lib/utils';

export interface BlogPageTemplateProps {
  posts: BlogCardData[];
  loading?: boolean;
  error?: string | null;
  filters?: BlogFilters;
  layout?: 'list' | 'grid';
  columns?: 2 | 3 | 4;
  showSidebar?: boolean;
  showStats?: boolean;
  showSearch?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: BlogFilters) => void;
  className?: string;
}

/**
 * BlogPageTemplate Component
 */
export function BlogPageTemplate({
  posts,
  loading = false,
  error,
  filters,
  layout = 'list',
  columns = 3,
  showSidebar = true,
  showStats = true,
  showSearch = true,
  pagination,
  onSearch,
  onFilterChange,
  className,
}: BlogPageTemplateProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">加载失败</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState />;
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        icon={() => (
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
        title="暂无文章"
        description="还没有发布任何文章"
      />
    );
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            博客
          </h1>
          {showStats && <BlogStats posts={posts} />}
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* 主要内容 */}
          <div className={cn('flex-1', showSidebar && 'lg:pr-8')}>
            {/* 搜索栏 */}
            {showSearch && (
              <div className="mb-6">
                <BlogSearch
                  onSearch={onSearch}
                  placeholder="搜索文章..."
                />
              </div>
            )}

            {/* 文章列表/网格 */}
            {layout === 'grid' ? (
              <BlogGrid
                posts={posts}
                columns={columns}
                currentPage={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                totalItems={pagination?.totalItems}
                onPageChange={pagination?.onPageChange}
              />
            ) : (
              <BlogList
                posts={posts}
                currentPage={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                totalItems={pagination?.totalItems}
                onPageChange={pagination?.onPageChange}
              />
            )}
          </div>

          {/* 侧边栏 */}
          {showSidebar && (
            <aside className="hidden lg:block w-80">
              <BlogSidebar
                filters={filters}
                onFilterChange={onFilterChange}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 博客详情页模板
 */
export function BlogDetailTemplate({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* 主要内容 */}
          <main className="flex-1 lg:pr-8">
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              {children}
            </article>
          </main>

          {/* 侧边栏 */}
          {sidebar && (
            <aside className="hidden lg:block w-80">
              {sidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 博客分类页模板
 */
export function BlogCategoryTemplate({
  category,
  posts,
  loading,
  error,
  pagination,
  onSearch,
  onFilterChange,
}: {
  category: string;
  posts: BlogCardData[];
  loading?: boolean;
  error?: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: BlogFilters) => void;
}) {
  return (
    <BlogPageTemplate
      posts={posts}
      loading={loading}
      error={error}
      pagination={pagination}
      onSearch={onSearch}
      onFilterChange={onFilterChange}
    >
      {/* 分类标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {category}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          共 {posts.length} 篇文章
        </p>
      </div>
    </BlogPageTemplate>
  );
}

export default BlogPageTemplate;
