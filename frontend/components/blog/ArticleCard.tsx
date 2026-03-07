'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/models';
import { cn, formatDate } from '@/lib/utils';

export interface ArticleCardProps {
  post: BlogPost;
  variant?: 'list' | 'grid' | 'featured';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  className?: string;
}

export function ArticleCard({
  post,
  variant = 'list',
  showExcerpt = true,
  showAuthor = true,
  showReadingTime = true,
  className,
}: ArticleCardProps) {
  const isGrid = variant === 'grid';
  const isFeatured = variant === 'featured';

  return (
    <article
      className={cn(
        'group bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300',
        isFeatured && 'md:col-span-2 lg:col-span-3',
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* 图片 */}
        {post.featuredImage && (
          <div
            className={cn(
              'relative overflow-hidden bg-gray-200 dark:bg-gray-800',
              isFeatured ? 'h-64 md:h-80' : isGrid ? 'h-48' : 'h-56'
            )}
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {post.category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-medium rounded-full">
                  {post.category}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 内容 */}
        <div className={cn('p-6', isGrid && 'p-4')}>
          {/* 标题 */}
          <h2
            className={cn(
              'font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
              isFeatured ? 'text-2xl md:text-3xl' : isGrid ? 'text-lg' : 'text-xl'
            )}
          >
            {post.title}
          </h2>

          {/* 摘要 */}
          {showExcerpt && post.excerpt && (
            <p
              className={cn(
                'text-gray-600 dark:text-gray-400 mb-4 line-clamp-3',
                isGrid && 'text-sm line-clamp-2'
              )}
            >
              {post.excerpt}
            </p>
          )}

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {/* 作者 */}
            {showAuthor && post.author && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{typeof post.author === 'string' ? post.author : post.author.name}</span>
              </div>
            )}

            {/* 日期 */}
            {post.date && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
            )}

            {/* 阅读时间 */}
            {showReadingTime && post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readingTime} 分钟</span>
              </div>
            )}
          </div>

          {/* 阅读更多 */}
          <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
            <span>阅读更多</span>
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ArticleCard;
