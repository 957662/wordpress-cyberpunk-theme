'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface SocialActionsProps {
  postId: string;
  initialLikes?: number;
  initialIsLiked?: boolean;
  initialBookmarks?: number;
  initialIsBookmarked?: boolean;
  className?: string;
  onComment?: () => void;
}

export function SocialActions({
  postId,
  initialLikes = 0,
  initialIsLiked = false,
  initialBookmarks = 0,
  initialIsBookmarked = false,
  className,
  onComment,
}: SocialActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const { toast } = useToast();

  // Sync with localStorage
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');

    setIsLiked(likedPosts.includes(postId));
    setIsBookmarked(bookmarkedPosts.includes(postId));
  }, [postId]);

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;

      // Optimistic update
      setIsLiked(newIsLiked);
      setLikes((prev) => prev + (newIsLiked ? 1 : -1));

      // Update localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (newIsLiked) {
        localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, postId]));
      } else {
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts.filter((id: string) => id !== postId)));
      }

      // API call
      // await api.post(`/api/posts/${postId}/like`, { action: newIsLiked ? 'like' : 'unlike' });

      toast({
        title: newIsLiked ? 'Liked!' : 'Unliked',
        description: newIsLiked ? 'You liked this post' : 'You unliked this post',
      });
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikes((prev) => prev + (isLiked ? 1 : -1));

      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      });
    }
  };

  const handleBookmark = async () => {
    try {
      const newIsBookmarked = !isBookmarked;

      // Optimistic update
      setIsBookmarked(newIsBookmarked);
      setBookmarks((prev) => prev + (newIsBookmarked ? 1 : -1));

      // Update localStorage
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      if (newIsBookmarked) {
        localStorage.setItem('bookmarkedPosts', JSON.stringify([...bookmarkedPosts, postId]));
      } else {
        localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts.filter((id: string) => id !== postId)));
      }

      // API call
      // await api.post(`/api/posts/${postId}/bookmark`, { action: newIsBookmarked ? 'bookmark' : 'unbookmark' });

      toast({
        title: newIsBookmarked ? 'Saved!' : 'Removed',
        description: newIsBookmarked ? 'Post saved to bookmarks' : 'Post removed from bookmarks',
      });
    } catch (error) {
      // Revert on error
      setIsBookmarked(!isBookmarked);
      setBookmarks((prev) => prev + (isBookmarked ? 1 : -1));

      toast({
        title: 'Error',
        description: 'Failed to update bookmark status',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Post link copied to clipboard',
      });
    }
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Like Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
          isLiked
            ? 'bg-pink-500/20 border-pink-500/50 text-pink-500'
            : 'bg-cyber-dark/60 border-cyber-cyan/30 text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
        )}
      >
        <Heart
          size={20}
          className={cn(isLiked && 'fill-current')}
        />
        <span className="font-semibold">{likes}</span>
      </motion.button>

      {/* Comment Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onComment}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-cyber-dark/60 border-cyber-cyan/30 text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
      >
        <MessageCircle size={20} />
        <span className="font-semibold">Comment</span>
      </motion.button>

      {/* Bookmark Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleBookmark}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
          isBookmarked
            ? 'bg-cyber-cyan/20 border-cyber-cyan/50 text-cyber-cyan'
            : 'bg-cyber-dark/60 border-cyber-cyan/30 text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
        )}
      >
        <Bookmark
          size={20}
          className={cn(isBookmarked && 'fill-current')}
        />
        <span className="font-semibold">{bookmarks}</span>
      </motion.button>

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-cyber-dark/60 border-cyber-cyan/30 text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
      >
        <Share2 size={20} />
        <span className="font-semibold">Share</span>
      </motion.button>
    </div>
  );
}

// Floating action bar for mobile
export function FloatingActionBar({
  postId,
  likes = 0,
  isLiked = false,
  bookmarks = 0,
  isBookmarked = false,
  onComment,
}: SocialActionsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cyber-dark/95 backdrop-blur-sm border-t border-cyber-cyan/30 p-4"
    >
      <SocialActions
        postId={postId}
        initialLikes={likes}
        initialIsLiked={isLiked}
        initialBookmarks={bookmarks}
        initialIsBookmarked={isBookmarked}
        onComment={onComment}
        className="justify-center"
      />
    </motion.div>
  );
}

// Social share popover
interface SharePopoverProps {
  url?: string;
  title?: string;
  onOpenChange?: (open: boolean) => void;
}

export function SharePopover({ url, title, onOpenChange }: SharePopoverProps) {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const shareLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      icon: '𝕏',
      color: 'hover:text-blue-400',
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: 'f',
      color: 'hover:text-blue-600',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: 'in',
      color: 'hover:text-blue-700',
    },
    {
      name: 'Copy Link',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        onOpenChange?.(false);
      },
      icon: '🔗',
      color: 'hover:text-cyber-cyan',
    },
  ];

  return (
    <div className="p-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 px-2">Share this post</h3>
      <div className="space-y-1">
        {shareLinks.map((link) => (
          <motion.button
            key={link.name}
            whileHover={{ x: 4 }}
            onClick={link.action || (() => window.open(link.url, '_blank'))}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
              'text-gray-300 hover:bg-cyber-cyan/10 transition-colors',
              link.color
            )}
          >
            <span className="text-lg font-bold">{link.icon}</span>
            <span>{link.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
