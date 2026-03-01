'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  date: string;
  readTime?: number;
}

interface RelatedPostsProps {
  posts: Post[];
  className?: string;
  title?: string;
  maxDisplay?: number;
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'card' | 'list';
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  posts,
  className,
  title = '相关文章',
  maxDisplay = 3,
  columns = 3,
  variant = 'default',
}) => {
  const displayPosts = posts.slice(0, maxDisplay);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (displayPosts.length === 0) {
    return null;
  }

  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (variant === 'list') {
    return (
      <section className={cn('py-8 border-t border-dark-700', className)}>
        <h3 className="text-xl font-bold mb-6 text-white">{title}</h3>
        <div className="space-y-4">
          {displayPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block p-4 rounded-lg bg-dark-800/30 hover:bg-dark-800 border border-dark-700 hover:border-cyber-cyan/30 transition-all group"
              >
                <div className="flex gap-4">
                  {post.featuredImage && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-200 group-hover:text-cyber-cyan transition-colors mb-1 line-clamp-1">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {post.category && (
                        <span className="text-cyber-cyan">{post.category}</span>
                      )}
                      <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                      {post.readTime && <span>{post.readTime} 分钟</span>}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn('py-8 border-t border-dark-700', className)}>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold mb-6 text-white"
      >
        {title}
      </motion.h3>

      <div className={cn('grid gap-6', gridCols[columns])}>
        {displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-dark-800">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className={cn(
                      'object-cover transition-transform duration-500',
                      hoveredIndex === index ? 'scale-110' : 'scale-100'
                    )}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h4 className="font-semibold text-gray-200 group-hover:text-cyber-cyan transition-colors mb-2 line-clamp-2">
                {post.title}
              </h4>

              {post.excerpt && variant === 'card' && (
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-gray-500">
                {post.category && (
                  <span className="px-2 py-1 rounded bg-cyber-cyan/10 text-cyber-cyan">
                    {post.category}
                  </span>
                )}
                <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                {post.readTime && <span>{post.readTime} 分钟</span>}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

interface SeriesNavigationProps {
  series: {
    title: string;
    description?: string;
    posts: Array<{
      id: string;
      title: string;
      slug: string;
      excerpt?: string;
      order: number;
    }>;
  };
  currentPostId: string;
  className?: string;
}

export const SeriesNavigation: React.FC<SeriesNavigationProps> = ({
  series,
  currentPostId,
  className,
}) => {
  const currentIndex = series.posts.findIndex((p) => p.id === currentPostId);
  const currentPost = series.posts[currentIndex];

  return (
    <section className={cn('py-8 border-t border-dark-700', className)}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 text-xs font-semibold rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20">
            系列
          </span>
        </div>
        <h3 className="text-xl font-bold text-white">{series.title}</h3>
        {series.description && (
          <p className="text-gray-400 mt-2">{series.description}</p>
        )}
      </div>

      <div className="space-y-2">
        {series.posts.map((post, index) => {
          const isCurrent = post.id === currentPostId;
          const isPrevious = index < currentIndex;
          const isNext = index > currentIndex;

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={cn(
                'block p-4 rounded-lg border transition-all',
                isCurrent
                  ? 'bg-cyber-cyan/10 border-cyber-cyan/30'
                  : 'bg-dark-800/30 border-dark-700 hover:border-cyber-cyan/30 hover:bg-dark-800',
                (isPrevious || isNext) && 'opacity-75 hover:opacity-100'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    isCurrent
                      ? 'bg-cyber-cyan text-dark-900'
                      : 'bg-dark-700 text-gray-400'
                  )}
                >
                  {post.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={cn(
                        'font-medium',
                        isCurrent
                          ? 'text-cyber-cyan'
                          : 'text-gray-200 hover:text-cyber-cyan'
                      )}
                    >
                      {post.title}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-xs rounded bg-cyber-cyan text-dark-900">
                        当前
                      </span>
                    )}
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>进度</span>
          <span>
            {currentIndex + 1} / {series.posts.length}
          </span>
        </div>
        <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / series.posts.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
          />
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
