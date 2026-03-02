import { useState, useEffect } from 'react';

export interface Bookmark {
  id: string;
  type: 'post' | 'portfolio' | 'comment';
  title: string;
  excerpt?: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
  folder?: string;
  tags?: string[];
}

export interface BookmarkFolder {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

interface UseBookmarkOptions {
  /**
   * 最大书签数量
   * @default 100
   */
  maxBookmarks?: number;
  /**
   * 是否启用 localStorage 同步
   * @default true
   */
  enableSync?: boolean;
}

/**
 * 书签管理 Hook
 *
 * 管理用户的书签收藏，支持文件夹组织和标签分类
 *
 * @example
 * ```tsx
 * const {
 *   bookmarks,
 *   folders,
 *   addBookmark,
 *   removeBookmark,
 *   isBookmarked
 * } = useBookmark();
 *
 * // 添加书签
 * addBookmark({
 *   id: 'post-123',
 *   type: 'post',
 *   title: 'My Post',
 *   url: '/blog/my-post'
 * });
 * ```
 */
export function useBookmark(options: UseBookmarkOptions = {}) {
  const { maxBookmarks = 100, enableSync = true } = options;

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载数据
  useEffect(() => {
    if (!enableSync) {
      setIsLoading(false);
      return;
    }

    try {
      const savedBookmarks = localStorage.getItem('bookmarks');
      const savedFolders = localStorage.getItem('bookmark-folders');

      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }

      if (savedFolders) {
        setFolders(JSON.parse(savedFolders));
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [enableSync]);

  // 保存到 localStorage
  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);

    if (enableSync) {
      try {
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      } catch (error) {
        console.error('Failed to save bookmarks:', error);
      }
    }
  };

  const saveFolders = (newFolders: BookmarkFolder[]) => {
    setFolders(newFolders);

    if (enableSync) {
      try {
        localStorage.setItem('bookmark-folders', JSON.stringify(newFolders));
      } catch (error) {
        console.error('Failed to save folders:', error);
      }
    }
  };

  /**
   * 添加书签
   */
  const addBookmark = (bookmark: Omit<Bookmark, 'createdAt'>) => {
    // 检查是否已存在
    if (bookmarks.some((b) => b.id === bookmark.id)) {
      return false;
    }

    // 检查数量限制
    if (bookmarks.length >= maxBookmarks) {
      console.warn(`Maximum bookmarks limit (${maxBookmarks}) reached`);
      return false;
    }

    const newBookmark: Bookmark = {
      ...bookmark,
      createdAt: new Date().toISOString(),
    };

    saveBookmarks([newBookmark, ...bookmarks]);

    // 更新文件夹计数
    if (bookmark.folder) {
      updateFolderCount(bookmark.folder, 1);
    }

    return true;
  };

  /**
   * 移除书签
   */
  const removeBookmark = (id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    const newBookmarks = bookmarks.filter((b) => b.id !== id);
    saveBookmarks(newBookmarks);

    // 更新文件夹计数
    if (bookmark?.folder) {
      updateFolderCount(bookmark.folder, -1);
    }
  };

  /**
   * 切换书签状态
   */
  const toggleBookmark = (bookmark: Omit<Bookmark, 'createdAt'>) => {
    if (isBookmarked(bookmark.id)) {
      removeBookmark(bookmark.id);
      return false;
    } else {
      return addBookmark(bookmark);
    }
  };

  /**
   * 检查是否已收藏
   */
  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id);
  };

  /**
   * 获取指定文件夹的书签
   */
  const getBookmarksByFolder = (folderId: string) => {
    return bookmarks.filter((b) => b.folder === folderId);
  };

  /**
   * 搜索书签
   */
  const searchBookmarks = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.excerpt?.toLowerCase().includes(lowerQuery) ||
        b.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  };

  /**
   * 创建文件夹
   */
  const createFolder = (name: string) => {
    const newFolder: BookmarkFolder = {
      id: `folder-${Date.now()}`,
      name,
      count: 0,
      createdAt: new Date().toISOString(),
    };

    saveFolders([...folders, newFolder]);
    return newFolder;
  };

  /**
   * 删除文件夹
   */
  const deleteFolder = (folderId: string) => {
    // 将文件夹中的书签移出文件夹
    const updatedBookmarks = bookmarks.map((b) =>
      b.folder === folderId ? { ...b, folder: undefined } : b
    );

    saveBookmarks(updatedBookmarks);
    saveFolders(folders.filter((f) => f.id !== folderId));
  };

  /**
   * 重命名文件夹
   */
  const renameFolder = (folderId: string, newName: string) => {
    saveFolders(
      folders.map((f) => (f.id === folderId ? { ...f, name: newName } : f))
    );
  };

  /**
   * 更新文件夹计数
   */
  const updateFolderCount = (folderId: string, delta: number) => {
    saveFolders(
      folders.map((f) =>
        f.id === folderId ? { ...f, count: Math.max(0, f.count + delta) } : f
      )
    );
  };

  /**
   * 清空所有书签
   */
  const clearAll = () => {
    saveBookmarks([]);
  };

  /**
   * 导出书签
   */
  const exportBookmarks = () => {
    return JSON.stringify({ bookmarks, folders }, null, 2);
  };

  /**
   * 导入书签
   */
  const importBookmarks = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.bookmarks && Array.isArray(parsed.bookmarks)) {
        saveBookmarks(parsed.bookmarks);
      }
      if (parsed.folders && Array.isArray(parsed.folders)) {
        saveFolders(parsed.folders);
      }
      return true;
    } catch (error) {
      console.error('Failed to import bookmarks:', error);
      return false;
    }
  };

  return {
    bookmarks,
    folders,
    isLoading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    getBookmarksByFolder,
    searchBookmarks,
    createFolder,
    deleteFolder,
    renameFolder,
    clearAll,
    exportBookmarks,
    importBookmarks,
  };
}
