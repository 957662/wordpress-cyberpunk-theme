'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import PostCard, { Post } from './PostCard';

// ================================================================
// PostList - 文章列表组件
// ================================================================

export interface PostListProps {
  posts: Post[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  layout?: 'grid' | 'list';
  onLoadMore?: () => void;
  className?: string;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  loading = false,
  total = 0,
  page = 1,
  pageSize = 10,
  layout = 'list',
  onLoadMore,
  className,
}) => {
  const [currentLayout, setCurrentLayout] = useState<'grid' | 'list'>(layout);

  // 计算是否还有更多文章
  const hasMore = posts.length < total;

  // 处理加载更多
  const handleLoadMore = () => {
    if (!loading && onLoadMore && hasMore) {
      onLoadMore();
    }
  };

  // 渲染空状态
  const renderEmpty = () => {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="mb-6 text-6xl">📝</div>
          <h3 className="mb-2 text-xl font-bold text-gray-100">暂无文章</h3>
          <p className="text-gray-400">还没有发布任何文章，请稍后再来查看。</p>
        </motion.div>
      </div>
    );
  };

  // 渲染加载状态
  const renderLoading = () => {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-cyber-cyan" />
          <p className="text-gray-400">加载中...</p>
        </motion.div>
      </div>
    );
  };

  // 渲染布局切换按钮
  const renderLayoutToggle = () => {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-cyber-muted/50 p-1">
        <button
          onClick={() => setCurrentLayout('list')}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            currentLayout === 'list'
              ? 'bg-cyber-cyan text-black'
              : 'text-gray-400 hover:text-gray-200'
          )}
          aria-label="列表视图"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => setCurrentLayout('grid')}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            currentLayout === 'grid'
              ? 'bg-cyber-cyan text-black'
              : 'text-gray-400 hover:text-gray-200'
          )}
          aria-label="网格视图"
        >
          <Grid className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // 渲染统计信息
  const renderStats = () => {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          共 <span className="font-bold text-cyber-cyan">{total}</span> 篇文章
          {page > 1 && (
            <span className="ml-2">
              (第 {page} 页，共 {Math.ceil(total / pageSize)} 页)
            </span>
          )}
        </div>
        {renderLayoutToggle()}
      </div>
    );
  };

  // 如果正在加载且没有文章
  if (loading && posts.length === 0) {
    return renderLoading();
  }

  // 如果没有文章
  if (posts.length === 0) {
    return renderEmpty();
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* 统计信息 */}
      {renderStats()}

      {/* 文章列表 */}
      <AnimatePresence mode="popLayout">
        {currentLayout === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <PostCard post={post} variant="grid" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col gap-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <PostCard post={post} variant="default" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 加载更多按钮 */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            disabled={loading}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-purple px-8 py-3 font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all',
              'hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                加载中...
              </>
            ) : (
              <>
                加载更多
                <span className="text-sm opacity-75">
                  ({posts.length}/{total})
                </span>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* 到达底部提示 */}
      {!hasMore && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 text-center text-sm text-gray-500"
        >
          已加载全部 {posts.length} 篇文章
        </motion.div>
      )}
    </div>
  );
};

export default PostList;
