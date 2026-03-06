/**
 * BlogListEnhancedNew - 增强版博客列表组件
 * 支持多种布局和过滤选项
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BlogCard } from './blog-card';
import type { PostCardData } from './types';

export interface BlogListEnhancedProps {
  posts: PostCardData[];
  loading?: boolean;
  layout?: 'list' | 'grid' | 'masonry';
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function BlogListEnhancedNew({
  posts,
  loading = false,
  layout = 'grid',
  columns = 3,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}: BlogListEnhancedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentLayout, setCurrentLayout] = useState(layout);

  // 过滤文章
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 获取所有分类
  const categories = Array.from(
    new Set(posts.map(post => post.category?.name).filter(Boolean))
  );

  // 渲染加载状态
  if (loading) {
    return (
      <div className="w-full">
        <div className={cn(
          'grid gap-6',
          currentLayout === 'grid' && `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
          currentLayout === 'list' && 'grid-cols-1'
        )}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg p-6"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-cyber-cyan/20 rounded w-3/4 mb-4" />
                <div className="h-3 bg-cyber-purple/20 rounded w-1/2 mb-2" />
                <div className="h-3 bg-cyber-muted/20 rounded w-full mb-1" />
                <div className="h-3 bg-cyber-muted/20 rounded w-2/3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // 渲染过滤器
  const renderFilters = () => {
    if (!showFilters && !showSearch) return null;

    return (
      <div className="mb-8 space-y-4">
        {/* 搜索框 */}
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full px-4 py-3 bg-cyber-dark/80 border-2',
                'border-cyber-cyan/30 rounded-lg text-white',
                'placeholder:text-cyber-muted/50',
                'focus:outline-none focus:border-cyber-cyan/60',
                'transition-all duration-300'
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                className="w-5 h-5 text-cyber-cyan/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* 分类和布局切换 */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 分类过滤 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  'border-2',
                  !selectedCategory
                    ? 'border-cyber-cyan bg-cyber-cyan/20 text-white'
                    : 'border-cyber-cyan/30 bg-cyber-dark/50 text-cyber-muted/70 hover:border-cyber-cyan/50'
                )}
              >
                全部
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    'border-2',
                    selectedCategory === category
                      ? 'border-cyber-purple bg-cyber-purple/20 text-white'
                      : 'border-cyber-purple/30 bg-cyber-dark/50 text-cyber-muted/70 hover:border-cyber-purple/50'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 布局切换 */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentLayout('grid')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  'border-2',
                  currentLayout === 'grid'
                    ? 'border-cyber-cyan bg-cyber-cyan/20 text-white'
                    : 'border-cyber-cyan/30 bg-cyber-dark/50 text-cyber-muted/70'
                )}
                title="网格视图"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentLayout('list')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  'border-2',
                  currentLayout === 'list'
                    ? 'border-cyber-cyan bg-cyber-cyan/20 text-white'
                    : 'border-cyber-cyan/30 bg-cyber-dark/50 text-cyber-muted/70'
                )}
                title="列表视图"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染文章列表
  const renderPosts = () => {
    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-cyber-muted/50 text-lg mb-4">
            {searchQuery || selectedCategory ? '没有找到匹配的文章' : '暂无文章'}
          </div>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="text-cyber-cyan hover:text-cyber-cyan/70 transition-colors"
            >
              清除筛选条件
            </button>
          )}
        </div>
      );
    }

    const gridCols = currentLayout === 'grid'
      ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`
      : 'grid-cols-1';

    return (
      <motion.div
        layout
        className={cn(
          'grid gap-6',
          gridCols
        )}
      >
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                layout: { duration: 0.3 },
                opacity: { delay: index * 0.05 },
              }}
            >
              <BlogCard post={post} layout={currentLayout} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  // 渲染分页
  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 mt-8"
      >
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all',
            'border-2 border-cyber-cyan/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentPage === 1
              ? 'bg-cyber-dark/50 text-cyber-muted/50'
              : 'bg-cyber-dark/50 text-cyber-cyan hover:border-cyber-cyan/60'
          )}
        >
          上一页
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange?.(1)}
              className="px-4 py-2 rounded-lg border-2 border-cyber-cyan/30 bg-cyber-dark/50 text-cyber-cyan hover:border-cyber-cyan/60"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-cyber-muted/50">...</span>
            )}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all',
              'border-2',
              page === currentPage
                ? 'border-cyber-cyan bg-cyber-cyan/20 text-white'
                : 'border-cyber-cyan/30 bg-cyber-dark/50 text-cyber-cyan hover:border-cyber-cyan/60'
            )}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-cyber-muted/50">...</span>
            )}
            <button
              onClick={() => onPageChange?.(totalPages)}
              className="px-4 py-2 rounded-lg border-2 border-cyber-cyan/30 bg-cyber-dark/50 text-cyber-cyan hover:border-cyber-cyan/60"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all',
            'border-2 border-cyber-cyan/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentPage === totalPages
              ? 'bg-cyber-dark/50 text-cyber-muted/50'
              : 'bg-cyber-dark/50 text-cyber-cyan hover:border-cyber-cyan/60'
          )}
        >
          下一页
        </button>
      </motion.div>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      {renderFilters()}
      {renderPosts()}
      {renderPagination()}

      {/* 结果统计 */}
      <div className="mt-6 text-center text-sm text-cyber-muted/60">
        显示 {filteredPosts.length} 篇文章
        {searchQuery && ` · 搜索: "${searchQuery}"`}
        {selectedCategory && ` · 分类: ${selectedCategory}`}
      </div>
    </div>
  );
}

export default BlogListEnhancedNew;
