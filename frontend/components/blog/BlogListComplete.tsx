/**
 * BlogList 组件 - 完整版本
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArticleCard } from './ArticleCard';
import { Post } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlogListProps {
  posts: Post[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  variant?: 'list' | 'grid' | 'magazine';
  className?: string;
}

export function BlogList({
  posts,
  loading = false,
  page = 1,
  pageSize = 10,
  onPageChange,
  variant = 'list',
  className,
}: BlogListProps) {
  const [viewVariant, setViewVariant] = useState(variant);

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        {[...Array(pageSize)].map((_, i) => (
          <div key={i} className="h-64 bg-[var(--cyber-muted)]/20 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-20', className)}>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">暂无文章</h3>
          <p className="text-gray-400">还没有发布任何文章</p>
        </div>
      </div>
    );
  }

  const gridClass = viewVariant === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6';

  return (
    <div className={cn('space-y-8', className)}>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setViewVariant('list')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm',
            viewVariant === 'list' ? 'bg-[var(--cyber-cyan)] text-black' : 'bg-[var(--cyber-muted)] text-gray-400'
          )}
        >
          列表
        </button>
        <button
          onClick={() => setViewVariant('grid')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm',
            viewVariant === 'grid' ? 'bg-[var(--cyber-cyan)] text-black' : 'bg-[var(--cyber-muted)] text-gray-400'
          )}
        >
          网格
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={gridClass}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ArticleCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default BlogList;
