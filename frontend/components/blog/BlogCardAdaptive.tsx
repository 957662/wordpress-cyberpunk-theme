'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { adaptPost } from '@/lib/data/adapter';
import type { BlogPost } from '@/types/models/blog';

interface BlogCardAdaptiveProps {
  post: any; // Can be WordPress format or BlogPost format
  variant?: 'default' | 'compact' | 'featured';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  showCategory?: boolean;
  className?: string;
}

export const BlogCardAdaptive: React.FC<BlogCardAdaptiveProps> = ({
  post,
  variant = 'default',
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showReadingTime = true,
  showCategory = true,
  className,
}) => {
  // Adapt post data to BlogPost format
  const blogPost: BlogPost = adaptPost(post);

  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
        'hover:border-cyan-500/50 dark:hover:border-cyan-500/50',
        'hover:shadow-lg hover:shadow-cyan-500/10',
        'transition-all duration-300',
        isFeatured && 'md:col-span-2 lg:col-span-3',
        className
      )}
    >
      <Link href={`/blog/${blogPost.slug}`} className="block">
        {/* 特色图片 */}
        {blogPost.featuredImage && (
          <div
            className={cn(
              'relative overflow-hidden bg-gray-200 dark:bg-gray-800',
              isFeatured ? 'aspect-[21/9]' : isCompact ? 'aspect-video' : 'aspect-video'
            )}
          >
            <Image
              src={blogPost.featuredImage}
              alt={blogPost.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* 分类标签 */}
            {showCategory && blogPost.category && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-medium rounded-full shadow-sm">
                  {blogPost.category.name}
                </span>
              </div>
            )}

            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* 内容 */}
        <div className={cn('p-6', isCompact && 'p-4')}>
          {/* 元信息栏 */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            {/* 作者 */}
            {showAuthor && blogPost.author && (
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span className="font-medium">{blogPost.author.name}</span>
              </div>
            )}

            {/* 日期 */}
            {showDate && blogPost.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <time dateTime={blogPost.publishedAt}>
                  {formatDate(blogPost.publishedAt)}
                </time>
              </div>
            )}

            {/* 阅读时间 */}
            {showReadingTime && blogPost.readingTime && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{blogPost.readingTime} 分钟</span>
              </div>
            )}
          </div>

          {/* 标题 */}
          <h2
            className={cn(
              'font-bold text-gray-900 dark:text-white mb-3',
              'group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors',
              isFeatured ? 'text-2xl md:text-3xl' : isCompact ? 'text-lg' : 'text-xl'
            )}
          >
            {blogPost.title}
          </h2>

          {/* 摘要 */}
          {showExcerpt && blogPost.excerpt && (
            <p
              className={cn(
                'text-gray-600 dark:text-gray-400 mb-4',
                isCompact ? 'text-sm line-clamp-2' : 'line-clamp-3'
              )}
            >
              {blogPost.excerpt}
            </p>
          )}

          {/* 底部信息 */}
          <div className="flex items-center justify-between">
            {/* 标签 */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      'bg-gray-100 dark:bg-gray-800',
                      'text-gray-600 dark:text-gray-400',
                      'hover:bg-cyan-100 dark:hover:bg-cyan-900/30',
                      'hover:text-cyan-600 dark:hover:text-cyan-400',
                      'transition-colors'
                    )}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* 阅读更多 */}
            <div
              className={cn(
                'flex items-center text-cyan-600 dark:text-cyan-400 font-medium text-sm',
                'group-hover:gap-2 transition-all'
              )}
            >
              <span>阅读更多</span>
              <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-500" />
    </motion.article>
  );
};

export default BlogCardAdaptive;
