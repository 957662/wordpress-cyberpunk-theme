/**
 * BlogPage - 博客列表页面主组件
 * 完整的博客列表页面，包含搜索、筛选、排序等功能
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, Filter, SlidersHorizontal } from 'lucide-react';
import { useBlogPosts } from '@/hooks/use-blog-data';
import { useDebounce } from '@/hooks/useDebounce';
import type { BlogPost, BlogViewType, BlogSortField } from '@/types/models/blog';
import { cn } from '@/lib/utils/cn';

// 导入子组件
import { ArticleCard } from './ArticleCard';
import { BlogPagination } from './BlogPagination';
import { BlogSearch } from './BlogSearch';
import { CategoryFilter } from './CategoryFilter';
import { TagFilter } from './TagFilter';
import { ViewToggle } from './ViewToggle';
import { SortDropdown } from './SortDropdown';
import { BlogSkeleton } from './BlogSkeleton';
import { EmptyState } from './EmptyState';

interface BlogPageProps {
  initialCategory?: string;
  initialTag?: string;
  initialSearch?: string;
  className?: string;
}

export function BlogPage({
  initialCategory,
  initialTag,
  initialSearch = '',
  className,
}: BlogPageProps) {
  // 状态管理
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [initialTag] : []
  );
  const [viewMode, setViewMode] = useState<BlogViewType>('grid');
  const [sortField, setSortField] = useState<BlogSortField>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // 获取文章数据
  const { data, isLoading, isError, error } = useBlogPosts({
    page: currentPage,
    pageSize: viewMode === 'grid' ? 12 : 10,
    search: debouncedSearch,
    categories: selectedCategories,
    tags: selectedTags,
    field: sortField,
    order: 'desc',
  });

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // 处理分类筛选
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  // 处理标签筛选
  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
    setCurrentPage(1);
  };

  // 清除所有筛选
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // 是否有激活的筛选器
  const hasActiveFilters = useMemo(
    () =>
      selectedCategories.length > 0 ||
      selectedTags.length > 0 ||
      searchQuery.length > 0,
    [selectedCategories, selectedTags, searchQuery]
  );

  // 排序和筛选后的文章
  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;
  const totalPosts = data?.total || 0;

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950', className)}>
      {/* 页面头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              博客文章
            </h1>
            <p className="text-slate-400">
              探索技术见解、教程和最新动态
            </p>
          </div>

          {/* 搜索栏 */}
          <BlogSearch
            value={searchQuery}
            onChange={handleSearch}
            placeholder="搜索文章..."
            className="mb-4"
          />

          {/* 工具栏 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* 筛选按钮（移动端） */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors lg:hidden"
              >
                <Filter className="w-4 h-4" />
                筛选
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </button>

              {/* 清除筛选 */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  清除筛选
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* 排序 */}
              <SortDropdown
                value={sortField}
                onChange={setSortField}
                className="hidden sm:block"
              />

              {/* 视图切换 */}
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 筛选面板 */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-slate-800 bg-slate-900/30"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* 分类筛选 */}
              <CategoryFilter
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
              />

              {/* 标签筛选 */}
              <TagFilter
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* 主内容区 */}
      <div className="container mx-auto px-4 py-8">
        {/* 加载状态 */}
        {isLoading && <BlogSkeleton view={viewMode} />}

        {/* 错误状态 */}
        {isError && (
          <EmptyState
            title="加载失败"
            description={error?.message || '无法加载文章，请稍后重试'}
            action={{
              label: '重试',
              onClick: () => window.location.reload(),
            }}
          />
        )}

        {/* 空状态 */}
        {!isLoading && posts.length === 0 && (
          <EmptyState
            title="未找到文章"
            description="尝试调整搜索词或筛选条件"
            action={
              hasActiveFilters
                ? {
                    label: '清除筛选',
                    onClick: handleClearFilters,
                  }
                : undefined
            }
          />
        )}

        {/* 文章列表 */}
        {!isLoading && posts.length > 0 && (
          <>
            {/* 统计信息 */}
            <div className="mb-6 text-sm text-slate-400">
              找到 {totalPosts} 篇文章
            </div>

            {/* 网格视图 */}
            {viewMode === 'grid' && (
              <motion.div
                layout
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <ArticleCard post={post} variant="grid" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* 列表视图 */}
            {viewMode === 'list' && (
              <motion.div layout className="space-y-6 max-w-4xl mx-auto">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <ArticleCard post={post} variant="list" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* 紧凑视图 */}
            {viewMode === 'compact' && (
              <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    layout
                  >
                    <ArticleCard post={post} variant="compact" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="mt-12">
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
