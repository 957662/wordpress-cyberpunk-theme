'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Bookmark {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  postExcerpt: string;
  featuredImage?: string;
  createdAt: Date;
  category?: string;
  tags?: string[];
}

interface BookmarkButtonProps {
  postId: string;
  postTitle: string;
  postSlug: string;
  postExcerpt?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  className?: string;
  variant?: 'icon' | 'text' | 'both';
  showCount?: boolean;
  initialBookmarked?: boolean;
  onToggle?: (isBookmarked: boolean) => void;
}

export function BookmarkButton({
  postId,
  postTitle,
  postSlug,
  postExcerpt = '',
  featuredImage,
  category,
  tags = [],
  className,
  variant = 'icon',
  showCount = false,
  initialBookmarked = false,
  onToggle,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load bookmark status from localStorage
  useEffect(() => {
    const bookmarks = loadBookmarks();
    const bookmarked = bookmarks.some((b) => b.postId === postId);
    setIsBookmarked(bookmarked);
    setBookmarkCount(bookmarks.length);
  }, [postId]);

  const loadBookmarks = (): Bookmark[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('cyberpress_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  };

  const saveBookmarks = (bookmarks: Bookmark[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cyberpress_bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const handleToggle = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    const bookmarks = loadBookmarks();
    const existingIndex = bookmarks.findIndex((b) => b.postId === postId);

    let newBookmarks: Bookmark[];
    let newIsBookmarked: boolean;

    if (existingIndex > -1) {
      // Remove bookmark
      newBookmarks = bookmarks.filter((b) => b.postId !== postId);
      newIsBookmarked = false;
    } else {
      // Add bookmark
      const newBookmark: Bookmark = {
        id: `bookmark-${Date.now()}`,
        postId,
        postTitle,
        postSlug,
        postExcerpt,
        featuredImage,
        createdAt: new Date(),
        category,
        tags,
      };
      newBookmarks = [...bookmarks, newBookmark];
      newIsBookmarked = true;
    }

    saveBookmarks(newBookmarks);
    setIsBookmarked(newIsBookmarked);
    setBookmarkCount(newBookmarks.length);
    setIsLoading(false);

    onToggle?.(newIsBookmarked);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all',
        'border hover:shadow-lg hover:shadow-cyber-cyan/20',
        isBookmarked
          ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 hover:bg-pink-500/30'
          : 'bg-cyber-dark/50 border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      
      {(variant === 'text' || variant === 'both') && (
        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
      )}
      
      {showCount && bookmarkCount > 0 && (
        <span className="text-xs opacity-70">({bookmarkCount})</span>
      )}
      
      {isLoading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
        />
      )}
    </motion.button>
  );
}

// Hook to manage bookmarks
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const loadBookmarks = () => {
      if (typeof window === 'undefined') return [];
      try {
        const stored = localStorage.getItem('cyberpress_bookmarks');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        return [];
      }
    };

    setBookmarks(loadBookmarks());

    // Listen for storage changes
    const handleStorageChange = () => {
      setBookmarks(loadBookmarks());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `bookmark-${Date.now()}`,
      createdAt: new Date(),
    };
    
    const newBookmarks = [...bookmarks, newBookmark];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyberpress_bookmarks', JSON.stringify(newBookmarks));
    }
    
    setBookmarks(newBookmarks);
    return newBookmark;
  };

  const removeBookmark = (postId: string) => {
    const newBookmarks = bookmarks.filter((b) => b.postId !== postId);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyberpress_bookmarks', JSON.stringify(newBookmarks));
    }
    
    setBookmarks(newBookmarks);
  };

  const isBookmarked = (postId: string) => {
    return bookmarks.some((b) => b.postId === postId);
  };

  const clearAllBookmarks = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cyberpress_bookmarks');
    }
    setBookmarks([]);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
    count: bookmarks.length,
  };
}

export default BookmarkButton;
