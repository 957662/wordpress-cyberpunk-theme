'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Folder, Trash2, MoreVertical, Loader2 } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface BookmarkItem {
  id: string;
  itemType: 'article' | 'comment';
  itemId: string;
  folderId: string;
  title: string;
  excerpt?: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  thumbnail?: string;
  createdAt: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
}

export function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'all', name: '全部', count: 0 },
    { id: 'default', name: '默认收藏夹', count: 0 },
    { id: 'read-later', name: '稍后阅读', count: 0 },
    { id: 'favorites', name: '最爱', count: 0 },
  ]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchBookmarks();
    fetchFolders();
  }, [selectedFolder]);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/bookmarks?folder=${selectedFolder}&limit=20`
      );
      if (!response.ok) throw new Error('Failed to fetch bookmarks');

      const data = await response.json();
      setBookmarks(data.bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/bookmarks/folders');
      if (!response.ok) throw new Error('Failed to fetch folders');

      const data = await response.json();
      setFolders(data.folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove bookmark');

      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
      fetchFolders(); // 更新文件夹计数
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookmarkCheck className="text-amber-500" size={24} />
          <h1 className="text-2xl font-bold text-white">我的收藏</h1>
          <span className="px-2 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-full">
            {bookmarks.length}
          </span>
        </div>

        {/* 视图切换 */}
        <div className="flex items-center gap-2 bg-gray-800/50 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-md transition-all duration-200',
              viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-md transition-all duration-200',
              viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 文件夹列表 */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="text-cyan-500" size={18} />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                收藏夹
              </h3>
            </div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200',
                    selectedFolder === folder.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark size={16} />
                    <span className="text-sm font-medium">{folder.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 书签列表 */}
        <div className="lg:col-span-3">
          {/* 搜索栏 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索收藏..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* 书签内容 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-cyan-500" size={32} />
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Bookmark size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {searchQuery ? '未找到匹配的收藏' : '还没有收藏任何内容'}
              </p>
              <p className="text-sm">
                {searchQuery ? '尝试其他关键词' : '点击文章上的收藏按钮来收藏内容'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookmarks.map((bookmark, index) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onRemove={handleRemoveBookmark}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookmarks.map((bookmark, index) => (
                <BookmarkListItem
                  key={bookmark.id}
                  bookmark={bookmark}
                  onRemove={handleRemoveBookmark}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 书签卡片组件
function BookmarkCard({
  bookmark,
  onRemove,
  index,
}: {
  bookmark: BookmarkItem;
  onRemove: (id: string) => void;
  index: number;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(bookmark.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300"
    >
      {/* 缩略图 */}
      {bookmark.thumbnail && (
        <div className="aspect-video overflow-hidden">
          <Image
            src={bookmark.thumbnail}
            alt={bookmark.title}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-4">
        {/* 标题 */}
        <Link
          href={`/${bookmark.itemType}s/${bookmark.itemId}`}
          className="text-white font-semibold hover:text-cyan-400 transition-colors line-clamp-2 mb-2"
        >
          {bookmark.title}
        </Link>

        {/* 摘要 */}
        {bookmark.excerpt && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {bookmark.excerpt}
          </p>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {bookmark.author.displayName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-400">{bookmark.author.displayName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {formatDate(bookmark.createdAt)}
            </span>
            <motion.button
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isRemoving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* 赛博朋克发光效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}

// 书签列表项组件
function BookmarkListItem({
  bookmark,
  onRemove,
  index,
}: {
  bookmark: BookmarkItem;
  onRemove: (id: string) => void;
  index: number;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(bookmark.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300"
    >
      {/* 缩略图 */}
      {bookmark.thumbnail && (
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={bookmark.thumbnail}
            alt={bookmark.title}
            width={64}
            height={64}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/${bookmark.itemType}s/${bookmark.itemId}`}
          className="text-white font-semibold hover:text-cyan-400 transition-colors line-clamp-1"
        >
          {bookmark.title}
        </Link>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span>{bookmark.author.displayName}</span>
          <span>•</span>
          <span>{formatDate(bookmark.createdAt)}</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <motion.button
        onClick={handleRemove}
        disabled={isRemoving}
        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isRemoving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Trash2 size={18} />
        )}
      </motion.button>
    </motion.div>
  );
}
