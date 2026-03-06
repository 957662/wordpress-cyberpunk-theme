/**
 * EnhancedBlogCard - 增强的博客卡片组件
 * 支持阅读进度、收藏状态、快速预览
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Bookmark,
  BookmarkCheck,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/lib/images/image-optimizer';

export interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  featured?: boolean;
}

interface EnhancedBlogCardProps {
  post: BlogPost;
  onRead?: (postId: string | number) => void;
  onBookmark?: (postId: string | number) => void;
  onShare?: (post: BlogPost) => void;
  showReadingProgress?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function EnhancedBlogCard({
  post,
  onRead,
  onBookmark,
  onShare,
  showReadingProgress = true,
  variant = 'default',
  className,
}: EnhancedBlogCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [readingProgress, setReadingProgress] = useState(0);

  // 从localStorage获取阅读进度
  useEffect(() => {
    if (showReadingProgress) {
      const saved = localStorage.getItem(`reading-progress-${post.id}`);
      if (saved) {
        setReadingProgress(parseFloat(saved));
      }
    }

    // 检查收藏状态
    const bookmarked = localStorage.getItem(`bookmarked-${post.id}`);
    if (bookmarked) {
      setIsBookmarked(true);
    }
  }, [post.id, showReadingProgress]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);

    if (isBookmarked) {
      localStorage.removeItem(`bookmarked-${post.id}`);
    } else {
      localStorage.setItem(`bookmarked-${post.id}`, 'true');
    }

    onBookmark?.(post.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.origin + `/blog/${post.id}`,
      });
    } else {
      onShare?.(post);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return '今天';
    if (diffInDays === 1) return '昨天';
    if (diffInDays < 7) return `${diffInDays} 天前`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} 周前`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} 个月前`;
    return `${Math.floor(diffInDays / 365)} 年前`;
  };

  const renderFeaturedCard = () => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onRead?.(post.id)}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-cyber-dark border border-cyber-cyan/20',
        'hover:border-cyber-cyan/40 hover:shadow-lg hover:shadow-cyber-cyan/20',
        'transition-all duration-300 cursor-pointer',
        className
      )}
    >
      {/* 封面图片 */}
      <div className="relative h-80 overflow-hidden">
        {post.coverImage ? (
          <OptimizedImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20" />
        )}

        {/* 阅读进度条 */}
        {showReadingProgress && readingProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyber-muted/50">
            <motion.div
              className="h-full bg-cyber-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${readingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* 特色标签 */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold bg-cyber-pink text-white rounded-full">
            精选
          </span>
        </div>

        {/* 分类标签 */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-semibold bg-cyber-cyan text-black rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
          {post.title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author.name}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime} 分钟阅读</span>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>

          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-cyber-pink transition-colors"
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-cyber-pink text-cyber-pink')} />
            <span>{likesCount}</span>
          </button>

          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments}</span>
          </div>

          <div className="flex-1" />

          <button
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-cyber-cyan transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleBookmark}
            className="flex items-center gap-1 hover:text-cyber-purple transition-colors"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-cyber-purple text-cyber-purple" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-cyber-muted/30 text-muted-foreground rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 悬浮时的发光效果 */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/5 to-transparent" />
      </div>
    </motion.article>
  );

  const renderDefaultCard = () => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onRead?.(post.id)}
      className={cn(
        'group relative overflow-hidden rounded-xl',
        'bg-cyber-dark border border-cyber-cyan/20',
        'hover:border-cyber-cyan/40 hover:shadow-lg hover:shadow-cyber-cyan/20',
        'transition-all duration-300 cursor-pointer',
        className
      )}
    >
      {/* 封面图片 */}
      <div className="relative h-48 overflow-hidden">
        {post.coverImage ? (
          <OptimizedImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20" />
        )}

        {/* 阅读进度条 */}
        {showReadingProgress && readingProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyber-muted/50">
            <motion.div
              className="h-full bg-cyber-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${readingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* 分类标签 */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-semibold bg-cyber-cyan text-black rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        {/* 元信息 */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{post.author.name}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.readingTime} 分钟</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{post.views}</span>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 px-2 py-1 text-xs hover:text-cyber-pink transition-colors"
          >
            <Heart className={cn('w-3 h-3', isLiked && 'fill-cyber-pink text-cyber-pink')} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleBookmark}
            className="flex items-center gap-1 px-2 py-1 text-xs hover:text-cyber-purple transition-colors"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-3 h-3 fill-cyber-purple text-cyber-purple" />
            ) : (
              <Bookmark className="w-3 h-3" />
            )}
          </button>

          <div className="flex-1" />

          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-cyber-cyan transition-colors" />
        </div>
      </div>
    </motion.article>
  );

  const renderCompactCard = () => (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      onClick={() => onRead?.(post.id)}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'bg-cyber-dark border border-cyber-cyan/10',
        'hover:border-cyber-cyan/30',
        'transition-all duration-300 cursor-pointer',
        className
      )}
    >
      <div className="flex gap-4 p-3">
        {/* 缩略图 */}
        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
          {post.coverImage ? (
            <OptimizedImage
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20" />
          )}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
            {post.title}
          </h4>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{post.author.name}</span>
            <span>•</span>
            <span>{post.readingTime} 分钟</span>
            <span>•</span>
            <span>{post.views} 浏览</span>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleBookmark}
            className="hover:text-cyber-purple transition-colors"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-cyber-purple text-cyber-purple" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleLike}
            className="hover:text-cyber-pink transition-colors"
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-cyber-pink text-cyber-pink')} />
          </button>
        </div>
      </div>

      {/* 阅读进度条 */}
      {showReadingProgress && readingProgress > 0 && (
        <div className="h-0.5 bg-cyber-muted/50">
          <motion.div
            className="h-full bg-cyber-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </motion.article>
  );

  if (variant === 'featured') {
    return renderFeaturedCard();
  }

  if (variant === 'compact') {
    return renderCompactCard();
  }

  return renderDefaultCard();
}

export default EnhancedBlogCard;
