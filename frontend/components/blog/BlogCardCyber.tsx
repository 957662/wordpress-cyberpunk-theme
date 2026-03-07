/**
 * Blog Card - Cyber Style
 * 赛博朋克风格博客卡片组件 - 完整实现
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// Types
export interface BlogCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image_url?: string;
    view_count: number;
    like_count?: number;
    comment_count: number;
    created_at: string;
    reading_time?: number;
    category?: {
      id: number;
      name: string;
      slug: string;
    };
    tags: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    author: {
      id: number;
      username: string;
      full_name?: string;
      avatar_url?: string;
    };
  };
  variant?: 'default' | 'featured' | 'compact';
  showAuthor?: boolean;
  showStats?: boolean;
  onLike?: (postId: number) => void;
  onBookmark?: (postId: number) => void;
  onShare?: (postId: number) => void;
  className?: string;
}

export function BlogCardCyber({
  post,
  variant = 'default',
  showAuthor = true,
  showStats = true,
  onLike,
  onBookmark,
  onShare,
  className = '',
}: BlogCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // 处理图片错误
  const handleImageError = () => {
    setImageError(true);
  };

  // 处理点赞
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  // 处理收藏
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post.id);
  };

  // 处理分享
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(post.id);
  };

  // 格式化时间
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: zhCN,
  });

  // 精选卡片样式
  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`group relative cyber-card featured-card ${className}`}
      >
        <Link href={`/blog/${post.slug}`} className="block h-full">
          {/* 背景图片 */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            {!imageError && post.featured_image_url ? (
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>

          {/* 内容 */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[400px]">
            {/* 分类标签 */}
            {post.category && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center self-start px-3 py-1 mb-4 text-sm font-semibold text-cyber-dark bg-cyber-cyan rounded-full neon-border-cyan"
              >
                {post.category.name}
              </motion.span>
            )}

            {/* 标题 */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-glow-cyan transition-all"
            >
              {post.title}
            </motion.h2>

            {/* 摘要 */}
            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 mb-4 line-clamp-2"
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* 底部信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between text-sm text-gray-400"
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {timeAgo}
                </span>
                {post.reading_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.reading_time} 分钟
                  </span>
                )}
              </div>

              {showStats && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.like_count || 0}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // 紧凑卡片样式
  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`cyber-card compact-card ${className}`}
      >
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="flex gap-4">
            {/* 缩略图 */}
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              {!imageError && post.featured_image_url ? (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20" />
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              {/* 分类 */}
              {post.category && (
                <span className="text-xs text-cyber-cyan font-semibold">
                  {post.category.name}
                </span>
              )}

              {/* 标题 */}
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-glow-cyan transition-all">
                {post.title}
              </h3>

              {/* 统计 */}
              {showStats && (
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post.like_count || 0}
                  </span>
                  <span>{timeAgo}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // 默认卡片样式
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`cyber-card default-card group ${className}`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* 图片 */}
        <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
          {!imageError && post.featured_image_url ? (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-cyber-cyan/30">
                {post.title.charAt(0)}
              </span>
            </div>
          )}

          {/* 悬停操作 */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? 'bg-cyber-pink text-white'
                  : 'bg-white/20 text-white hover:bg-cyber-pink'
              }`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? 'bg-cyber-cyan text-cyber-dark'
                  : 'bg-white/20 text-white hover:bg-cyber-cyan'
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-cyber-purple transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* 分类标签 */}
          {post.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 text-xs font-semibold text-cyber-dark bg-cyber-cyan rounded-full neon-border-cyan">
                {post.category.name}
              </span>
            </div>
          )}

          {/* 阅读时间 */}
          {post.reading_time && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 text-xs font-semibold text-white bg-black/60 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.reading_time} 分钟
              </span>
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="space-y-3">
          {/* 标题 */}
          <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-glow-cyan transition-all">
            {post.title}
          </h3>

          {/* 摘要 */}
          {post.excerpt && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs text-cyber-purple bg-cyber-purple/10 rounded-md hover:bg-cyber-purple/20 transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 底部信息 */}
          <div className="flex items-center justify-between pt-3 border-t border-cyber-muted/30">
            {/* 作者信息 */}
            {showAuthor && (
              <div className="flex items-center gap-2">
                {post.author.avatar_url ? (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.full_name || post.author.username}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple" />
                )}
                <span className="text-sm text-gray-400">
                  {post.author.full_name || post.author.username}
                </span>
              </div>
            )}

            {/* 统计信息 */}
            {showStats && (
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {post.like_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {post.comment_count}
                </span>
                <span>{timeAgo}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default BlogCardCyber;
