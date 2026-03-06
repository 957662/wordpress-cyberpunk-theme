'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, FolderOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  itemId: string;
  itemType: 'post' | 'comment';
  isInitiallyBookmarked?: boolean;
  initialFolders?: string[];
  onBookmark?: (itemId: string, itemType: string, folder?: string) => Promise<void>;
  onUnbookmark?: (itemId: string, itemType: string) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showFolders?: boolean;
  folders?: string[];
  onCreateFolder?: (name: string) => Promise<void>;
  className?: string;
  disabled?: boolean;
}

export function BookmarkButton({
  itemId,
  itemType,
  isInitiallyBookmarked = false,
  initialFolders = [],
  onBookmark,
  onUnbookmark,
  size = 'md',
  variant = 'ghost',
  showFolders = false,
  folders = ['未分类', '稍后阅读', '收藏'],
  onCreateFolder,
  className,
  disabled = false,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);
  const [itemFolders, setItemFolders] = useState<string[]>(initialFolders);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = async () => {
    if (disabled || isPending) return;

    const newIsBookmarked = !isBookmarked;

    // Optimistic update
    setIsBookmarked(newIsBookmarked);

    try {
      if (newIsBookmarked) {
        if (onBookmark) {
          await onBookmark(itemId, itemType);
        }
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        if (onUnbookmark) {
          await onUnbookmark(itemId, itemType);
        }
        setItemFolders([]);
      }
    } catch (error) {
      // Revert on error
      setIsBookmarked(!newIsBookmarked);
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleFolderSelect = async (folder: string) => {
    if (disabled || isPending) return;

    // Optimistic update
    if (!itemFolders.includes(folder)) {
      setItemFolders([...itemFolders, folder]);
    }

    try {
      if (onBookmark) {
        await onBookmark(itemId, itemType, folder);
      }
      if (!isBookmarked) {
        setIsBookmarked(true);
      }
    } catch (error) {
      // Revert on error
      setItemFolders(itemFolders.filter(f => f !== folder));
      console.error('Failed to add to folder:', error);
    }
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3',
    lg: 'h-12 px-4 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const buttonContent = (
    <>
      {isPending ? (
        <Loader2 className={`w-${iconSizes[size]} h-${iconSizes[size]} animate-spin`} />
      ) : (
        <AnimatePresence mode="wait">
          {isBookmarked ? (
            showSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <BookmarkCheck
                  className="fill-current"
                  style={{ width: iconSizes[size], height: iconSizes[size] }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="bookmarked"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <BookmarkCheck
                  className="fill-current"
                  style={{ width: iconSizes[size], height: iconSizes[size] }}
                />
              </motion.div>
            )
          ) : (
            <motion.div
              key="not-bookmarked"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Bookmark style={{ width: iconSizes[size], height: iconSizes[size] }} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {showFolders && itemFolders.length > 0 && (
        <span className="text-xs bg-cyber-purple/20 text-cyber-purple px-2 py-0.5 rounded">
          {itemFolders.length}
        </span>
      )}
    </>
  );

  const button = (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        disabled={disabled || isPending}
        className={cn(
          'gap-2 transition-all duration-200',
          isBookmarked && 'text-cyber-purple hover:text-cyber-purple/80 hover:bg-cyber-purple/10',
          !isBookmarked && 'text-gray-400 hover:text-cyber-purple hover:bg-cyber-purple/5',
          sizeClasses[size],
          (disabled || isPending) && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {buttonContent}
      </Button>
    </motion.div>
  );

  if (showFolders) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {button}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-cyber-dark/95 backdrop-blur-sm border-cyber-cyan/20"
        >
          <DropdownMenuItem onClick={handleToggle} className="cursor-pointer">
            {isBookmarked ? '取消收藏' : '收藏'}
          </DropdownMenuItem>
          {folders.map(folder => (
            <DropdownMenuItem
              key={folder}
              onClick={() => handleFolderSelect(folder)}
              className={cn(
                'cursor-pointer',
                itemFolders.includes(folder) && 'bg-cyber-purple/10'
              )}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              {folder}
              {itemFolders.includes(folder) && (
                <BookmarkCheck className="w-4 h-4 ml-auto fill-current" />
              )}
            </DropdownMenuItem>
          ))}
          {onCreateFolder && (
            <DropdownMenuItem
              onClick={() => {
                const name = prompt('输入收藏夹名称:');
                if (name) onCreateFolder(name);
              }}
              className="cursor-pointer text-cyber-cyan"
            >
              + 新建收藏夹
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div onClick={handleToggle}>
      {button}
    </div>
  );
}

// Quick bookmark button (minimal version)
export function QuickBookmarkButton({
  isBookmarked,
  count,
  onToggle,
  disabled = false,
  className,
}: {
  isBookmarked: boolean;
  count?: number;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all',
        isBookmarked
          ? 'text-cyber-purple bg-cyber-purple/10'
          : 'text-gray-400 hover:text-cyber-purple hover:bg-cyber-purple/5',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          scale: isBookmarked ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </motion.svg>
      {count !== undefined && <span className="text-sm font-medium">{count}</span>}
    </motion.button>
  );
}

// Bookmark list item
export function BookmarkListItem({
  item,
  onRemove,
  onMove,
  folders,
}: {
  item: {
    id: string;
    title: string;
    excerpt?: string;
    thumbnail?: string;
    folder?: string;
    createdAt: string;
  };
  onRemove: (id: string) => void;
  onMove: (id: string, folder: string) => void;
  folders: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/40 transition-colors"
    >
      <div className="flex gap-4">
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-20 h-20 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white mb-1">{item.title}</h4>
          {item.excerpt && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-2">{item.excerpt}</p>
          )}
          <div className="flex items-center gap-2">
            {item.folder && (
              <span className="px-2 py-0.5 text-xs bg-cyber-purple/20 text-cyber-purple rounded">
                {item.folder}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FolderOpen className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-cyber-dark/95 backdrop-blur-sm border-cyber-cyan/20"
            >
              {folders.map(folder => (
                <DropdownMenuItem
                  key={folder}
                  onClick={() => onMove(item.id, folder)}
                  className={cn(
                    'cursor-pointer',
                    item.folder === folder && 'bg-cyber-purple/10'
                  )}
                >
                  {folder}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="h-8 w-8 p-0 text-cyber-pink hover:text-cyber-pink/80"
          >
            ✕
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default BookmarkButton;
