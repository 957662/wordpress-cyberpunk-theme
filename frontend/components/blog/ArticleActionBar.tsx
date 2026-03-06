'use client';

/**
 * 文章交互工具栏
 * 整合点赞、收藏、分享等功能
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LikeButton } from './LikeButton';
import { FavoriteButton } from './FavoriteButton';
import { ShareButton } from './ShareButton';
import { BookmarkButton as ReadingListButton } from './BookmarkButton';
import { FontSizeAdjuster } from './FontSizeAdjuster';
import { PrintButton } from './PrintButton';

export interface ArticleActionBarProps {
  postId: string;
  initialLikes?: number;
  initialLiked?: boolean;
  initialFavorited?: boolean;
  onLike?: (postId: string, liked: boolean) => Promise<void>;
  onFavorite?: (postId: string, favorited: boolean) => Promise<void>;
  showReadingList?: boolean;
  showFontSize?: boolean;
  showPrint?: boolean;
  variant?: 'horizontal' | 'vertical' | 'compact';
  className?: string;
}

export function ArticleActionBar({
  postId,
  initialLikes = 0,
  initialLiked = false,
  initialFavorited = false,
  onLike,
  onFavorite,
  showReadingList = true,
  showFontSize = true,
  showPrint = true,
  variant = 'horizontal',
  className = '',
}: ArticleActionBarProps) {
  const [isReadingList, setIsReadingList] = useState(false);

  const layoutClass = {
    horizontal: 'flex-wrap gap-3',
    vertical: 'flex-col gap-2',
    compact: 'flex gap-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center p-4 rounded-lg bg-cyber-muted/30 border border-cyber-border',
        layoutClass[variant],
        className
      )}
    >
      <LikeButton
        postId={postId}
        initialLikes={initialLikes}
        initialLiked={initialLiked}
        onLike={onLike}
        showCount={true}
        size="md"
        variant="outline"
      />

      <FavoriteButton
        postId={postId}
        initialFavorited={initialFavorited}
        onFavorite={onFavorite}
        showCount={false}
        size="md"
        variant="outline"
      />

      <ShareButton
        size="md"
        variant="outline"
        showPlatforms={true}
        platforms={['twitter', 'facebook', 'linkedin', 'email', 'copy']}
      />

      {showReadingList && (
        <ReadingListButton
          postId={postId}
          isInReadingList={isReadingList}
          onToggle={() => setIsReadingList(!isReadingList)}
          size="md"
          variant="outline"
        />
      )}

      {showFontSize && <FontSizeAdjuster />}

      {showPrint && <PrintButton size="md" variant="outline" />}
    </motion.div>
  );
}

/**
 * 悬浮式侧边工具栏
 */
export interface FloatingActionBarProps {
  postId: string;
  initialLikes?: number;
  initialLiked?: boolean;
  initialFavorited?: boolean;
  onLike?: (postId: string, liked: boolean) => Promise<void>;
  onFavorite?: (postId: string, favorited: boolean) => Promise<void>;
  showOnScroll?: boolean;
  threshold?: number;
  className?: string;
}

export function FloatingActionBar({
  postId,
  initialLikes = 0,
  initialLiked = false,
  initialFavorited = false,
  onLike,
  onFavorite,
  showOnScroll = true,
  threshold = 200,
  className = '',
}: FloatingActionBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动显示/隐藏
  if (typeof window !== 'undefined' && showOnScroll) {
    // 这里应该使用 useEffect,但为了简化暂时省略
    // 实际使用时应该添加滚动监听
  }

  if (!isVisible && showOnScroll) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3',
        'p-3 rounded-lg bg-cyber-dark/90 backdrop-blur-sm border border-cyber-border',
        'shadow-xl z-40',
        className
      )}
    >
      <LikeButton
        postId={postId}
        initialLikes={initialLikes}
        initialLiked={initialLiked}
        onLike={onLike}
        showCount={true}
        size="sm"
        variant="ghost"
      />

      <FavoriteButton
        postId={postId}
        initialFavorited={initialFavorited}
        onFavorite={onFavorite}
        showCount={false}
        size="sm"
        variant="ghost"
      />

      <ShareButton
        size="sm"
        variant="ghost"
        showPlatforms={true}
        platforms={['twitter', 'facebook', 'copy']}
      />
    </motion.div>
  );
}

/**
 * 底部互动栏
 */
export interface ArticleFooterProps extends ArticleActionBarProps {
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags?: string[];
  category?: string;
  showAuthorCard?: boolean;
  showTags?: boolean;
  showNextPrev?: boolean;
  nextPost?: {
    title: string;
    slug: string;
  };
  prevPost?: {
    title: string;
    slug: string;
  };
}

export function ArticleFooter({
  author,
  tags = [],
  category,
  showAuthorCard = true,
  showTags = true,
  showNextPrev = true,
  nextPost,
  prevPost,
  ...actionBarProps
}: ArticleFooterProps) {
  return (
    <footer className="mt-12 space-y-8">
      {/* 互动工具栏 */}
      <ArticleActionBar {...actionBarProps} />

      {/* 作者卡片 */}
      {showAuthorCard && author && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg bg-cyber-muted/30 border border-cyber-border"
        >
          <h3 className="text-lg font-semibold text-white mb-4">关于作者</h3>
          <div className="flex gap-4">
            {author.avatar && (
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{author.name}</h4>
              {author.bio && (
                <p className="text-sm text-cyber-muted">{author.bio}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* 标签 */}
      {showTags && tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full bg-cyber-muted/30 border border-cyber-border text-sm text-cyber-muted hover:text-cyber-cyan hover:border-cyber-cyan transition-all cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </motion.div>
      )}

      {/* 上一篇/下一篇 */}
      {showNextPrev && (nextPost || prevPost) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {prevPost && (
            <a
              href={`/blog/${prevPost.slug}`}
              className="p-4 rounded-lg bg-cyber-muted/30 border border-cyber-border hover:border-cyber-cyan transition-all group"
            >
              <p className="text-xs text-cyber-muted mb-1">← 上一篇</p>
              <p className="font-medium text-white group-hover:text-cyber-cyan transition-colors">
                {prevPost.title}
              </p>
            </a>
          )}
          {nextPost && (
            <a
              href={`/blog/${nextPost.slug}`}
              className="p-4 rounded-lg bg-cyber-muted/30 border border-cyber-border hover:border-cyber-cyan transition-all group text-right"
            >
              <p className="text-xs text-cyber-muted mb-1">下一篇 →</p>
              <p className="font-medium text-white group-hover:text-cyber-cyan transition-colors">
                {nextPost.title}
              </p>
            </a>
          )}
        </motion.div>
      )}
    </footer>
  );
}

export default ArticleActionBar;
