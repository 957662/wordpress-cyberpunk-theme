'use client';

/**
 * 博客卡片组件
 * 展示文章摘要信息
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  views?: number;
  likes?: number;
  comments?: number;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function BlogCard({
  id,
  title,
  excerpt,
  author,
  coverImage,
  category,
  tags,
  publishedAt,
  readingTime,
  views = 0,
  likes = 0,
  comments = 0,
  isBookmarked = false,
  onBookmark,
  variant = 'default',
  className,
}: BlogCardProps) {
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    onBookmark?.(id);
  };

  const timeAgo = formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
    locale: zhCN,
  });

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Link href={`/blog/${id}`}>
          <div className={cn(
            'cyber-card p-4 hover:border-cyber-cyan/50 transition-all cursor-pointer group',
            className
          )}>
            <div className="flex gap-4">
              {coverImage && (
                <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-cyber-cyan font-medium">{category}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-xs text-gray-500">{timeAgo}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-1 line-clamp-1 group-hover:text-cyber-cyan transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-1">{excerpt}</p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative group"
      >
        <Link href={`/blog/${id}`}>
          <div className={cn(
            'cyber-card overflow-hidden cursor-pointer',
            'border-cyber-cyan/30 hover:border-cyber-cyan transition-all',
            className
          )}>
            {coverImage && (
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-sm font-medium bg-cyber-cyan text-cyber-dark rounded">
                    {category}
                  </span>
                </div>
              </div>
            )}
            <div className="p-6 -mt-12 relative">
              <h2 className="text-2xl font-display font-bold text-white mb-3 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                {title}
              </h2>
              <p className="text-gray-400 mb-4 line-clamp-2">{excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {author.avatar && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image src={author.avatar} alt={author.name} fill />
                    </div>
                  )}
                  <span className="text-sm text-gray-400">{author.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {readingTime} 分钟
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/blog/${id}`}>
        <div className={cn(
          'cyber-card overflow-hidden cursor-pointer group',
          'hover:border-cyber-cyan/50 transition-all duration-300',
          className
        )}>
          {coverImage && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-xs font-medium bg-cyber-cyan/90 text-cyber-dark rounded backdrop-blur-sm">
                  {category}
                </span>
              </div>
            </div>
          )}

          <div className="p-5">
            <h3 className="text-xl font-display font-bold text-white mb-2 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
              {title}
            </h3>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{excerpt}</p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded border border-cyber-border text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-cyber-border">
              <div className="flex items-center gap-3">
                {author.avatar && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image src={author.avatar} alt={author.name} fill />
                  </div>
                )}
                <span className="text-xs text-gray-500">{author.name}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingTime} 分钟
                </span>
                {views > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {comments}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 收藏按钮 */}
          {onBookmark && (
            <button
              onClick={handleBookmark}
              className="absolute top-3 right-3 p-2 rounded-full bg-cyber-dark/80 backdrop-blur-sm hover:bg-cyber-cyan/20 transition-all group/btn"
              aria-label={isBookmarked ? '取消收藏' : '收藏'}
            >
              <Bookmark
                className={cn(
                  'w-4 h-4 transition-colors',
                  isBookmarked ? 'fill-cyber-pink text-cyber-pink' : 'text-gray-400 group-hover/btn:text-cyber-cyan'
                )}
              />
            </button>
          )}
        </div>
      </Link>

      {/* 悬浮操作栏 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          onClick={handleBookmark}
          className={cn(
            'p-2 rounded-full backdrop-blur-sm transition-all',
            isBookmarked
              ? 'bg-cyber-pink/20 text-cyber-pink'
              : 'bg-cyber-dark/80 text-gray-400 hover:text-cyber-cyan'
          )}
        >
          <Heart className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
        </button>
      </motion.div>
    </motion.div>
  );
}
