'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Loader2, FolderPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  itemId: string;
  itemType: 'article' | 'comment';
  initialBookmarked?: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showFolderSelect?: boolean;
  className?: string;
}

interface Folder {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

export function BookmarkButton({
  itemId,
  itemType,
  initialBookmarked = false,
  onBookmarkChange,
  size = 'md',
  variant = 'ghost',
  showFolderSelect = false,
  className,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [showFolders, setShowFolders] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'default', name: '默认收藏夹', count: 0 },
    { id: 'read-later', name: '稍后阅读', count: 0 },
    { id: 'favorites', name: '最爱', count: 0 },
  ]);
  const [selectedFolder, setSelectedFolder] = useState<string>('default');

  const handleBookmark = async (folderId?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${itemType}s/${itemId}/bookmark`, {
        method: bookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: folderId ? JSON.stringify({ folderId }) : undefined,
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark status');
      }

      const newBookmarkedStatus = !bookmarked;
      setBookmarked(newBookmarkedStatus);
      setShowFolders(false);
      onBookmarkChange?.(newBookmarkedStatus);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeStyles = {
    sm: { button: 'p-1.5', icon: 16 },
    md: { button: 'p-2', icon: 18 },
    lg: { button: 'p-3', icon: 20 },
  };

  const currentSize = sizeStyles[size];

  const variantStyles = {
    default: cn(
      'rounded-lg',
      bookmarked
        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
    ),
    outline: cn(
      'rounded-lg border-2',
      bookmarked
        ? 'border-amber-500 text-amber-500'
        : 'border-gray-600 text-gray-400 hover:border-amber-500 hover:text-amber-500'
    ),
    ghost: cn(
      'rounded-lg',
      bookmarked
        ? 'text-amber-500 hover:bg-amber-500/10'
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    ),
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => {
          if (showFolderSelect && !bookmarked) {
            setShowFolders(!showFolders);
          } else {
            handleBookmark();
          }
        }}
        disabled={isLoading || isPending}
        className={cn(
          'inline-flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          currentSize.button,
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {isLoading || isPending ? (
          <Loader2 className={cn('animate-spin', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
        ) : (
          <motion.div
            animate={bookmarked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {bookmarked ? (
              <BookmarkCheck size={currentSize.icon} className="fill-current" />
            ) : (
              <Bookmark size={currentSize.icon} />
            )}
          </motion.div>
        )}

        {size !== 'sm' && (
          <span className="text-sm font-medium">
            {bookmarked ? '已收藏' : showFolderSelect ? '收藏到...' : '收藏'}
          </span>
        )}

        {/* 赛博朋克发光效果 */}
        {bookmarked && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.button>

      {/* 文件夹选择器 */}
      {showFolders && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFolders(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                选择收藏夹
              </div>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleBookmark(folder.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                    selectedFolder === folder.id
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  )}
                >
                  <FolderPlus size={16} />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{folder.name}</div>
                    <div className="text-xs text-gray-500">{folder.count} 项</div>
                  </div>
                </button>
              ))}
            </div>

            {/* 新建收藏夹 */}
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-cyan-500 hover:bg-cyan-500/10 border-t border-gray-700 mt-1"
            >
              <FolderPlus size={16} />
              <span className="text-sm font-medium">新建收藏夹</span>
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}

BookmarkButton.sizes = ['sm', 'md', 'lg'] as const;
BookmarkButton.variants = ['default', 'outline', 'ghost'] as const;
