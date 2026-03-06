'use client';

/**
 * BlogList 组件 - 修复导入版本
 * 博客文章列表组件
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, ChevronRight, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlogCard } from './BlogCard';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  readingTime: number;
  viewCount?: number;
  commentCount?: number;
}

export interface BlogListProps {
  posts: BlogPost[];
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green';
  viewMode?: 'grid' | 'list';
  showViewToggle?: boolean;
  className?: string;
}

export const BlogList: React.FC<BlogListProps> = ({
  posts = [],
  categories = [],
  colorScheme = 'cyan',
  viewMode: initialViewMode = 'grid',
  showViewToggle = true,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);

  const colorClasses = {
    cyan: {
      primary: 'text-cyan-400',
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/10',
      glow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    },
    purple: {
      primary: 'text-purple-400',
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      glow: 'shadow-[0_0_20px_rgba(157,0,255,0.3)]',
    },
    pink: {
      primary: 'text-pink-400',
      border: 'border-pink-500/50',
      bg: 'bg-pink-500/10',
      glow: 'shadow-[0_0_20px_rgba(255,0,128,0.3)]',
    },
    green: {
      primary: 'text-green-400',
      border: 'border-green-500/50',
      bg: 'bg-green-500/10',
      glow: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
    },
  };

  const colors = colorClasses[colorScheme];

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
          <h3 className={cn('text-2xl font-bold', colors.primary)}>
            暂无文章
          </h3>
          <p className="text-gray-400">还没有发布任何文章，敬请期待！</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-2"
          >
            博客文章
          </motion.h1>
          <p className="text-gray-400 text-lg">
            探索技术、分享见解、记录成长
          </p>
        </div>

        {showViewToggle && (
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                viewMode === 'grid'
                  ? cn(colors.bg, colors.primary, colors.border, 'border')
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                viewMode === 'list'
                  ? cn(colors.bg, colors.primary, colors.border, 'border')
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Posts */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }
      >
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={itemVariants}
            onMouseEnter={() => setHoveredPostId(post.id)}
            onMouseLeave={() => setHoveredPostId(null)}
          >
            <Link href={`/blog/${post.slug}`}>
              <div
                className={cn(
                  'group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden',
                  'hover:border-cyan-500/50 transition-all duration-300',
                  'hover:shadow-lg hover:shadow-cyan-500/10',
                  hoveredPostId === post.id && colors.glow,
                  viewMode === 'list' ? 'flex' : 'h-full'
                )}
              >
                {post.featuredImage && (
                  <div
                    className={cn(
                      'relative overflow-hidden',
                      viewMode === 'grid' ? 'h-48' : 'h-32 w-48 flex-shrink-0'
                    )}
                  >
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                  </div>
                )}

                <div className={cn('p-6', viewMode === 'list' ? 'flex-1' : '')}>
                  <h3
                    className={cn(
                      'text-xl font-semibold text-white mb-3',
                      'group-hover:text-cyan-400 transition-colors'
                    )}
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readingTime} 分钟</span>
                    </div>
                    {post.viewCount && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.viewCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BlogList;
