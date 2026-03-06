/**
 * BlogList 组件 - 最终版本
 * 显示博客文章列表，支持多种布局和过滤选项
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { ArticleCard } from './ArticleCard';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from './LoadingState';
import { Post } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlogListProps {
  posts: Post[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  variant?: 'list' | 'grid' | 'magazine';
  columns?: 1 | 2 | 3;
  showPagination?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function BlogList({
  posts,
  loading = false,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  variant = 'list',
  columns = 1,
  showPagination = true,
  emptyMessage = '暂无文章',
  className,
}: BlogListProps) {
  const [viewVariant, setViewVariant] = useState(variant);

  const handlePageChange = useCallback((newPage: number) => {
    onPageChange?.(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onPageChange]);

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <LoadingState type="skeleton" count={pageSize} />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--cyber-cyan)] to-[var(--cyber-purple)] flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">暂无文章</h3>
          <p className="text-gray-400">{emptyMessage}</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderPosts = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'space-y-6',
          viewVariant === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
          viewVariant === 'magazine' && 'grid grid-cols-1 md:grid-cols-2 gap-6',
          columns === 2 && 'grid grid-cols-1 md:grid-cols-2 gap-6',
          columns === 3 && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        )}
      >
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ArticleCard
                post={post}
                variant={viewVariant === 'magazine' && index === 0 ? 'featured' : 'default'}
                showExcerpt={viewVariant !== 'list'}
                showMeta
                showAuthor
                showCategory
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={cn('space-y-8', className)}>
      {/* 视图切换器 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">共 {total} 篇文章</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewVariant('list')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              viewVariant === 'list'
                ? 'bg-[var(--cyber-cyan)] text-black'
                : 'bg-[var(--cyber-muted)] text-gray-400 hover:text-white'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewVariant('grid')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              viewVariant === 'grid'
                ? 'bg-[var(--cyber-cyan)] text-black'
                : 'bg-[var(--cyber-muted)] text-gray-400 hover:text-white'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewVariant('magazine')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              viewVariant === 'magazine'
                ? 'bg-[var(--cyber-cyan)] text-black'
                : 'bg-[var(--cyber-muted)] text-gray-400 hover:text-white'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* 文章列表 */}
      {renderPosts()}

      {/* 分页 */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default BlogList;
