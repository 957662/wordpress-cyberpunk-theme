/**
 * 博客列表组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from './BlogCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { WPPost } from '@/lib/wordpress/client';
import { LoadingIcon } from '@/components/icons';

export interface BlogListProps {
  posts: WPPost[];
  total: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function BlogList({
  posts,
  total,
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
}: BlogListProps) {
  const [variant, setVariant] = useState<'grid' | 'list'>('grid');

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingIcon className="w-12 h-12 text-cyber-cyan animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card variant="glass" className="p-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="font-display font-bold text-xl mb-2">没有找到文章</h3>
        <p className="text-gray-400">尝试其他搜索词或分类</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl mb-1">
            文章列表
          </h2>
          <p className="text-gray-400">
            共 {total} 篇文章
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVariant('grid')}
            className={`p-2 rounded transition-colors ${
              variant === 'grid'
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'bg-cyber-muted text-gray-400 hover:text-white'
            }`}
            aria-label="网格视图"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setVariant('list')}
            className={`p-2 rounded transition-colors ${
              variant === 'list'
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'bg-cyber-muted text-gray-400 hover:text-white'
            }`}
            aria-label="列表视图"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Posts Grid/List */}
      <div
        className={
          variant === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {posts.map((post, index) => (
          <BlogCard
            key={post.id}
            post={post}
            variant={variant === 'list' ? 'compact' : 'default'}
            index={index}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && posts.length > 0 && (
        <div className="flex justify-center py-8">
          <LoadingIcon className="w-8 h-8 text-cyber-cyan animate-spin" />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            上一页
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, i, arr) => {
                const prevPage = arr[i - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <motion.div key={page} className="contents">
                    {showEllipsis && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => onPageChange(page)}
                      className={`w-10 h-10 rounded font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-cyber-cyan text-cyber-dark'
                          : 'bg-cyber-muted text-gray-400 hover:text-white hover:bg-cyber-border'
                      }`}
                    >
                      {page}
                    </button>
                  </motion.div>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
