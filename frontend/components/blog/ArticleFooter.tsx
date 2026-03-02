'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  Heart,
  MessageSquare,
  Twitter,
  Linkedin,
  Link2,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string;
}

interface ArticleFooterProps {
  /**
   * 上一篇文章
   */
  prevArticle?: Article;
  /**
   * 下一篇文章
   */
  nextArticle?: Article;
  /**
   * 当前文章ID（用于点赞）
   */
  articleId?: number | string;
  /**
   * 是否显示分享按钮
   */
  showShare?: boolean;
  /**
   * 是否显示书签按钮
   */
  showBookmark?: boolean;
  /**
   * 是否显示评论按钮
   */
  showComments?: boolean;
  /**
   * 点赞数
   */
  likes?: number;
  /**
   * 评论数
   */
  comments?: number;
  /**
   * 是否已点赞
   */
  isLiked?: boolean;
  /**
   * 是否已收藏
   */
  isBookmarked?: boolean;
  /**
   * 点赞回调
   */
  onLike?: () => void;
  /**
   * 收藏回调
   */
  onBookmark?: () => void;
  /**
   * 分享回调
   */
  onShare?: (platform: string) => void;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * ArticleFooter - 文章底部组件
 *
 * 功能特性：
 * - 上一篇/下一篇导航
 * - 社交分享按钮
 * - 点赞、收藏功能
 * - 复制链接
 * - 赛博朋克风格
 */
export function ArticleFooter({
  prevArticle,
  nextArticle,
  articleId,
  showShare = true,
  showBookmark = true,
  showComments = true,
  likes = 0,
  comments = 0,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onShare,
  className = '',
}: ArticleFooterProps) {
  const [copied, setCopied] = useState(false);

  // 复制链接
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 分享到社交媒体
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    const title = encodeURIComponent(nextArticle?.title || 'Check out this article');

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      weibo: `https://service.weibo.com/share/share.php?url=${url}&title=${title}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }

    onShare?.(platform);
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`mt-12 pt-8 border-t border-cyber-cyan/20 ${className}`}
    >
      {/* 文章导航 */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* 上一篇文章 */}
        {prevArticle ? (
          <Link
            href={`/blog/${prevArticle.slug}`}
            className="group p-6 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/50 transition-all"
          >
            <div className="flex items-center gap-3 text-cyber-muted text-sm mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span>上一篇</span>
            </div>
            <h3 className="text-lg font-semibold text-cyber-white group-hover:text-cyber-cyan transition-colors line-clamp-2">
              {prevArticle.title}
            </h3>
            {prevArticle.excerpt && (
              <p className="mt-2 text-sm text-cyber-gray line-clamp-2">
                {prevArticle.excerpt}
              </p>
            )}
          </Link>
        ) : (
          <div className="p-6 bg-cyber-dark/30 border border-cyber-cyan/10 rounded-lg opacity-50">
            <div className="flex items-center gap-3 text-cyber-muted text-sm mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span>上一篇</span>
            </div>
            <p className="text-sm text-cyber-gray">已经是第一篇了</p>
          </div>
        )}

        {/* 下一篇文章 */}
        {nextArticle ? (
          <Link
            href={`/blog/${nextArticle.slug}`}
            className="group p-6 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/50 transition-all"
          >
            <div className="flex items-center justify-end gap-3 text-cyber-muted text-sm mb-2">
              <span>下一篇</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-right text-cyber-white group-hover:text-cyber-cyan transition-colors line-clamp-2">
              {nextArticle.title}
            </h3>
            {nextArticle.excerpt && (
              <p className="mt-2 text-sm text-right text-cyber-gray line-clamp-2">
                {nextArticle.excerpt}
              </p>
            )}
          </Link>
        ) : (
          <div className="p-6 bg-cyber-dark/30 border border-cyber-cyan/10 rounded-lg opacity-50">
            <div className="flex items-center justify-end gap-3 text-cyber-muted text-sm mb-2">
              <span>下一篇</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <p className="text-sm text-right text-cyber-gray">已经是最后一篇了</p>
          </div>
        )}
      </div>

      {/* 操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg">
        {/* 左侧：互动按钮 */}
        <div className="flex items-center gap-3">
          {/* 点赞按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLike}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${isLiked
                ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50'
                : 'bg-cyber-dark/50 text-cyber-gray border border-cyber-cyan/20 hover:border-cyber-cyan/50'
              }
            `}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likes}</span>
          </motion.button>

          {/* 收藏按钮 */}
          {showBookmark && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookmark}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${isBookmarked
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50'
                  : 'bg-cyber-dark/50 text-cyber-gray border border-cyber-cyan/20 hover:border-cyber-cyan/50'
                }
              `}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="text-sm hidden sm:inline">
                {isBookmarked ? '已收藏' : '收藏'}
              </span>
            </motion.button>
          )}

          {/* 评论按钮 */}
          {showComments && (
            <Link
              href={`#comments`}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 text-cyber-gray border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/50 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">评论 ({comments})</span>
            </Link>
          )}
        </div>

        {/* 右侧：分享按钮 */}
        {showShare && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-cyber-muted mr-2 hidden sm:inline">
              分享到：
            </span>

            {/* Twitter */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleShare('twitter')}
              className="p-2.5 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/30 rounded-lg hover:bg-[#1DA1F2]/20 transition-colors"
              title="分享到 Twitter"
            >
              <Twitter className="w-5 h-5" />
            </motion.button>

            {/* LinkedIn */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleShare('linkedin')}
              className="p-2.5 bg-[#0077B5]/10 text-[#0077B5] border border-[#0077B5]/30 rounded-lg hover:bg-[#0077B5]/20 transition-colors"
              title="分享到 LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </motion.button>

            {/* 复制链接 */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyLink}
              className="p-2.5 bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/20 transition-colors relative"
              title="复制链接"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Link2 className="w-5 h-5" />
              )}
            </motion.button>

            {/* 更多分享 */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30 rounded-lg hover:bg-cyber-purple/20 transition-colors"
              title="更多分享方式"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>

      {/* 标签提示 */}
      <div className="mt-6 text-center text-xs text-cyber-muted">
        <p>感谢阅读！如果这篇文章对你有帮助，请分享给更多人。</p>
      </div>
    </motion.footer>
  );
}

/**
 * ArticleFooterMinimal - 简化版文章底部
 */
export function ArticleFooterMinimal({
  prevArticle,
  nextArticle,
}: Pick<ArticleFooterProps, 'prevArticle' | 'nextArticle'>) {
  return (
    <nav className="flex items-center justify-between mt-12 pt-8 border-t border-cyber-cyan/20">
      {prevArticle ? (
        <Link
          href={`/blog/${prevArticle.slug}`}
          className="flex items-center gap-2 text-cyber-gray hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{prevArticle.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {nextArticle ? (
        <Link
          href={`/blog/${nextArticle.slug}`}
          className="flex items-center gap-2 text-cyber-gray hover:text-cyber-cyan transition-colors"
        >
          <span className="text-sm">{nextArticle.title}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

export default ArticleFooter;
