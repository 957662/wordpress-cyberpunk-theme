/**
 * SocialCard Component
 * 社交卡片组件 - 展示用户、文章等社交信息
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Share2, Eye } from 'lucide-react';
import { cn, formatNumber, formatRelativeTime } from '@/lib/utils';

interface SocialCardProps {
  type: 'user' | 'post' | 'comment';
  title?: string;
  excerpt?: string;
  thumbnail?: string;
  author?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  stats?: {
    likes?: number;
    comments?: number;
    bookmarks?: number;
    views?: number;
  };
  createdAt?: string;
  onLike?: () => void;
  onComment?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
  className?: string;
  compact?: boolean;
}

export function SocialCard({
  type,
  title,
  excerpt,
  thumbnail,
  author,
  stats = {},
  createdAt,
  onLike,
  onComment,
  onBookmark,
  onShare,
  isLiked = false,
  isBookmarked = false,
  className,
  compact = false,
}: SocialCardProps) {
  const cardContent = () => {
    switch (type) {
      case 'user':
        return (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {author?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-lg">
                {author?.displayName || '未知用户'}
              </h3>
              <p className="text-sm text-slate-400">@{author?.username || 'user'}</p>
              {stats.followers !== undefined && (
                <p className="text-sm text-slate-500 mt-1">
                  {formatNumber(stats.followers)} 粉丝
                </p>
              )}
            </div>
          </div>
        );

      case 'post':
      case 'comment':
        return (
          <>
            {/* Author Info */}
            {author && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {author.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {author.displayName}
                  </p>
                  <p className="text-xs text-slate-400">@{author.username}</p>
                </div>
                {createdAt && (
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {formatRelativeTime(createdAt)}
                  </span>
                )}
              </div>
            )}

            {/* Thumbnail */}
            {thumbnail && !compact && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 group">
                <img
                  src={thumbnail}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}

            {/* Content */}
            <div className="space-y-2">
              {title && (
                <h3 className="font-semibold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {title}
                </h3>
              )}
              {excerpt && (
                <p className="text-sm text-slate-400 line-clamp-2">{excerpt}</p>
              )}
            </div>

            {/* Stats */}
            {(stats.likes || stats.comments || stats.bookmarks || stats.views) && (
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800">
                {stats.views !== undefined && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Eye size={16} />
                    <span>{formatNumber(stats.views)}</span>
                  </div>
                )}
                {stats.likes !== undefined && (
                  <div className={cn(
                    'flex items-center gap-1.5 text-sm transition-colors',
                    isLiked ? 'text-rose-400' : 'text-slate-500'
                  )}>
                    <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                    <span>{formatNumber(stats.likes)}</span>
                  </div>
                )}
                {stats.comments !== undefined && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <MessageCircle size={16} />
                    <span>{formatNumber(stats.comments)}</span>
                  </div>
                )}
                {stats.bookmarks !== undefined && (
                  <div className={cn(
                    'flex items-center gap-1.5 text-sm transition-colors',
                    isBookmarked ? 'text-amber-400' : 'text-slate-500'
                  )}>
                    <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                    <span>{formatNumber(stats.bookmarks)}</span>
                  </div>
                )}
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'p-4 rounded-lg border bg-slate-900/50 transition-all duration-200 group',
        'hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-500/10',
        className
      )}
    >
      {cardContent()}

      {/* Actions */}
      {(onLike || onComment || onBookmark || onShare) && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
          {onLike && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLike}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                isLiked
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-800'
              )}
            >
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              <span className="text-sm font-medium">赞</span>
            </motion.button>
          )}

          {onComment && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComment}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm font-medium">评论</span>
            </motion.button>
          )}

          {onBookmark && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookmark}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-800'
              )}
            >
              <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
              <span className="text-sm font-medium">收藏</span>
            </motion.button>
          )}

          {onShare && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">分享</span>
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default SocialCard;
