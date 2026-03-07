'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, MessageCircle, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

// ================================================================
// PostCard - 文章卡片组件
// ================================================================

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  author: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  status: 'draft' | 'pending' | 'private' | 'publish' | 'future' | 'trash';
  view_count: number;
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  is_sticky: boolean;
  published_at: string | null;
  created_at: string;
}

export interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'featured' | 'grid';
  showExcerpt?: boolean;
  showMeta?: boolean;
  showTags?: boolean;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  variant = 'default',
  showExcerpt = true,
  showMeta = true,
  showTags = false,
  className,
}) => {
  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // 渲染特色图片
  const renderFeaturedImage = () => {
    if (!post.featured_image) return null;

    return (
      <div className="relative aspect-video overflow-hidden rounded-lg bg-cyber-muted group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-shadow duration-300">
        <img
          src={post.featured_image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {post.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-cyber-pink px-3 py-1 text-xs font-bold text-white shadow-[0_0_15px_rgba(255,0,128,0.5)]">
              <Heart className="mr-1 h-3 w-3 fill-current" />
              精选
            </span>
          </div>
        )}
        {post.is_sticky && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-cyber-cyan px-3 py-1 text-xs font-bold text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              置顶
            </span>
          </div>
        )}
      </div>
    );
  };

  // 渲染分类
  const renderCategories = () => {
    if (post.categories.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {post.categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?category=${category.slug}`}
            className="inline-flex items-center text-xs font-medium transition-colors hover:text-cyber-cyan"
            style={{ color: category.color }}
          >
            <Tag className="mr-1 h-3 w-3" />
            {category.name}
          </Link>
        ))}
      </div>
    );
  };

  // 渲染标签
  const renderTags = () => {
    if (!showTags || post.tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.slice(0, 5).map((tag) => (
          <Link
            key={tag.id}
            href={`/blog?tag=${tag.slug}`}
            className="inline-flex items-center rounded-md bg-cyber-muted px-2 py-1 text-xs transition-colors hover:bg-cyber-muted/80"
            style={{ color: tag.color }}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    );
  };

  // 渲染元数据
  const renderMeta = () => {
    if (!showMeta) return null;

    return (
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center">
          <Calendar className="mr-1.5 h-4 w-4 text-cyber-cyan" />
          <time dateTime={post.published_at || post.created_at}>
            {formatDate(post.published_at || post.created_at)}
          </time>
        </div>

        <div className="flex items-center">
          <Eye className="mr-1.5 h-4 w-4 text-cyber-purple" />
          <span>{formatNumber(post.view_count)}</span>
        </div>

        <div className="flex items-center">
          <Heart className="mr-1.5 h-4 w-4 text-cyber-pink" />
          <span>{formatNumber(post.like_count)}</span>
        </div>

        <div className="flex items-center">
          <MessageCircle className="mr-1.5 h-4 w-4 text-cyber-green" />
          <span>{formatNumber(post.comment_count)}</span>
        </div>
      </div>
    );
  };

  // 渲染作者信息
  const renderAuthor = () => {
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-cyber-muted ring-2 ring-cyber-cyan/50">
          {post.author.avatar_url ? (
            <img
              src={post.author.avatar_url}
              alt={post.author.display_name || post.author.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyber-cyan to-cyber-purple text-white text-sm font-bold">
              {(post.author.display_name || post.author.username).charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-200">
            {post.author.display_name || post.author.username}
          </div>
          <div className="text-xs text-gray-500">@{post.author.username}</div>
        </div>
      </div>
    );
  };

  // 根据变体渲染不同的布局
  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn('group border-b border-cyber-muted py-4 last:border-0', className)}
      >
        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-cyber-cyan transition-colors line-clamp-1">
            {post.is_sticky && <span className="text-cyber-cyan mr-2">[置顶]</span>}
            {post.title}
          </h3>
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            <span>·</span>
            <span>{formatNumber(post.view_count)} 阅读</span>
            <span>·</span>
            <span>{formatNumber(post.comment_count)} 评论</span>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={cn('group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyber-muted/50 to-transparent p-6 border border-cyber-cyan/30 shadow-[0_0_40px_rgba(0,240,255,0.1)]', className)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          <Link href={`/blog/${post.slug}`} className="block">
            <h2 className="text-2xl font-bold text-gray-100 group-hover:text-cyber-cyan transition-colors line-clamp-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-3 text-gray-400 line-clamp-2">{post.excerpt}</p>
            )}
          </Link>

          <div className="mt-4 flex items-center justify-between">
            {renderAuthor()}
            {renderMeta()}
          </div>

          {renderTags()}
        </div>
      </motion.article>
    );
  }

  if (variant === 'grid') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn('group flex flex-col overflow-hidden rounded-xl bg-cyber-dark/50 border border-cyber-muted hover:border-cyber-cyan/50 transition-all duration-300', className)}
      >
        <Link href={`/blog/${post.slug}`} className="block">
          {post.featured_image && (
            <div className="relative aspect-video overflow-hidden bg-cyber-muted">
              <img
                src={post.featured_image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              {post.is_featured && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center rounded-full bg-cyber-pink px-2 py-1 text-xs font-bold text-white">
                    <Heart className="mr-1 h-3 w-3 fill-current" />
                    精选
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-1 flex-col p-4">
            {renderCategories()}
            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-cyber-cyan transition-colors line-clamp-2">
              {post.title}
            </h3>
            {showExcerpt && post.excerpt && (
              <p className="mt-2 flex-1 text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
            )}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>{formatDate(post.published_at || post.created_at)}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center">
                  <Eye className="mr-1 h-3 w-3" />
                  {formatNumber(post.view_count)}
                </span>
                <span className="flex items-center">
                  <Heart className="mr-1 h-3 w-3" />
                  {formatNumber(post.like_count)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // 默认变体
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('group flex flex-col gap-4 rounded-xl bg-cyber-dark/30 border border-cyber-muted p-6 hover:border-cyber-cyan/50 transition-all duration-300', className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Link href={`/blog/${post.slug}`} className="block">
            <h2 className="text-xl font-bold text-gray-100 group-hover:text-cyber-cyan transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          {renderCategories()}
        </div>
        {post.featured_image && (
          <Link
            href={`/blog/${post.slug}`}
            className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-cyber-muted group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-shadow duration-300"
          >
            <img
              src={post.featured_image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </Link>
        )}
      </div>

      {showExcerpt && post.excerpt && (
        <Link href={`/blog/${post.slug}`} className="block">
          <p className="text-gray-400 line-clamp-2">{post.excerpt}</p>
        </Link>
      )}

      <div className="flex items-center justify-between">
        {renderAuthor()}
        {renderMeta()}
      </div>

      {renderTags()}
    </motion.article>
  );
};

export default PostCard;
