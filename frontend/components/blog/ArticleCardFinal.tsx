/**
 * ArticleCard 组件 - 最终版本
 * 文章卡片组件，支持多种变体
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/types/blog';
import { cn, formatRelativeTime, calculateReadingTime } from '@/lib/utils';

interface ArticleCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showExcerpt?: boolean;
  showMeta?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  className?: string;
}

export function ArticleCard({
  post,
  variant = 'default',
  showExcerpt = true,
  showMeta = true,
  showAuthor = true,
  showCategory = true,
  showTags = false,
  className,
}: ArticleCardProps) {
  const cardVariants = {
    default: 'cyber-card-default',
    featured: 'cyber-card-featured',
    compact: 'cyber-card-compact',
    minimal: 'cyber-card-minimal',
  };

  const renderMeta = () => {
    if (!showMeta) return null;

    return (
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.publishedAt || post.createdAt}>
            {formatRelativeTime(post.publishedAt || post.createdAt)}
          </time>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{post.meta.readingTime} 分钟</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{post.meta.views}</span>
        </div>
        {post.meta.likes > 0 && (
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{post.meta.likes}</span>
          </div>
        )}
        {post.meta.comments > 0 && (
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.meta.comments}</span>
          </div>
        )}
      </div>
    );
  };

  const renderAuthor = () => {
    if (!showAuthor || !post.author) return null;

    return (
      <div className="flex items-center gap-3">
        {post.author.avatar && (
          <div className="relative w-10 h-10 overflow-hidden rounded-full">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-white">{post.author.name}</p>
          <p className="text-xs text-gray-400">{post.author.role}</p>
        </div>
      </div>
    );
  };

  const renderCategory = () => {
    if (!showCategory || !post.category) return null;

    return (
      <Link
        href={`/blog/category/${post.category.slug}`}
        className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-[var(--cyber-cyan)] text-black hover:bg-[var(--cyber-purple)] transition-colors"
      >
        {post.category.name}
      </Link>
    );
  };

  const renderTags = () => {
    if (!showTags || !post.tags || post.tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {post.tags.slice(0, 3).map(tag => (
          <Link
            key={tag.id}
            href={`/blog/tag/${tag.slug}`}
            className="text-xs px-2 py-1 rounded-md bg-[var(--cyber-muted)] text-gray-300 hover:text-[var(--cyber-cyan)] transition-colors"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    );
  };

  const content = (
    <>
      {/* 图片 */}
      {post.featuredImage && (
        <div className="relative aspect-video overflow-hidden rounded-lg mb-4 group">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* 分类 */}
      {variant !== 'minimal' && renderCategory()}

      {/* 标题 */}
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          'font-bold text-white hover:text-[var(--cyber-cyan)] transition-colors line-clamp-2',
          variant === 'featured' ? 'text-2xl' : 'text-xl'
        )}
      >
        {post.title}
      </Link>

      {/* 摘要 */}
      {showExcerpt && variant !== 'compact' && variant !== 'minimal' && (
        <p className="mt-2 text-gray-400 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      {/* 标签 */}
      {renderTags()}

      {/* 元数据 */}
      {variant !== 'minimal' && renderMeta()}

      {/* 作者 */}
      {variant === 'featured' && renderAuthor()}
    </>
  );

  if (variant === 'minimal') {
    return (
      <motion.div
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
        className={cn('p-4 rounded-lg bg-[var(--cyber-muted)]/30 hover:bg-[var(--cyber-muted)]/50 transition-colors', className)}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-6 rounded-xl border bg-gradient-to-br transition-all duration-300',
        'border-[var(--cyber-border)] hover:border-[var(--cyber-cyan)]',
        'from-[var(--cyber-muted)]/20 to-transparent',
        className
      )}
    >
      {content}
    </motion.article>
  );
}

export default ArticleCard;
