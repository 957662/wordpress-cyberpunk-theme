'use client';

/**
 * BlogGrid 组件 - 修复导入版本
 * 博客文章网格布局组件
 */

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, Heart, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  readingTime: number;
  viewCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
}

export interface BlogGridProps {
  posts: BlogPost[];
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'featured' | 'masonry';
  showStats?: boolean;
  showActions?: boolean;
  className?: string;
}

export const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  columns = 3,
  variant = 'default',
  showStats = true,
  showActions = true,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  if (posts.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">📝</div>
          <h3 className="text-2xl font-bold text-cyan-400">暂无文章</h3>
          <p className="text-gray-400">还没有发布任何文章，敬请期待！</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'grid gap-6',
        gridCols[columns],
        variant === 'masonry' && 'lg:columns-3 lg:gap-6',
        className
      )}
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          variants={itemVariants}
          className={variant === 'masonry' ? 'mb-6 break-inside-avoid' : ''}
        >
          <Link href={`/blog/${post.slug}`}>
            <div
              className={cn(
                'group h-full bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden',
                'hover:border-cyan-500/50 transition-all duration-300',
                'hover:shadow-lg hover:shadow-cyan-500/10',
                'flex flex-col'
              )}
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />

                  {/* Categories */}
                  {post.categories.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-2">
                      {post.categories.slice(0, 2).map((category) => (
                        <span
                          key={category.id}
                          className="px-3 py-1 bg-cyan-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="space-y-3">
                  {/* Date and Reading Time */}
                  {showStats && (
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} 分钟</span>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  {showStats && (post.viewCount || post.likeCount || post.bookmarkCount) && (
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {post.viewCount && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.viewCount}</span>
                        </div>
                      )}
                      {post.likeCount && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.likeCount}</span>
                        </div>
                      )}
                      {post.bookmarkCount && (
                        <div className="flex items-center gap-1">
                          <Bookmark className="w-3 h-3" />
                          <span>{post.bookmarkCount}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {showActions && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <div className="flex items-center gap-2">
                        {post.author.avatar && (
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-xs text-gray-400">{post.author.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(post.publishedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BlogGrid;
