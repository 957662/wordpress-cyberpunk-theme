'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface BookmarksButtonProps {
  postId: string;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  className?: string;
  onToggle?: (isBookmarked: boolean) => void;
}

const colorSchemes = {
  cyan: {
    primary: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  purple: {
    primary: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  pink: {
    primary: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
  },
  green: {
    primary: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  orange: {
    primary: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  blue: {
    primary: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
};

export const BookmarksButton: React.FC<BookmarksButtonProps> = ({
  postId,
  colorScheme = 'cyan',
  className = '',
  onToggle,
}) => {
  const colors = colorSchemes[colorScheme];
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 从 LocalStorage 加载书签状态
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(postId));
  }, [postId]);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      let newBookmarks;

      if (isBookmarked) {
        newBookmarks = bookmarks.filter((id: string) => id !== postId);
      } else {
        newBookmarks = [...bookmarks, postId];
      }

      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(!isBookmarked);
      onToggle?.(!isBookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        isBookmarked
          ? `${colors.bg} ${colors.primary} ${colors.border}`
          : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600'
      } ${className}`}
      title={isBookmarked ? '取消收藏' : '添加收藏'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
      <span className="text-sm">
        {isBookmarked ? '已收藏' : '收藏'}
      </span>
    </motion.button>
  );
};

export default BookmarksButton;
