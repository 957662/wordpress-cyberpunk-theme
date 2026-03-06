'use client';

/**
 * 统一的 BlogCard 组件
 * 支持多种数据格式，使用适配器转换
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  adaptWordPressPost,
  adaptCustomPost,
  blogPostToArticleCard,
  extractPostTitle,
  extractPostExcerpt,
  formatAuthor,
  formatTerm,
} from '@/lib/blog/adapters';
import type { BlogPost, WordPressPost } from '@/types/blog';

interface BlogCardUnifiedProps {
  // 接受多种数据格式
  post?: BlogPost | WordPressPost | any;
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showStats?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadTime?: boolean;
  showExcerpt?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  className?: string;
  onClick?: (post: BlogPost) => void;
  index?: number;
}

/**
 * 统一的博客卡片组件
 * 自动适配 WordPress API 和自定义数据格式
 */
export const BlogCardUnified: React.FC<BlogCardUnifiedProps> = ({
  post,
  variant = 'default',
  showStats = true,
  showAuthor = true,
  showDate = true,
  showReadTime = true,
  showExcerpt = true,
  showCategories = true,
  showTags = false,
  className = '',
  onClick,
  index = 0,
}) => {
  // 数据适配：转换为统一的 BlogPost 格式
  const blogPost: BlogPost = React.useMemo(() => {
    if (!post) {
      return {
        id: 'empty',
        title: 'No Post',
        slug: '',
        excerpt: '',
        author: { id: 'unknown', name: 'Unknown' },
        categories: [],
        tags: [],
        publishedAt: new Date().toISOString(),
        readTime: 0,
      };
    }

    // 检查是否已经是 BlogPost 格式
    if (post.title && typeof post.title === 'string' && post.slug && post.author) {
      return post as BlogPost;
    }

    // 检查是否是 WordPress 格式
    if ((post as WordPressPost).title?.rendered) {
      return adaptWordPressPost(post as WordPressPost);
    }

    // 尝试作为自定义格式处理
    try {
      return adaptCustomPost(post);
    } catch {
      // 如果都失败，返回最小格式
      return {
        id: post.id || 'unknown',
        title: extractPostTitle(post),
        slug: post.slug || '',
        excerpt: extractPostExcerpt(post),
        author: formatAuthor(post.author),
        categories: (post.categories || []).map(formatTerm),
        tags: (post.tags || []).map(formatTerm),
        publishedAt: post.publishedAt || post.date || new Date().toISOString(),
        readTime: post.readTime || post.reading_time || 5,
        featuredImage: post.featuredImage || post.featured_media || post.image,
      };
    }
  }, [post]);

  // 卡片动画变体
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
      },
    },
  };

  // 处理点击事件
  const handleClick = () => {
    onClick?.(blogPost);
  };

  // 获取分类颜色
  const getCategoryColor = (index: number) => {
    const colors = [
      'from-cyan-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-pink-500 to-red-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
    ];
    return colors[index % colors.length];
  };

  // ========== Featured 变体 ==========
  if (variant === 'featured') {
    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5 }}
        className={cn(
          'group relative overflow-hidden rounded-2xl',
          'bg-gradient-to-br from-dark-bg/80 to-dark-bg/60',
          'border border-cyber-cyan/30 backdrop-blur-sm',
          'hover:border-cyber-cyan/60 hover:shadow-neon-cyan',
          'transition-all duration-300',
          className
        )}
      >
        <Link
          href={`/blog/${blogPost.slug}`}
          className="block"
          onClick={handleClick}
        >
          {/* 特色图片 */}
          {blogPost.featuredImage && (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={blogPost.featuredImage}
                alt={blogPost.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />

              {/* 分类标签 */}
              {showCategories && blogPost.categories.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {blogPost.categories.slice(0, 2).map((category, idx) => (
                    <span
                      key={category.id}
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold text-white',
                        'bg-gradient-to-r',
                        getCategoryColor(idx)
                      )}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 内容 */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-cyber-cyan transition-colors line-clamp-2">
              {blogPost.title}
            </h2>

            {showExcerpt && (
              <p className="text-gray-400 mb-6 line-clamp-3">{blogPost.excerpt}</p>
            )}

            {/* 元信息 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {showAuthor && blogPost.author.avatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyber-cyan/50">
                    <Image
                      src={blogPost.author.avatar}
                      alt={blogPost.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {(showAuthor || showDate) && (
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    {showAuthor && <span>{blogPost.author.name}</span>}
                    {showDate && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatRelativeTime(blogPost.publishedAt)}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {showStats && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {showReadTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {blogPost.readTime}分钟
                    </span>
                  )}
                  {blogPost.viewCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {blogPost.viewCount}
                    </span>
                  )}
                  {blogPost.likeCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {blogPost.likeCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // ========== Compact 变体 ==========
  if (variant === 'compact') {
    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ x: 5 }}
        className={cn(
          'group',
          className
        )}
      >
        <Link
          href={`/blog/${blogPost.slug}`}
          className="flex gap-4 p-4 rounded-lg bg-dark-bg/50 border border-dark-border hover:border-cyber-cyan/50 transition-all"
          onClick={handleClick}
        >
          {blogPost.featuredImage && (
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={blogPost.featuredImage}
                alt={blogPost.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-2">
              {blogPost.title}
            </h3>

            {showExcerpt && (
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">{blogPost.excerpt}</p>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-500">
              {showReadTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {blogPost.readTime}分钟
                </span>
              )}
              {blogPost.viewCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {blogPost.viewCount}
                </span>
              )}
              {showDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatRelativeTime(blogPost.publishedAt)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // ========== Minimal 变体 ==========
  if (variant === 'minimal') {
    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={cn('group', className)}
      >
        <Link
          href={`/blog/${blogPost.slug}`}
          className="block py-3 border-b border-dark-border/50 hover:border-cyber-cyan/30 transition-colors"
          onClick={handleClick}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white group-hover:text-cyber-cyan transition-colors line-clamp-1 mb-1">
                {blogPost.title}
              </h3>
              {showAuthor && (
                <span className="text-xs text-gray-500">{blogPost.author.name}</span>
              )}
            </div>

            {showDate && (
              <time className="text-xs text-gray-500 flex-shrink-0">
                {formatRelativeTime(blogPost.publishedAt)}
              </time>
            )}
          </div>
        </Link>
      </motion.article>
    );
  }

  // ========== Default 变体 ==========
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      className={cn(
        'group h-full',
        'bg-dark-bg/50 border border-dark-border rounded-xl overflow-hidden',
        'hover:border-cyber-cyan/50 hover:shadow-neon-cyan/20',
        'transition-all duration-300',
        className
      )}
    >
      <Link
        href={`/blog/${blogPost.slug}`}
        className="block h-full"
        onClick={handleClick}
      >
        {/* 特色图片 */}
        {blogPost.featuredImage && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={blogPost.featuredImage}
              alt={blogPost.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-80" />
          </div>
        )}

        {/* 内容 */}
        <div className="p-6">
          {/* 分类标签 */}
          {showCategories && blogPost.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {blogPost.categories.slice(0, 2).map((category, idx) => (
                <span
                  key={category.id}
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-semibold text-white',
                    'bg-gradient-to-r',
                    getCategoryColor(idx)
                  )}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* 标题 */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2">
            {blogPost.title}
          </h3>

          {/* 摘要 */}
          {showExcerpt && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{blogPost.excerpt}</p>
          )}

          {/* 标签 */}
          {showTags && blogPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blogPost.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs text-gray-500 hover:text-cyber-cyan transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 底部信息 */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
            <div className="flex items-center gap-2">
              {showAuthor && blogPost.author.avatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={blogPost.author.avatar}
                    alt={blogPost.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {(showAuthor || showDate) && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {showAuthor && <span>{blogPost.author.name}</span>}
                  {showDate && showAuthor && <span>•</span>}
                  {showDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatRelativeTime(blogPost.publishedAt)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {showStats && (
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {showReadTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blogPost.readTime}分钟
                  </span>
                )}
                {blogPost.viewCount !== undefined && blogPost.viewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {blogPost.viewCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 装饰线 */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple group-hover:w-full transition-all duration-500" />
      </Link>
    </motion.article>
  );
};

export default BlogCardUnified;
