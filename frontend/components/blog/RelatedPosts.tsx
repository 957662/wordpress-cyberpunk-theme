'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Clock } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types/models/blog';

// ============================================================================
// Types
// ============================================================================

export interface RelatedPostsProps {
  /**
   * 当前文章 ID (用于排除)
   */
  currentPostId?: string | number;

  /**
   * 推荐文章列表
   */
  posts: BlogPost[];

  /**
   * 推荐类型
   * - 'related': 基于标签和分类的相关文章
   * - 'popular': 热门文章
   * - 'latest': 最新文章
   */
  type?: 'related' | 'popular' | 'latest';

  /**
   * 显示数量
   */
  limit?: number;

  /**
   * 布局方式
   * - 'grid': 网格布局
   * - 'list': 列表布局
   * - 'cards': 卡片布局
   */
  layout?: 'grid' | 'list' | 'cards';

  /**
   * 自定义类名
   */
  className?: string;
}

// ============================================================================
// Card Layout Component
// ============================================================================

interface PostCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'default' }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className={cn(
            'relative overflow-hidden bg-gray-200 dark:bg-gray-800',
            variant === 'compact' ? 'aspect-video' : 'aspect-[16/10]'
          )}>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Category Badge */}
            {post.category && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium rounded-full">
                  {post.category.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            {post.readingTime && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{post.readingTime} 分钟</span>
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && variant === 'default' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-500" />
      </Link>
    </motion.article>
  );
};

// ============================================================================
// List Layout Component
// ============================================================================

interface PostListItemProps {
  post: BlogPost;
  index: number;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-md transition-all duration-200"
      >
        {/* Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {index + 1}
        </div>

        {/* Image */}
        {post.featuredImage && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={80}
              height={80}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {post.title}
          </h4>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime} 分钟</span>
              </>
            )}
            {post.views !== undefined && (
              <>
                <span>•</span>
                <span>{post.views} 阅读</span>
              </>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight size={20} className="flex-shrink-0 text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
};

// ============================================================================
// Main Related Posts Component
// ============================================================================

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPostId,
  posts,
  type = 'related',
  limit = 4,
  layout = 'grid',
  className,
}) => {
  // Filter out current post
  const filteredPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, limit);

  if (filteredPosts.length === 0) {
    return null;
  }

  // Get title based on type
  const getTitle = () => {
    switch (type) {
      case 'related':
        return '相关推荐';
      case 'popular':
        return '热门文章';
      case 'latest':
        return '最新文章';
      default:
        return '推荐阅读';
    }
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'popular':
        return <TrendingUp size={20} />;
      default:
        return <ArrowRight size={20} />;
    }
  };

  return (
    <section className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 text-white">
          {getIcon()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getTitle()}
        </h2>
      </div>

      {/* Content */}
      {layout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      )}

      {layout === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {layout === 'list' && (
        <div className="space-y-3">
          {filteredPosts.map((post, index) => (
            <PostListItem key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RelatedPosts;
