'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye, Heart, MessageSquare, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils/date';
import type { BlogCardData } from '@/types/blog';

interface CyberArticleCardProps {
  post: BlogCardData;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showStats?: boolean;
  className?: string;
}

export const CyberArticleCard: React.FC<CyberArticleCardProps> = ({
  post,
  variant = 'default',
  showExcerpt = true,
  showAuthor = true,
  showReadingTime = true,
  showStats = true,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardVariants = {
    default: 'cyber-card-default',
    featured: 'cyber-card-featured',
    compact: 'cyber-card-compact',
    minimal: 'cyber-card-minimal',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'bg-gradient-to-br from-[#0a0a0f] to-[#16162a]',
        'border border-cyber-cyan/30 backdrop-blur-sm',
        'hover:border-cyber-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]',
        'transition-all duration-300',
        className
      )}
    >
      {/* Glowing border effect */}
      <div className={cn(
        'absolute inset-0 rounded-lg',
        'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'blur-sm -z-10'
      )} />

      {/* Scanlines effect */}
      <div className="absolute inset-0 bg-[url('/public/patterns/scanlines.svg')] opacity-5 pointer-events-none" />

      {/* Featured image */}
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative aspect-video overflow-hidden">
            <motion.img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />

            {/* Featured badge */}
            {post.featured && (
              <div className="absolute top-4 right-4">
                <motion.div
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyber-pink/20 border border-cyber-pink/50"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4 text-cyber-pink" />
                  <span className="text-xs font-bold text-cyber-pink">FEATURED</span>
                </motion.div>
              </div>
            )}
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category tags */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="group/tag relative"
              >
                <div className="px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors">
                  <span className="text-xs font-mono text-cyber-cyan group-hover/tag:text-cyber-purple transition-colors">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-white group-hover:text-cyber-cyan transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <p className="text-gray-400 text-sm line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-mono">
          {showAuthor && post.author && (
            <div className="flex items-center gap-2">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-5 h-5 rounded-full ring-2 ring-cyber-cyan/30"
                />
              )}
              <span className="text-gray-300">{post.author.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <time dateTime={post.publishedAt?.toString()}>
              {formatRelativeTime(post.publishedAt?.toString())}
            </time>
          </div>

          {showReadingTime && post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readingTime} min read</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {showStats && (post.viewCount || post.likeCount || post.commentCount) && (
          <div className="flex items-center gap-4 pt-4 border-t border-cyber-cyan/20">
            {post.viewCount !== undefined && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Eye className="w-3 h-3" />
                <span>{post.viewCount}</span>
              </div>
            )}
            {post.likeCount !== undefined && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Heart className="w-3 h-3" />
                <span>{post.likeCount}</span>
              </div>
            )}
            {post.commentCount !== undefined && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MessageSquare className="w-3 h-3" />
                <span>{post.commentCount}</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Link
            href={`/blog/${post.slug}`}
            className="flex-1 px-4 py-2 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 hover:bg-cyber-cyan/20 hover:border-cyber-cyan transition-all text-center text-sm font-mono text-cyber-cyan"
          >
            READ MORE
          </Link>
          <button
            className={cn(
              'p-2 rounded border transition-all',
              post.isLiked
                ? 'bg-cyber-pink/20 border-cyber-pink/50 text-cyber-pink'
                : 'border-cyber-cyan/30 text-gray-400 hover:border-cyber-pink hover:text-cyber-pink'
            )}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            className={cn(
              'p-2 rounded border transition-all',
              post.isBookmarked
                ? 'bg-cyber-yellow/20 border-cyber-yellow/50 text-cyber-yellow'
                : 'border-cyber-cyan/30 text-gray-400 hover:border-cyber-yellow hover:text-cyber-yellow'
            )}
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated bottom border */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  );
};

export default CyberArticleCard;
