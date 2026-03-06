/**
 * 文章统计组件
 * 显示浏览量、点赞数、评论数等统计信息
 */

'use client';

import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ArticleStatsProps {
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  bookmarkCount?: number;
  shareCount?: number;
  variant?: 'default' | 'compact' | 'minimal';
  showLabels?: boolean;
  className?: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export function ArticleStats({
  viewCount = 0,
  likeCount = 0,
  commentCount = 0,
  bookmarkCount = 0,
  shareCount = 0,
  variant = 'default',
  showLabels = true,
  className,
  onLike,
  onBookmark,
  onShare,
  isLiked = false,
  isBookmarked = false,
}: ArticleStatsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const StatItem = ({
    icon: Icon,
    count,
    label,
    onClick,
    active,
  }: {
    icon: any;
    count: number;
    label: string;
    onClick?: () => void;
    active?: boolean;
  }) => {
    if (variant === 'minimal') {
      return (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Icon className="w-3 h-3" />
          <span>{formatNumber(count)}</span>
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <button
          onClick={onClick}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors',
            onClick
              ? 'hover:bg-cyber-cyan/10 cursor-pointer'
              : 'cursor-default',
            active && 'text-cyber-cyan'
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="font-medium">{formatNumber(count)}</span>
        </button>
      );
    }

    return (
      <motion.button
        whileHover={onClick ? { scale: 1.05 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
          onClick
            ? 'hover:bg-cyber-cyan/10 cursor-pointer'
            : 'cursor-default',
          active && 'text-cyber-cyan'
        )}
      >
        <Icon className="w-4 h-4" />
        <span className="font-medium">{formatNumber(count)}</span>
        {showLabels && <span className="text-gray-500">{label}</span>}
      </motion.button>
    );
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        variant === 'default' && 'flex-wrap',
        className
      )}
    >
      <StatItem icon={Eye} count={viewCount} label="浏览" />

      <StatItem
        icon={Heart}
        count={likeCount}
        label="点赞"
        onClick={onLike}
        active={isLiked}
      />

      <StatItem icon={MessageCircle} count={commentCount} label="评论" />

      {variant !== 'minimal' && (
        <>
          <StatItem
            icon={Bookmark}
            count={bookmarkCount}
            label="收藏"
            onClick={onBookmark}
            active={isBookmarked}
          />
          {onShare && variant === 'default' && (
            <StatItem icon={Share2} count={shareCount} label="分享" onClick={onShare} />
          )}
        </>
      )}
    </div>
  );
}

export default ArticleStats;
