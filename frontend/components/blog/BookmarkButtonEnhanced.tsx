'use client';

/**
 * 增强版收藏按钮组件
 * 集成新的收藏API和Hook
 */

import { useBookmark } from '@/lib/hooks/useBookmark';
import { BookmarkTargetType } from '@/types/bookmark.types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, BookmarkPlus } from 'lucide-react';
import { useState } from 'react';

export interface BookmarkButtonEnhancedProps {
  targetType?: BookmarkTargetType;
  targetId: string | number;
  initialBookmarked?: boolean;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
  onBookmarkChange?: (bookmarked: boolean) => void;
  allowNotes?: boolean; // 是否允许添加备注
}

export function BookmarkButtonEnhanced({
  targetType = BookmarkTargetType.POST,
  targetId,
  initialBookmarked = false,
  showCount = false,
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
  onBookmarkChange,
  allowNotes = true,
}: BookmarkButtonEnhancedProps) {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  const { isBookmarked, isMutating, toggle } = useBookmark({
    targetType,
    targetId: String(targetId),
    initialBookmarked,
    onSuccess: (bookmarked) => {
      onBookmarkChange?.(bookmarked);
      if (bookmarked && allowNotes) {
        setShowNotesModal(true);
      }
    },
  });

  const handleToggle = async () => {
    if (!isBookmarked && allowNotes) {
      // 如果是收藏操作且允许添加备注，显示备注输入框
      setShowNotesModal(true);
    } else {
      // 否则直接切换
      await toggle();
    }
  };

  const handleConfirmBookmark = async () => {
    await toggle(notes || undefined);
    setShowNotesModal(false);
    setNotes('');
  };

  // 尺寸样式
  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // 变体样式
  const variantStyles = {
    default: isBookmarked
      ? 'bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow shadow-lg shadow-cyber-yellow/20'
      : 'bg-cyber-dark border-cyber-border text-cyber-muted hover:text-cyber-yellow hover:border-cyber-yellow/50',
    outline: isBookmarked
      ? 'border-cyber-yellow text-cyber-yellow bg-transparent'
      : 'border-cyber-border text-cyber-muted hover:border-cyber-yellow hover:text-cyber-yellow bg-transparent',
    ghost: isBookmarked
      ? 'text-cyber-yellow bg-transparent border-0'
      : 'text-cyber-muted hover:text-cyber-yellow bg-transparent border-0',
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={handleToggle}
        disabled={disabled || isMutating}
        className={cn(
          'relative flex items-center gap-2 rounded-lg border transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        aria-label={isBookmarked ? '取消收藏' : '收藏'}
      >
        {/* 图标 */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {isBookmarked ? (
              <motion.div
                key="bookmarked"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Star
                  className="relative z-10"
                  size={iconSizes[size]}
                  fill="currentColor"
                />
                {/* 发光效果 */}
                <motion.div
                  className="absolute inset-0 blur-lg bg-cyber-yellow"
                  initial={{ scale: 0.5, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="unbookmarked"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <BookmarkPlus size={iconSizes[size]} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 计数 */}
        {showCount && (
          <motion.span
            key={isBookmarked ? 'bookmarked' : 'unbookmarked'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-medium"
          >
            {isBookmarked ? '已收藏' : '收藏'}
          </motion.span>
        )}

        {/* 加载状态 */}
        {isMutating && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full h-full bg-cyber-dark/50 backdrop-blur-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-cyber-yellow border-t-transparent rounded-full animate-spin" />
            </div>
          </motion.div>
        )}
      </motion.button>

      {/* 备注模态框 */}
      <AnimatePresence>
        {showNotesModal && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowNotesModal(false)}
            />

            {/* 模态框 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-cyber-dark border border-cyber-border rounded-lg shadow-xl z-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">添加收藏备注</h3>
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="p-2 rounded-lg hover:bg-cyber-muted/50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-cyber-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="添加备注（可选）"
                  className="w-full h-32 px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-cyber-muted focus:outline-none focus:border-cyber-yellow resize-none"
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="flex-1 px-4 py-2 bg-cyber-muted/20 border border-cyber-border rounded-lg text-cyber-muted hover:bg-cyber-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmBookmark}
                    disabled={isMutating}
                    className="flex-1 px-4 py-2 bg-cyber-yellow text-cyber-dark font-medium rounded-lg hover:bg-cyber-yellow/90 transition-colors disabled:opacity-50"
                  >
                    {isMutating ? '收藏中...' : '确认收藏'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * 收藏列表项组件
 */
export interface BookmarkItemProps {
  bookmarkId: string;
  title: string;
  excerpt?: string;
  notes?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function BookmarkItem({
  bookmarkId,
  title,
  excerpt,
  notes,
  onRemove,
  onEdit,
  className = '',
}: BookmarkItemProps) {
  return (
    <div className={cn('bg-cyber-dark border border-cyber-border rounded-lg p-4 hover:border-cyber-yellow/50 transition-colors', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">{title}</h4>
          {excerpt && (
            <p className="text-sm text-cyber-muted mt-1 line-clamp-2">{excerpt}</p>
          )}
          {notes && (
            <p className="text-sm text-cyber-yellow mt-2 italic">{notes}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-cyber-muted/50 transition-colors"
              title="编辑备注"
            >
              <svg className="w-4 h-4 text-cyber-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2 rounded-lg hover:bg-cyber-pink/20 transition-colors"
              title="取消收藏"
            >
              <svg className="w-4 h-4 text-cyber-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookmarkButtonEnhanced;
