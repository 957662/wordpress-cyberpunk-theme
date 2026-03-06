/**
 * BlogGridEnhancedNew - 增强版博客网格组件
 * 支持瀑布流布局和动画效果
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BlogCard } from './blog-card';
import type { PostCardData } from './types';

export interface BlogGridEnhancedProps {
  posts: PostCardData[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
  masonry?: boolean;
  gap?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  animationDelay?: number;
  className?: string;
}

export function BlogGridEnhancedNew({
  posts,
  loading = false,
  columns = 3,
  masonry = false,
  gap = 'md',
  showAnimation = true,
  animationDelay = 50,
  className,
}: BlogGridEnhancedProps) {
  const [visiblePosts, setVisiblePosts] = useState<PostCardData[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      // 逐个显示文章，创建级联动画效果
      posts.forEach((post, index) => {
        setTimeout(() => {
          setVisiblePosts(prev => {
            if (!prev.find(p => p.id === post.id)) {
              return [...prev, post];
            }
            return prev;
          });
          setLoadedCount(index + 1);
        }, index * animationDelay);
      });
    }
  }, [posts, loading, animationDelay]);

  // 清空可见文章
  useEffect(() => {
    if (loading) {
      setVisiblePosts([]);
      setLoadedCount(0);
    }
  }, [loading]);

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  // 渲染骨架屏
  const renderSkeleton = () => {
    const skeletonCount = columns * 2;
    return (
      <div
        className={cn(
          'grid',
          `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
          gapClasses[gap]
        )}
      >
        {[...Array(skeletonCount)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg overflow-hidden"
          >
            <div className="animate-pulse">
              <div className="h-48 bg-cyber-cyan/10" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-cyber-purple/20 rounded w-3/4" />
                <div className="h-3 bg-cyber-muted/20 rounded w-full" />
                <div className="h-3 bg-cyber-muted/20 rounded w-2/3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // 渲染瀑布流布局
  const renderMasonry = () => {
    const columnCount = columns;
    const columnArrays: PostCardData[][] = Array.from({ length: columnCount }, () => []);

    // 将文章分配到各列
    visiblePosts.forEach((post, index) => {
      const columnIndex = index % columnCount;
      columnArrays[columnIndex].push(post);
    });

    return (
      <div className={cn('grid gap-6', `grid-cols-1 md:grid-cols-${columnCount}`)}>
        {columnArrays.map((columnPosts, columnIndex) => (
          <motion.div
            key={columnIndex}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: columnIndex * 0.1 }}
          >
            {columnPosts.map(post => (
              <BlogCard key={post.id} post={post} layout="grid" />
            ))}
          </motion.div>
        ))}
      </div>
    );
  };

  // 渲染标准网格布局
  const renderStandardGrid = () => {
    return (
      <motion.div
        layout
        className={cn(
          'grid',
          `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
          gapClasses[gap]
        )}
      >
        <AnimatePresence mode="popLayout">
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              layout
              initial={showAnimation ? { opacity: 0, y: 20, scale: 0.95 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                layout: { duration: 0.3 },
                opacity: { duration: 0.2 },
                y: { type: 'spring', stiffness: 300, damping: 30 },
              }}
            >
              <BlogCard post={post} layout="grid" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return renderSkeleton();
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-cyber-muted/50 text-lg mb-4">暂无文章</div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {masonry ? renderMasonry() : renderStandardGrid()}

      {/* 加载进度指示器 */}
      {loadedCount < posts.length && posts.length > 0 && (
        <div className="mt-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 text-sm text-cyber-muted/60"
          >
            <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
            加载中 {loadedCount}/{posts.length}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default BlogGridEnhancedNew;
