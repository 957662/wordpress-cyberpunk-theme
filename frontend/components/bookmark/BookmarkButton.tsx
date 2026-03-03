'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Loader2, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface BookmarkButtonProps {
  itemId: string;
  itemType: 'post' | 'comment';
  initialBookmarked: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showFolders?: boolean;
}

interface Folder {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

export default function BookmarkButton({
  itemId,
  itemType,
  initialBookmarked,
  onBookmarkChange,
  className,
  variant = 'default',
  size = 'md',
  showFolders = false,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'px-2 py-1 gap-1.5 text-sm',
    md: 'px-3 py-1.5 gap-2 text-base',
    lg: 'px-4 py-2 gap-2.5 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const variantClasses = {
    default: bookmarked
      ? 'bg-amber-500/20 text-amber-500 border-amber-500/50 hover:bg-amber-500/30'
      : 'bg-slate-800/50 text-cyber-text-secondary border-slate-700 hover:text-cyber-text-primary hover:border-slate-600',
    outline: bookmarked
      ? 'border-amber-500 text-amber-500 hover:bg-amber-500/10'
      : 'border-slate-700 text-cyber-text-secondary hover:border-cyber-primary hover:text-cyber-primary',
    ghost: bookmarked
      ? 'text-amber-500 hover:bg-amber-500/10'
      : 'text-cyber-text-secondary hover:bg-slate-800/50 hover:text-cyber-text-primary',
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/bookmarks/folders');
      if (!response.ok) throw new Error('Failed to fetch folders');
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleBookmark = async (folderId?: string) => {
    if (isLoading) return;

    // If showing folder picker and not yet bookmarked
    if (showFolders && !bookmarked && !folderId) {
      await fetchFolders();
      setShowFolderPicker(true);
      return;
    }

    setIsLoading(true);
    const previousState = bookmarked;
    const newState = !bookmarked;

    // 乐观更新
    setBookmarked(newState);

    try {
      const response = await fetch('/api/social/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          item_type: itemType,
          action: newState ? 'bookmark' : 'unbookmark',
          folder_id: folderId || selectedFolder,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark status');
      }

      const data = await response.json();

      startTransition(() => {
        setBookmarked(newState);
        onBookmarkChange?.(newState);
      });

      toast.success(newState ? '已收藏' : '已取消收藏', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#fff',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          borderRadius: '8px',
          padding: '12px 24px',
        },
      });

      setShowFolderPicker(false);
    } catch (error) {
      // 回滚
      setBookmarked(previousState);
      toast.error('操作失败，请稍后重试', {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    handleBookmark(folderId);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => handleBookmark()}
        disabled={isLoading || isPending}
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isLoading || isPending ? (
          <Loader2 className="animate-spin" size={iconSizes[size]} />
        ) : (
          <>
            {bookmarked ? (
              <BookmarkCheck size={iconSizes[size]} />
            ) : (
              <Bookmark size={iconSizes[size]} />
            )}
            <span>{bookmarked ? '已收藏' : '收藏'}</span>
            {showFolders && (
              <FolderOpen size={iconSizes[size]} className="opacity-50" />
            )}
          </>
        )}
      </motion.button>

      {/* Folder Picker Dropdown */}
      {showFolderPicker && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFolderPicker(false)}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 w-64 rounded-lg bg-slate-800 border border-slate-700 shadow-xl"
          >
            <div className="p-3 border-b border-slate-700">
              <h3 className="font-semibold text-cyber-text-primary">选择收藏夹</h3>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {folders.length === 0 ? (
                <div className="py-4 text-center text-cyber-text-secondary text-sm">
                  暂无收藏夹
                </div>
              ) : (
                folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderSelect(folder.id)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50
                             transition-colors duration-200 flex items-center gap-3"
                  >
                    {folder.icon && (
                      <span className="text-xl">{folder.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-cyber-text-primary truncate">
                        {folder.name}
                      </div>
                      <div className="text-xs text-cyber-text-secondary">
                        {folder.count} 项
                      </div>
                    </div>
                  </button>
                ))
              )}
              <button
                onClick={() => {
                  /* TODO: Create new folder */
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50
                         transition-colors duration-200 flex items-center gap-3 text-cyber-primary"
              >
                <Bookmark size={16} />
                <span className="font-medium">新建收藏夹</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
