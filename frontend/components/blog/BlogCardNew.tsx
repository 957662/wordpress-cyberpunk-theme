/**
 * BlogCardNew - 新版博客卡片组件
 * 支持多种布局和样式选项
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, Bookmark, Share2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPublishDate, calculateReadingTime } from '@/lib/utils/blog-helpers';

export interface BlogCardNewProps {
  post: {
    id: string | number;
    title: string;
    excerpt?: string;
    content?: string;
    featuredImage?: string;
    slug: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt?: string;
    author?: {
      id: string | number;
      name: string;
      avatar?: string;
    };
    category?: {
      id: string | number;
      name: string;
      slug: string;
      color?: string;
    };
    tags?: Array<{
      id: string | number;
      name: string;
      slug: string;
    }>;
    views?: number;
    likes?: number;
    readingTime?: number;
    status?: 'published' | 'draft';
  };
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showStats?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  className?: string;
  onLike?: (postId: string | number) => void;
  onBookmark?: (postId: string | number) => void;
  onShare?: (postId: string | number) => void;
}

export const BlogCardNew: React.FC<BlogCardNewProps> = ({
  post,
  variant = 'default',
  showStats = true,
  showAuthor = true,
  showCategory = true,
  showTags = false,
  className,
  onLike,
  onBookmark,
  onShare,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

    if (onLike) {
      onLike(post.id);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsBookmarked(!isBookmarked);

    if (onBookmark) {
      onBookmark(post.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onShare) {
      onShare(post.id);
    }
  };

  // 计算阅读时间
  const readingTime = post.readingTime || (post.content ? calculateReadingTime(post.content) : 5);

  // 基础样式
  const baseClasses = 'group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-cyber-cyan/50 transition-all duration-300';

  // 变体样式
  const variantClasses = {
    default: 'flex flex-col',
    compact: 'flex flex-row gap-4',
    featured: 'flex flex-col h-full',
    minimal: 'bg-transparent border-none p-0',
  };

  // 图片样式
  const imageClasses = {
    default: 'relative h-48 overflow-hidden',
    compact: 'relative w-48 h-32 flex-shrink-0 overflow-hidden',
    featured: 'relative h-64 overflow-hidden',
    minimal: 'hidden',
  };

  // 内容样式
  const contentClasses = {
    default: 'p-6 flex-1 flex flex-col',
    compact: 'flex-1 p-4 flex flex-col justify-between',
    featured: 'p-6 flex-1 flex flex-col',
    minimal: 'p-0',
  };

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        className={cn(baseClasses, variantClasses[variant], className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
      >
        {/* 图片 */}
        {post.featuredImage && (
          <div className={imageClasses[variant]}>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </div>
        )}

        {/* 内容 */}
        <div className={contentClasses[variant]}>
          {/* 分类 */}
          {showCategory && post.category && (
            <div className="mb-3">
              <span
                className={cn(
                  'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                  post.category.color
                  ? 'text-white'
                  : 'bg-cyber-cyan/10 text-cyber-cyan'
                )}
                style={{
                  backgroundColor: post.category.color ? `${post.category.color}20` : undefined,
                  color: post.category.color || undefined,
                }}
              >
                {post.category.name}
              </span>
            </div>
          )}

          {/* 标题 */}
          <h3
            className={cn(
              'font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors',
              variant === 'compact' ? 'text-lg line-clamp-2' : 'text-xl line-clamp-2'
            )}
          >
            {post.title}
          </h3>

          {/* 摘要 */}
          {variant !== 'compact' && (post.excerpt || post.content) && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
              {post.excerpt || post.content?.replace(/<[^>]*>/g, '')}
            </p>
          )}

          {/* 标签 */}
          {showTags && post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 元信息 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            {/* 左侧：日期和阅读时间 */}
            <div className="flex items-center gap-3">
              {post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatPublishDate(post.publishedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readingTime} 分钟</span>
              </div>
            </div>

            {/* 右侧：统计信息 */}
            {showStats && (
              <div className="flex items-center gap-3">
                {post.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views}</span>
                  </div>
                )}
                {likeCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{likeCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 作者信息 */}
          {showAuthor && post.author && variant !== 'compact' && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-3">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                  <span className="text-cyber-cyan text-sm font-semibold">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-400">{post.author.name}</span>
            </div>
          )}

          {/* 操作按钮 */}
          {variant === 'featured' && (
            <div className="mt-4 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isLiked
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}
              >
                <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookmark}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isBookmarked
                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}
              >
                <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>

              <div className="flex-1" />

              <ChevronRight className="w-4 h-4 text-cyber-cyan group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogCardNew;
