'use client';

/**
 * 收藏按钮组件
 * 支持收藏、取消收藏、收藏夹管理
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Star as StarFilled, FolderPlus, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export interface FavoriteButtonProps {
  postId: string;
  initialFavorited?: boolean;
  initialCount?: number;
  onFavorite?: (postId: string, favorited: boolean) => Promise<void>;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export function FavoriteButton({
  postId,
  initialFavorited = false,
  initialCount = 0,
  onFavorite,
  showCount = false,
  size = 'md',
  variant = 'default',
  disabled = false,
  className = '',
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showFolderMenu, setShowFolderMenu] = useState(false);

  // 同步初始状态
  useEffect(() => {
    setFavorited(initialFavorited);
    setCount(initialCount);
  }, [initialFavorited, initialCount]);

  // 处理收藏
  const handleFavorite = useCallback(async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    // 乐观更新
    const newFavoritedState = !favorited;
    setFavorited(newFavoritedState);
    setCount((prev) => (newFavoritedState ? prev + 1 : prev - 1));

    try {
      if (onFavorite) {
        await onFavorite(postId, newFavoritedState);
      }

      if (newFavoritedState) {
        toast.success('已添加到收藏');
        // 显示收藏夹选择菜单
        setShowFolderMenu(true);
      } else {
        toast.success('已取消收藏');
      }
    } catch (error) {
      // 回滚
      setFavorited(!newFavoritedState);
      setCount((prev) => (newFavoritedState ? prev - 1 : prev + 1));
      toast.error('操作失败,请重试');
      console.error('收藏失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [disabled, isLoading, favorited, onFavorite, postId]);

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
    default: favorited
      ? 'bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow'
      : 'bg-cyber-dark border-cyber-border text-cyber-muted hover:text-cyber-yellow',
    outline: favorited
      ? 'border-cyber-yellow text-cyber-yellow bg-transparent'
      : 'border-cyber-border text-cyber-muted hover:border-cyber-yellow hover:text-cyber-yellow bg-transparent',
    ghost: favorited
      ? 'text-cyber-yellow bg-transparent border-0'
      : 'text-cyber-muted hover:text-cyber-yellow bg-transparent border-0',
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleFavorite}
        disabled={disabled || isLoading}
        className={cn(
          'relative flex items-center gap-2 rounded-lg border transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        aria-label={favorited ? '取消收藏' : '收藏'}
      >
        {/* 图标 */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {favorited ? (
              <motion.div
                key="favorited"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <StarFilled
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
                key="unfavorited"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Star size={iconSizes[size]} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 计数 */}
        {showCount && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-medium"
          >
            {count > 0 ? count.toLocaleString() : '收藏'}
          </motion.span>
        )}

        {/* 加载状态 */}
        {isLoading && (
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

      {/* 收藏夹选择菜单 */}
      <AnimatePresence>
        {showFolderMenu && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowFolderMenu(false)}
            />

            {/* 菜单 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-72 bg-cyber-dark border border-cyber-border rounded-lg shadow-xl z-50"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">选择收藏夹</h3>
                  <button
                    onClick={() => setShowFolderMenu(false)}
                    className="p-1 rounded hover:bg-cyber-muted transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-cyber-muted" />
                  </button>
                </div>

                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-cyber-border bg-cyber-dark hover:bg-cyber-muted/50 transition-all text-left">
                    <FolderOpen className="w-5 h-5 text-cyber-yellow" />
                    <div>
                      <p className="text-sm text-white">默认收藏夹</p>
                      <p className="text-xs text-cyber-muted">12 个项目</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-cyber-border bg-cyber-dark hover:bg-cyber-muted/50 transition-all text-left">
                    <FolderPlus className="w-5 h-5 text-cyber-cyan" />
                    <div>
                      <p className="text-sm text-cyber-cyan">创建新收藏夹</p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 收藏夹列表组件
 */
export interface FavoriteFolder {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

export interface FavoriteListProps {
  folders: FavoriteFolder[];
  activeFolder?: string;
  onSelectFolder?: (folderId: string) => void;
  onCreateFolder?: () => void;
  className?: string;
}

export function FavoriteList({
  folders,
  activeFolder,
  onSelectFolder,
  onCreateFolder,
  className = '',
}: FavoriteListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {folders.map((folder, index) => (
        <motion.button
          key={folder.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectFolder?.(folder.id)}
          className={cn(
            'w-full flex items-center gap-3 p-4 rounded-lg border transition-all',
            activeFolder === folder.id
              ? 'bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow'
              : 'bg-cyber-dark border-cyber-border text-cyber-muted hover:bg-cyber-muted/50'
          )}
        >
          <FolderOpen className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 text-left">
            <p className="font-medium">{folder.name}</p>
            <p className="text-sm opacity-70">{folder.count} 个项目</p>
          </div>
        </motion.button>
      ))}

      {onCreateFolder && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onCreateFolder}
          className="w-full flex items-center gap-3 p-4 rounded-lg border border-dashed border-cyber-border bg-cyber-dark hover:bg-cyber-muted/50 transition-all text-cyber-cyan"
        >
          <FolderPlus className="w-5 h-5" />
          <span className="font-medium">创建新收藏夹</span>
        </motion.button>
      )}
    </div>
  );
}

export default FavoriteButton;
