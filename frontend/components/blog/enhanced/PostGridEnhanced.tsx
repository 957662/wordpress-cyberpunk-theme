/**
 * CyberPress Platform - 增强版文章网格组件
 * @version 1.0.0
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatDistanceToNow, truncateText } from '@/lib/utils';
import type { PostCard } from '@/types';
import { CategoryBadge } from '@/components/ui/badge';
import { LikeButton } from '@/components/blog';
import { BookmarkButton } from '@/components/blog';

// =====================================================
// Props 定义
// =====================================================

export interface PostGridEnhancedProps {
  posts: PostCard[];
  columns?: 1 | 2 | 3 | 4;
  isLoading?: boolean;
  skeletonCount?: number;
  onPostClick?: (post: PostCard) => void;
  className?: string;
}

// =====================================================
// 骨架屏组件
// =====================================================

function PostCardSkeleton() {
  return (
    <div className="cyber-card cyber-card-hover bg-cyber-dark/50 backdrop-blur border border-cyber-cyan/20 rounded-xl overflow-hidden">
      <div className="aspect-video bg-cyber-muted/30 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-cyber-muted/30 rounded w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 bg-cyber-muted/20 rounded w-full animate-pulse" />
          <div className="h-3 bg-cyber-muted/20 rounded w-5/6 animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyber-muted/30 animate-pulse" />
            <div className="h-3 bg-cyber-muted/20 rounded w-20 animate-pulse" />
          </div>
          <div className="h-3 bg-cyber-muted/20 rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// 文章卡片组件
// =====================================================

interface PostCardProps {
  post: PostCard;
  index: number;
  onClick?: (post: PostCard) => void;
}

function PostCard({ post, index, onClick }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = useCallback(() => {
    onClick?.(post);
  }, [post, onClick]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link
        href={`/blog/${post.slug}`}
        onClick={handleClick}
        className="block h-full"
      >
        <div
          className={cn(
            'cyber-card cyber-card-hover bg-cyber-dark/50 backdrop-blur border rounded-xl overflow-hidden transition-all duration-300',
            isHovered
              ? 'border-cyber-cyan/50 shadow-lg shadow-cyber-cyan/10'
              : 'border-cyber-cyan/20'
          )}
        >
          {/* 封面图 */}
          <div className="relative aspect-video overflow-hidden bg-cyber-muted/20">
            {post.featured_image && !imageError ? (
              <>
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-500',
                    isHovered ? 'scale-110' : 'scale-100'
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-cyber-muted/30 animate-pulse" />
                )}
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-cyber-cyan/30">CP</span>
                </div>
              </div>
            )}

            {/* 分类标签 */}
            {post.category && (
              <div className="absolute top-3 left-3">
                <CategoryBadge category={post.category} size="sm" />
              </div>
            )}

            {/* 特色标记 */}
            {post.is_featured && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-cyber-pink/90 text-white text-xs font-bold rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* 内容 */}
          <div className="p-4 space-y-3">
            {/* 标题 */}
            <h3
              className={cn(
                'font-bold text-lg leading-tight transition-colors',
                isHovered ? 'text-cyber-cyan' : 'text-gray-100'
              )}
            >
              {truncateText(post.title, 60)}
            </h3>

            {/* 摘要 */}
            {post.excerpt && (
              <p className="text-sm text-gray-400 line-clamp-2">
                {truncateText(post.excerpt, 120)}
              </p>
            )}

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 bg-cyber-muted/20 text-cyber-cyan/80 text-xs rounded hover:bg-cyber-muted/30 transition-colors"
                  >
                    #{tag.name}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-cyber-cyan/60 text-xs">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* 底部信息 */}
            <div className="flex items-center justify-between pt-2 border-t border-cyber-cyan/10">
              {/* 作者信息 */}
              <div className="flex items-center gap-2">
                {post.author.avatar_url ? (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.username}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-cyber-cyan/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white text-xs font-bold">
                    {post.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-xs">
                  <p className="font-medium text-gray-200">
                    {post.author.full_name || post.author.username}
                  </p>
                  <p className="text-gray-500">
                    {formatDistanceToNow(post.published_at)}
                  </p>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatNumber(post.view_count)}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {formatNumber(post.like_count)}
                </span>
              </div>
            </div>
          </div>

          {/* 悬浮操作栏 */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-cyber-dark via-cyber-dark/95 to-transparent"
              >
                <div className="flex items-center justify-center gap-2">
                  <LikeButton
                    postId={post.id}
                    initialLiked={false}
                    initialCount={post.like_count}
                    size="sm"
                    variant="ghost"
                  />
                  <BookmarkButton
                    postId={post.id}
                    initialBookmarked={false}
                    size="sm"
                    variant="ghost"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
    </motion.article>
  );
}

// =====================================================
// 格式化数字
// =====================================================

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

// =====================================================
// 主组件
// =====================================================

export function PostGridEnhanced({
  posts,
  columns = 3,
  isLoading = false,
  skeletonCount = 6,
  onPostClick,
  className,
}: PostGridEnhancedProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {/* 文章列表 */}
      <AnimatePresence>
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            onClick={onPostClick}
          />
        ))}
      </AnimatePresence>

      {/* 加载骨架屏 */}
      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <PostCardSkeleton key={`skeleton-${index}`} />
        ))}
    </div>
  );
}

// =====================================================
// 导出
// =====================================================

export default PostGridEnhanced;
