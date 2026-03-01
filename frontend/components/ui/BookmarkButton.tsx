'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, FolderOpen, Trash2, Plus } from 'lucide-react';

export interface BookmarkButtonProps {
  /** 书签ID */
  id?: string;
  /** 书签标题 */
  title: string;
  /** 书签URL */
  url?: string;
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 自定义类名 */
  className?: string;
  /** 书签状态变化回调 */
  onBookmarkChange?: (bookmarked: boolean) => void;
  /** 存储键名 */
  storageKey?: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  id,
  title,
  url: propUrl,
  size = 'md',
  variant = 'primary',
  className = '',
  onBookmarkChange,
  storageKey = 'cyberpress-bookmarks',
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const url = propUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const bookmarkId = id || url;

  // 从 localStorage 加载书签
  useEffect(() => {
    loadBookmarks();
  }, [storageKey]);

  // 检查当前是否已收藏
  useEffect(() => {
    const bookmarked = bookmarks.some(b => b.id === bookmarkId);
    setIsBookmarked(bookmarked);
  }, [bookmarks, bookmarkId]);

  const loadBookmarks = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(storageKey);
      const items = stored ? JSON.parse(stored) : [];
      setBookmarks(items);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const saveBookmarks = (items: BookmarkItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
      setBookmarks(items);
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  const toggleBookmark = () => {
    const existingIndex = bookmarks.findIndex(b => b.id === bookmarkId);
    let newBookmarks: BookmarkItem[];

    if (existingIndex >= 0) {
      // 取消收藏
      newBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    } else {
      // 添加收藏
      const newBookmark: BookmarkItem = {
        id: bookmarkId,
        title,
        url,
        createdAt: Date.now(),
      };
      newBookmarks = [...bookmarks, newBookmark];
    }

    saveBookmarks(newBookmarks);
    onBookmarkChange?.(existingIndex < 0);
  };

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter(b => b.id !== id);
    saveBookmarks(newBookmarks);
  };

  const variantStyles = {
    primary: isBookmarked
      ? 'bg-cyber-pink text-white hover:bg-cyber-purple'
      : 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-purple hover:text-white',
    secondary: isBookmarked
      ? 'bg-cyber-pink text-white'
      : 'bg-cyber-purple text-white hover:bg-cyber-pink',
    ghost: isBookmarked
      ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink'
      : 'bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark',
  };

  return (
    <div className="relative">
      {/* 书签按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleBookmark}
        className={`
          flex items-center gap-2 rounded-lg font-medium
          transition-all duration-300
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
      >
        {isBookmarked ? (
          <BookmarkCheck size={iconSizes[size]} className="fill-current" />
        ) : (
          <Bookmark size={iconSizes[size]} />
        )}
        <span>{isBookmarked ? '已收藏' : '收藏'}</span>
      </motion.button>

      {/* 书签管理器按钮（仅在有书签时显示） */}
      {bookmarks.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowManager(!showManager)}
          className="ml-2 p-2 rounded-lg border border-cyber-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
          aria-label="Manage bookmarks"
        >
          <FolderOpen size={iconSizes[size]} />
        </motion.button>
      )}

      {/* 书签管理器面板 */}
      <AnimatePresence>
        {showManager && (
          <>
            {/* 遮罩层 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowManager(false)}
            />

            {/* 管理器面板 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-50 w-80 max-h-96 overflow-hidden"
            >
              <div className="bg-cyber-card border border-cyber-border rounded-lg shadow-xl">
                {/* 标题栏 */}
                <div className="px-4 py-3 border-b border-cyber-border flex items-center justify-between">
                  <h3 className="font-semibold text-cyber-cyan">我的收藏</h3>
                  <span className="text-sm text-gray-400">{bookmarks.length} 项</span>
                </div>

                {/* 书签列表 */}
                <div className="max-h-64 overflow-y-auto">
                  {bookmarks.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400">
                      <Bookmark size={32} className="mx-auto mb-2 opacity-50" />
                      <p>暂无收藏</p>
                    </div>
                  ) : (
                    bookmarks.map((bookmark) => (
                      <motion.div
                        key={bookmark.id}
                        layout
                        className="group flex items-start gap-3 px-4 py-3 hover:bg-cyber-muted/30 transition-colors border-b border-cyber-border/50 last:border-b-0"
                      >
                        <a
                          href={bookmark.url}
                          className="flex-1 min-w-0"
                          onClick={() => setShowManager(false)}
                        >
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {bookmark.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {bookmark.url}
                          </p>
                        </a>
                        <button
                          onClick={() => removeBookmark(bookmark.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-cyber-pink transition-all"
                          aria-label="Remove bookmark"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* 底部操作栏 */}
                <div className="px-4 py-3 border-t border-cyber-border">
                  <button
                    onClick={() => {
                      const all = [...bookmarks];
                      saveBookmarks([]);
                      setShowManager(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    清空所有收藏
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/** 书签列表组件 */
export const BookmarkList: React.FC<{
  /** 存储键名 */
  storageKey?: string;
  /** 空状态提示 */
  emptyMessage?: string;
  /** 自定义类名 */
  className?: string;
}> = ({
  storageKey = 'cyberpress-bookmarks',
  emptyMessage = '暂无收藏',
  className = '',
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, [storageKey]);

  const loadBookmarks = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(storageKey);
      const items = stored ? JSON.parse(stored) : [];
      setBookmarks(items);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter(b => b.id !== id);
    setBookmarks(newBookmarks);
    localStorage.setItem(storageKey, JSON.stringify(newBookmarks));
  };

  return (
    <div className={className}>
      {bookmarks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Bookmark size={48} className="mx-auto mb-4 opacity-30" />
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="group flex items-start gap-3 p-4 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan/50 transition-all"
            >
              <a
                href={bookmark.url}
                className="flex-1 min-w-0"
              >
                <p className="font-medium text-gray-200 truncate">
                  {bookmark.title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {bookmark.url}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </p>
              </a>
              <button
                onClick={() => removeBookmark(bookmark.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-cyber-pink hover:bg-cyber-pink/10 rounded-lg transition-all"
                aria-label="Remove bookmark"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkButton;
