/**
 * ArticleCardUnified - 统一的文章卡片组件
 * 支持 WordPress API 和标准 Post 两种数据格式
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { formatRelativeTime, extractExcerpt } from '@/lib/utils/format';
import { adaptPost } from '@/lib/utils/adapters';
import { Post } from '@/types';

export interface ArticleCardUnifiedProps {
  post: Post | any; // 接受任何格式，内部会转换
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showExcerpt?: boolean;
  showMeta?: boolean;
  showStats?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  className?: string;
}

export const ArticleCardUnified: React.FC<ArticleCardUnifiedProps> = ({
  post,
  variant = 'default',
  showExcerpt = true,
  showMeta = true,
  showStats = false,
  showAuthor = true,
  showCategory = true,
  showTags = false,
  className,
}) => {
  // 适配数据格式
  const adaptedPost: Post = adaptPost(post);

  const {
    id,
    title,
    slug,
    excerpt,
    coverImage,
    author,
    category,
    tags,
    createdAt,
    readingTime = 0,
    views = 0,
    likes = 0,
    comments = 0,
  } = adaptedPost;

  // 构建文章链接
  const postLink = `/blog/${slug}`;

  // 根据变体决定样式
  const variants = {
    default: 'aspect-video',
    compact: 'aspect-[4/3]',
    featured: 'aspect-[21/9]',
    minimal: 'hidden',
  };

  const titleSizes = {
    default: 'text-xl',
    compact: 'text-lg',
    featured: 'text-2xl',
    minimal: 'text-base',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'border border-cyber-cyan/30 bg-deep-black/80 backdrop-blur-sm',
        'hover:border-cyber-cyan/60 transition-all duration-300',
        'hover:shadow-lg hover:shadow-cyber-cyan/20',
        className
      )}
    >
      {/* 特色图片 */}
      {coverImage && variant !== 'minimal' && (
        <Link href={postLink}>
          <div className={cn('relative overflow-hidden bg-cyber-muted', variants[variant])}>
            <motion.img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-70" />

            {/* 分类标签 */}
            {showCategory && category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-mono rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 backdrop-blur-sm">
                  {category}
                </span>
              </div>
            )}
          </div>
        </Link>
      )}

      {/* 内容区域 */}
      <div className={cn('p-6', !coverImage && 'pt-6')}>
        {/* 标签 */}
        {showTags && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Link
                key={index}
                href={`/blog?tag=${tag}`}
                className="text-xs font-mono px-2 py-1 rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30 hover:bg-cyber-purple/20 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* 标题 */}
        <Link href={postLink}>
          <h3
            className={cn(
              'font-bold mb-3 text-white group-hover:text-cyber-cyan transition-colors line-clamp-2',
              titleSizes[variant]
            )}
          >
            {title}
          </h3>
        </Link>

        {/* 摘要 */}
        {showExcerpt && variant !== 'minimal' && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {extractExcerpt(excerpt, 150)}
          </p>
        )}

        {/* 元信息 */}
        {showMeta && (
          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mb-3">
            {createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <time dateTime={createdAt}>{formatRelativeTime(createdAt)}</time>
              </div>
            )}
            {readingTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readingTime} 分钟阅读</span>
              </div>
            )}
          </div>
        )}

        {/* 统计信息 */}
        {showStats && (views > 0 || likes > 0 || comments > 0) && (
          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mb-3">
            {views > 0 && (
              <div className="flex items-center gap-1" title="浏览次数">
                <Eye className="w-3 h-3" />
                <span>{formatNumber(views)}</span>
              </div>
            )}
            {likes > 0 && (
              <div className="flex items-center gap-1" title="点赞数">
                <Heart className="w-3 h-3" />
                <span>{formatNumber(likes)}</span>
              </div>
            )}
            {comments > 0 && (
              <div className="flex items-center gap-1" title="评论数">
                <MessageCircle className="w-3 h-3" />
                <span>{formatNumber(comments)}</span>
              </div>
            )}
          </div>
        )}

        {/* 作者信息 */}
        {showAuthor && author && (
          <div className="flex items-center gap-3 pt-3 border-t border-cyber-cyan/10">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-cyber-cyan/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                <User className="w-4 h-4 text-cyber-cyan" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{author.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple group-hover:w-full transition-all duration-500" />
    </motion.article>
  );
};

export default ArticleCardUnified;
