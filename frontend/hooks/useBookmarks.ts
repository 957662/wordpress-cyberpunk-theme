/**
 * useBookmarks Hook
 * 收藏管理的 React Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { bookmarkService } from '@/services/bookmark-service';
import type { BookmarkItem, BookmarkFolder } from '@/types/social.types';

export interface UseBookmarksOptions {
  enabled?: boolean;
  folderId?: string;
  targetType?: 'post' | 'comment';
}

export interface UseBookmarksReturn {
  bookmarks: BookmarkItem[];
  folders: BookmarkFolder[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  refetch: () => Promise<void>;
  addBookmark: (targetId: string, targetType: 'post' | 'comment', folderId?: string) => Promise<void>;
  removeBookmark: (targetId: string, targetType: 'post' | 'comment') => Promise<void>;
  toggleBookmark: (targetId: string, targetType: 'post' | 'comment', folderId?: string) => Promise<boolean>;
  createFolder: (name: string, icon?: string, color?: string) => Promise<void>;
  updateFolder: (folderId: string, data: { name?: string; icon?: string; color?: string }) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  moveToFolder: (bookmarkId: string, folderId: string) => Promise<void>;
  isBookmarked: (targetId: string, targetType: 'post' | 'comment') => Promise<boolean>;
}

export function useBookmarks(options: UseBookmarksOptions = {}): UseBookmarksReturn {
  const {
    enabled = true,
    folderId,
    targetType,
  } = options;

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 加载收藏列表
  const loadBookmarks = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setIsError(false);

      const data = await bookmarkService.getBookmarks({
        folderId,
        targetType,
      });

      setBookmarks(data.items);
      setTotalCount(data.total);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setIsError(true);
      toast.error('加载收藏失败');
    } finally {
      setIsLoading(false);
    }
  }, [enabled, folderId, targetType]);

  // 加载收藏夹列表
  const loadFolders = useCallback(async () => {
    if (!enabled) return;

    try {
      const data = await bookmarkService.getFolders();
      setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  }, [enabled]);

  // 初始加载
  useEffect(() => {
    loadBookmarks();
    loadFolders();
  }, [loadBookmarks, loadFolders]);

  // 添加收藏
  const addBookmark = useCallback(async (
    targetId: string,
    targetType: 'post' | 'comment',
    folderId?: string
  ) => {
    try {
      const result = await bookmarkService.addBookmark(targetId, targetType, folderId);

      if (result.success) {
        toast.success('已收藏');
        // 乐观更新
        await loadBookmarks();
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast.error('收藏失败');
    }
  }, [loadBookmarks]);

  // 取消收藏
  const removeBookmark = useCallback(async (
    targetId: string,
    targetType: 'post' | 'comment'
  ) => {
    try {
      const result = await bookmarkService.removeBookmark(targetId, targetType);

      if (result.success) {
        toast.success('已取消收藏');
        // 乐观更新
        await loadBookmarks();
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('取消收藏失败');
    }
  }, [loadBookmarks]);

  // 切换收藏状态
  const toggleBookmark = useCallback(async (
    targetId: string,
    targetType: 'post' | 'comment',
    folderId?: string
  ): Promise<boolean> => {
    try {
      const result = await bookmarkService.toggleBookmark(targetId, targetType, folderId);

      if (result.success) {
        toast.success(result.bookmarked ? '已收藏' : '已取消收藏');
        await loadBookmarks();
        return result.bookmarked;
      }
      return false;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('操作失败');
      return false;
    }
  }, [loadBookmarks]);

  // 创建收藏夹
  const createFolder = useCallback(async (
    name: string,
    icon?: string,
    color?: string
  ) => {
    try {
      await bookmarkService.createFolder({ name, icon, color });
      toast.success('收藏夹创建成功');
      await loadFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('创建收藏夹失败');
    }
  }, [loadFolders]);

  // 更新收藏夹
  const updateFolder = useCallback(async (
    folderId: string,
    data: { name?: string; icon?: string; color?: string }
  ) => {
    try {
      await bookmarkService.updateFolder(folderId, data);
      toast.success('收藏夹更新成功');
      await loadFolders();
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('更新收藏夹失败');
    }
  }, [loadFolders]);

  // 删除收藏夹
  const deleteFolder = useCallback(async (folderId: string) => {
    try {
      await bookmarkService.deleteFolder(folderId);
      toast.success('收藏夹删除成功');
      await loadFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('删除收藏夹失败');
    }
  }, [loadFolders]);

  // 移动到其他收藏夹
  const moveToFolder = useCallback(async (bookmarkId: string, folderId: string) => {
    try {
      await bookmarkService.moveToFolder(bookmarkId, folderId);
      toast.success('移动成功');
      await loadBookmarks();
    } catch (error) {
      console.error('Error moving bookmark:', error);
      toast.error('移动失败');
    }
  }, [loadBookmarks]);

  // 检查是否已收藏
  const isBookmarked = useCallback(async (
    targetId: string,
    targetType: 'post' | 'comment'
  ): Promise<boolean> => {
    try {
      return await bookmarkService.checkIsBookmarked(targetId, targetType);
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  }, []);

  return {
    bookmarks,
    folders,
    isLoading,
    isError,
    totalCount,
    refetch: loadBookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    createFolder,
    updateFolder,
    deleteFolder,
    moveToFolder,
    isBookmarked,
  };
}
