'use client';

/**
 * SocialActions - 社交互动组件
 * 支持点赞、收藏、分享、关注等社交功能
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Bookmark,
  Share2,
  Eye,
  MessageCircle,
  Check,
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { cn } from '@/lib/utils';

interface SocialActionsProps {
  postId: string;
  initialLikes?: number;
  initialBookmarks?: number;
  initialViews?: number;
  initialComments?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  className?: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

export function SocialActions({
  postId,
  initialLikes = 0,
  initialBookmarks = 0,
  initialViews = 0,
  initialComments = 0,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  className,
  onLike,
  onBookmark,
  onShare,
}: SocialActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // 处理点赞
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.();
  };

  // 处理收藏
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarks(prev => isBookmarked ? prev - 1 : prev + 1);
    onBookmark?.();
  };

  // 处理分享
  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = document.title;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          // Show toast notification
          alert('链接已复制到剪贴板');
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        return;
      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title,
              url,
            });
          } catch (err) {
            console.error('Failed to share:', err);
          }
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    setShowShareMenu(false);
    onShare?.();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Like Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
            'hover:shadow-lg hover:shadow-cyber-cyan/20',
            isLiked
              ? 'bg-cyber-pink/10 border-cyber-pink text-cyber-pink'
              : 'bg-cyber-dark border-cyber-border text-gray-400 hover:border-cyber-pink hover:text-cyber-pink'
          )}
        >
          <Heart className={cn('w-5 h-5', isLiked && 'fill-current animate-pulse')} />
          <span className="font-medium">{likes}</span>
        </motion.button>

        {/* Bookmark Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBookmark}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
            'hover:shadow-lg hover:shadow-cyber-purple/20',
            isBookmarked
              ? 'bg-cyber-purple/10 border-cyber-purple text-cyber-purple'
              : 'bg-cyber-dark border-cyber-border text-gray-400 hover:border-cyber-purple hover:text-cyber-purple'
          )}
        >
          <Bookmark className={cn('w-5 h-5', isBookmarked && 'fill-current')} />
          <span className="font-medium">{bookmarks}</span>
        </motion.button>

        {/* Comment Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-border bg-cyber-dark text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all hover:shadow-lg hover:shadow-cyber-cyan/20"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{initialComments}</span>
        </motion.button>

        {/* View Count */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-border bg-cyber-dark text-gray-400">
          <Eye className="w-5 h-5" />
          <span className="font-medium">{initialViews}</span>
        </div>
      </div>

      {/* Share Section */}
      <div className="relative">
        <CyberButton
          onClick={() => setShowShareMenu(!showShareMenu)}
          variant="outline"
          className="w-full sm:w-auto"
          icon={<Share2 className="w-4 h-4" />}
        >
          分享文章
        </CyberButton>

        {/* Share Menu */}
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 mt-2 z-10 cyber-card border border-cyber-border rounded-lg p-2 space-y-1 min-w-[200px]"
          >
            <button
              onClick={() => handleShare('twitter')}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors"
            >
              <span className="text-blue-400">𝕏</span>
              <span>Twitter</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors"
            >
              <span className="text-blue-600">f</span>
              <span>Facebook</span>
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors"
            >
              <span className="text-blue-500">in</span>
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>复制链接</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SocialActions;
