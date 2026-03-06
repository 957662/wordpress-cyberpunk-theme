/**
 * ArticleCard 组件 - 完整版本
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye } from 'lucide-react';
import { Post } from '@/types/blog';
import { cn, formatRelativeTime } from '@/lib/utils';

interface ArticleCardProps {
  post: Post;
  className?: string;
}

export function ArticleCard({ post, className }: ArticleCardProps) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className={cn(
        'p-6 rounded-xl border bg-gradient-to-br transition-all duration-300',
        'border-[var(--cyber-border)] hover:border-[var(--cyber-cyan)]',
        'from-[var(--cyber-muted)]/20 to-transparent',
        className
      )}
    >
      {/* 图片 */}
      {post.featuredImage && (
        <div className="relative aspect-video overflow-hidden rounded-lg mb-4 group">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}

      {/* 分类 */}
      {post.category && (
        <Link
          href={`/blog/category/${post.category.slug}`}
          className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-[var(--cyber-cyan)] text-black hover:bg-[var(--cyber-purple)] transition-colors mb-3"
        >
          {post.category.name}
        </Link>
      )}

      {/* 标题 */}
      <Link
        href={`/blog/${post.slug}`}
        className="font-bold text-xl text-white hover:text-[var(--cyber-cyan)] transition-colors line-clamp-2"
      >
        {post.title}
      </Link>

      {/* 摘要 */}
      <p className="mt-2 text-gray-400 line-clamp-3">
        {post.excerpt}
      </p>

      {/* 元数据 */}
      <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <time>{formatRelativeTime(post.publishedAt || post.createdAt)}</time>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{post.meta.readingTime} 分钟</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{post.meta.views}</span>
        </div>
      </div>

      {/* 作者 */}
      {post.author && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--cyber-border)]">
          {post.author.avatar && (
            <div className="relative w-8 h-8 overflow-hidden rounded-full">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="text-sm text-gray-400">{post.author.name}</span>
        </div>
      )}
    </motion.article>
  );
}

export default ArticleCard;
