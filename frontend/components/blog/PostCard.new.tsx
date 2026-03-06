/**
 * PostCard Component
 * 文章卡片组件 - 展示文章摘要信息
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock } from 'lucide-react';
import { formatDate, formatReadingTime } from '@/lib/utils';

interface PostCardProps {
  post: any;
  variant?: 'default' | 'compact' | 'featured' | 'grid';
  showThumbnail?: boolean;
  showMeta?: boolean;
  showExcerpt?: boolean;
  className?: string;
}

export function PostCard({
  post,
  variant = 'default',
  showThumbnail = true,
  showMeta = true,
  showExcerpt = true,
  className = '',
}: PostCardProps) {
  // 提取文章数据
  const title = post.title?.rendered?.replace(/<[^>]*>/g, '') || 'Untitled';
  const excerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '';
  const date = post.date || post.date_gmt;
  const author = post.author_data?.name || 'Unknown Author';
  const slug = post.slug || post.id.toString();

  // 获取特色图片
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredImage?.source_url || post.featured_image;

  // 获取分类
  const categories = post._embedded?.['wp:term']?.[0] || [];

  // 根据变体选择样式
  const baseStyles = 'cyber-card group overflow-hidden transition-all duration-300 hover:shadow-cyber-glow';
  const variantStyles = {
    default: 'flex flex-col',
    compact: 'flex flex-row gap-4',
    featured: 'relative h-96',
    grid: 'flex flex-col',
  };

  return (
    <article className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <Link href={`/blog/${slug}`} className="contents">
        {/* 特色图片 */}
        {showThumbnail && imageUrl && (
          <div className={`relative overflow-hidden ${variant === 'compact' ? 'w-48 h-32 flex-shrink-0' : variant === 'featured' ? 'absolute inset-0' : 'w-full h-48'}`}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* 图片遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
          </div>
        )}

        {/* 内容区域 */}
        <div className={`flex flex-col ${variant === 'compact' ? 'flex-1 min-w-0' : variant === 'featured' ? 'absolute bottom-0 left-0 right-0 p-6' : 'p-6'}`}>
          {/* 分类标签 */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.slice(0, 3).map((category: any) => (
                <span
                  key={category.id}
                  className="px-3 py-1 text-xs font-medium bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full hover:bg-cyber-cyan/20 transition-colors"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* 标题 */}
          <h3 className={`font-bold text-white group-hover:text-cyber-cyan transition-colors ${variant === 'featured' ? 'text-3xl mb-2' : variant === 'compact' ? 'text-xl mb-2 line-clamp-2' : 'text-2xl mb-3 line-clamp-2'}`}>
            {title}
          </h3>

          {/* 摘要 */}
          {showExcerpt && excerpt && variant !== 'featured' && (
            <p className="text-cyber-text-secondary line-clamp-3 mb-4">
              {excerpt}
            </p>
          )}

          {/* 元信息 */}
          {showMeta && (
            <div className={`flex items-center gap-4 text-sm text-cyber-text-tertiary ${variant === 'featured' ? 'text-white' : ''}`}>
              {/* 作者 */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>

              {/* 日期 */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={date}>
                  {formatDate(date)}
                </time>
              </div>

              {/* 阅读时间 */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatReadingTime(post.content?.rendered || '')}</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

/**
 * PostGrid Component
 * 文章网格组件
 */
interface PostGridProps {
  posts: any[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function PostGrid({ posts, columns = 3, className = '' }: PostGridProps) {
  const gridStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridStyles[columns]} gap-6 ${className}`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant="grid" />
      ))}
    </div>
  );
}

/**
 * PostList Component
 * 文章列表组件
 */
interface PostListProps {
  posts: any[];
  className?: string;
}

export function PostList({ posts, className = '' }: PostListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant="default" />
      ))}
    </div>
  );
}

/**
 * PostCompactList Component
 * 紧凑文章列表组件
 */
interface PostCompactListProps {
  posts: any[];
  className?: string;
}

export function PostCompactList({ posts, className = '' }: PostCompactListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant="compact" />
      ))}
    </div>
  );
}

export default PostCard;
