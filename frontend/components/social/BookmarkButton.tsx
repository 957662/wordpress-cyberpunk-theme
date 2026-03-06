'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  initialBookmarked?: boolean;
  onBookmark?: () => Promise<void>;
  onRemove?: () => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  initialBookmarked = false,
  onBookmark,
  onRemove,
  size = 'md',
  className = '',
}) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (bookmarked) {
        await onRemove?.();
        setBookmarked(false);
      } else {
        await onBookmark?.();
        setBookmarked(true);
      }
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
      className={`${sizeClasses[size]} rounded-lg transition-all ${
        bookmarked
          ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50'
          : 'bg-cyber-dark/50 text-cyber-muted border border-cyber-cyan/30 hover:border-cyber-purple/50 hover:text-cyber-purple'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={bookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
    >
      <motion.div
        animate={bookmarked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Bookmark
          size={iconSizes[size]}
          fill={bookmarked ? 'currentColor' : 'none'}
        />
      </motion.div>
    </motion.button>
  );
};

export default BookmarkButton;
