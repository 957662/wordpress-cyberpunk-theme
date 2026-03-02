'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookmarkButtonProps {
  /**
   * 文章 ID 或唯一标识符
   */
  postId: string;

  /**
   * 文章标题（用于保存到收藏）
   */
  title: string;

  /**
   * 文章 URL
   */
  url?: string;

  /**
   * 文章缩略图
   */
  thumbnail?: string;

  /**
   * 文章摘要
   */
  excerpt?: string;

  /**
   * 按钮样式
   * @default 'default'
   */
  variant?: 'default' | 'minimal' | 'pill';

  /**
   * 按钮大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 是否显示计数
   * @default true
   */
  showCount?: boolean;

  /**
   * 存储键名（用于 localStorage）
   * @default 'cyberpress-bookmarks'
   */
  storageKey?: string;

  /**
   * 自定义样式类名
   */
  className?: string;

  /**
   * 收藏状态变化回调
   */
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

interface BookmarkData {
  postId: string;
  title: string;
  url: string;
  thumbnail?: string;
  excerpt?: string;
  timestamp: number;
}

/**
 * 收藏按钮组件
 *
 * 允许用户收藏文章到本地存储，支持自定义回调。
 * 包含收藏动画和计数显示。
 *
 * @example
 * ```tsx
 * <BookmarkButton postId="123" title="文章标题" url="/post/123" />
 * <BookmarkButton variant="pill" size="large" showCount={false} />
 * ```
 */
export function BookmarkButton({
  postId,
  title,
  url: propUrl,
  thumbnail,
  excerpt,
  variant = 'default',
  size = 'medium',
  showCount = true,
  storageKey = 'cyberpress-bookmarks',
  className = '',
  onBookmarkChange,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // 获取当前页面 URL
  const url = propUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // 加载收藏状态
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const bookmarks: BookmarkData[] = JSON.parse(saved);
        const bookmarked = bookmarks.some((b) => b.postId === postId);
        setIsBookmarked(bookmarked);
        setBookmarkCount(bookmarks.length);
      }
    } catch (error) {
      console.warn('Failed to load bookmarks from localStorage:', error);
    }
  }, [storageKey, postId]);

  // 切换收藏状态
  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      let bookmarks: BookmarkData[] = saved ? JSON.parse(saved) : [];

      const existingIndex = bookmarks.findIndex((b) => b.postId === postId);

      if (existingIndex >= 0) {
        // 取消收藏
        bookmarks = bookmarks.filter((b) => b.postId !== postId);
        setIsBookmarked(false);
        toast.success('已取消收藏');
      } else {
        // 添加收藏
        const newBookmark: BookmarkData = {
          postId,
          title,
          url,
          thumbnail,
          excerpt,
          timestamp: Date.now(),
        };
        bookmarks.unshift(newBookmark); // 添加到开头
        setIsBookmarked(true);
        toast.success('已添加到收藏');
      }

      localStorage.setItem(storageKey, JSON.stringify(bookmarks));
      setBookmarkCount(bookmarks.length);

      // 触发回调
      onBookmarkChange?.(!isBookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      toast.error('操作失败，请重试');
    }
  };

  // 尺寸配置
  const sizeClasses = {
    small: 'p-2',
    medium: 'p-2.5',
    large: 'p-3',
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  // 变体样式
  const getVariantClasses = () => {
    const baseClasses = 'flex items-center gap-2 rounded-lg transition-all duration-200';

    if (variant === 'minimal') {
      return `${baseClasses} ${isBookmarked ? 'text-cyber-pink' : 'text-gray-400'} hover:text-cyber-pink`;
    }

    if (variant === 'pill') {
      return `${baseClasses} px-4 py-2 ${sizeClasses[size]} ${
        isBookmarked
          ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink'
          : 'bg-cyber-dark/80 border-gray-800 text-gray-400 hover:border-cyber-pink/50'
      } border`;
    }

    // default
    return `${baseClasses} ${sizeClasses[size]} bg-cyber-dark/80 backdrop-blur-sm border ${
      isBookmarked ? 'border-cyber-pink shadow-lg shadow-cyber-pink/20' : 'border-gray-800'
    } hover:border-cyber-pink hover:bg-cyber-pink/10`;
  };

  return (
    <motion.button
      onClick={toggleBookmark}
      className={getVariantClasses() + ' ' + className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isBookmarked ? '取消收藏' : '添加到收藏'}
      aria-pressed={isBookmarked}
    >
      {isBookmarked ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <BookmarkCheck
            className="text-cyber-pink"
            size={iconSizes[size]}
            fill="currentColor"
          />
        </motion.div>
      ) : (
        <Bookmark className="text-gray-400" size={iconSizes[size]} />
      )}

      {showCount && variant !== 'minimal' && (
        <span className="text-sm font-medium">
          {isBookmarked ? '已收藏' : '收藏'}
        </span>
      )}

      {showCount && variant === 'pill' && bookmarkCount > 0 && (
        <span className="ml-auto text-xs bg-cyber-muted px-2 py-0.5 rounded-full">
          {bookmarkCount}
        </span>
      )}
    </motion.button>
  );
}

/**
 * 收藏列表组件
 */
interface BookmarkListProps {
  /**
   * 存储键名
   * @default 'cyberpress-bookmarks'
   */
  storageKey?: string;

  /**
   * 空状态提示
   */
  emptyMessage?: string;

  /**
   * 自定义样式类名
   */
  className?: string;

  /**
   * 删除回调
   */
  onRemove?: (postId: string) => void;
}

export function BookmarkList({
  storageKey = 'cyberpress-bookmarks',
  emptyMessage = '还没有收藏任何文章',
  className = '',
  onRemove,
}: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);

  // 加载收藏列表
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const data: BookmarkData[] = JSON.parse(saved);
          setBookmarks(data);
        }
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      }
    };

    loadBookmarks();

    // 监听存储变化
    const handleStorageChange = () => {
      loadBookmarks();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  // 删除收藏
  const removeBookmark = (postId: string) => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        let bookmarks: BookmarkData[] = JSON.parse(saved);
        bookmarks = bookmarks.filter((b) => b.postId !== postId);
        localStorage.setItem(storageKey, JSON.stringify(bookmarks));
        setBookmarks(bookmarks);
        toast.success('已删除收藏');
        onRemove?.(postId);
      }
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      toast.error('删除失败');
    }
  };

  // 清空所有收藏
  const clearAll = () => {
    try {
      localStorage.removeItem(storageKey);
      setBookmarks([]);
      toast.success('已清空所有收藏');
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
      toast.error('清空失败');
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Bookmark className="mx-auto w-16 h-16 text-gray-700 mb-4" />
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyber-cyan">我的收藏</h3>
        <button
          onClick={clearAll}
          className="text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          清空全部
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <motion.div
            key={bookmark.postId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg p-4 hover:border-cyber-cyan/40 transition-colors"
          >
            <div className="flex gap-4">
              {bookmark.thumbnail && (
                <img
                  src={bookmark.thumbnail}
                  alt={bookmark.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <a
                  href={bookmark.url}
                  className="text-cyber-cyan font-semibold hover:text-cyber-cyan/80 transition-colors line-clamp-2"
                >
                  {bookmark.title}
                </a>

                {bookmark.excerpt && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {bookmark.excerpt}
                  </p>
                )}

                <p className="text-gray-600 text-xs mt-2">
                  收藏于 {new Date(bookmark.timestamp).toLocaleDateString('zh-CN')}
                </p>
              </div>

              <button
                onClick={() => removeBookmark(bookmark.postId)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="删除收藏"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
