'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Search, Grid, List, Folder, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookmarkButtonEnhanced } from '@/components/blog/BookmarkButtonEnhanced';
import { LoadingState, ArticleCardSkeleton } from '@/components/loading/LoadingState';

export interface BookmarkItem {
  id: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  readingTime?: number;
  createdAt: string;
  notes?: string;
  folder?: string;
}

export interface BookmarksPageProps {}

export default function BookmarksPage({}: BookmarksPageProps) {
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  // 模拟数据加载
  React.useEffect(() => {
    setTimeout(() => {
      setBookmarks([
        {
          id: '1',
          targetType: 'post',
          targetId: 'post-1',
          title: '深入理解 TypeScript 高级类型',
          excerpt: 'TypeScript 的类型系统非常强大，本文将深入探讨高级类型的使用...',
          featuredImage: '/images/ts.jpg',
          category: 'TypeScript',
          readingTime: 15,
          createdAt: '2026-03-01',
          folder: '前端开发',
        },
        {
          id: '2',
          targetType: 'post',
          targetId: 'post-2',
          title: 'Next.js 14 App Router 完全指南',
          excerpt: 'Next.js 14 带来了全新的 App Router，让我们探索它的强大功能...',
          category: 'React',
          readingTime: 20,
          createdAt: '2026-03-02',
          folder: '前端开发',
        },
        {
          id: '3',
          targetType: 'post',
          targetId: 'post-3',
          title: '赛博朋克设计系统实践',
          excerpt: '如何构建一个完整的赛博朋克风格设计系统...',
          category: '设计',
          readingTime: 12,
          createdAt: '2026-03-03',
          folder: '设计',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // 获取所有文件夹
  const folders = ['all', ...new Set(bookmarks.map((b) => b.folder || 'uncategorized'))];

  // 过滤和排序书签
  const filteredBookmarks = bookmarks
    .filter((bookmark) => {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bookmark.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesFolder = selectedFolder === 'all' || bookmark.folder === selectedFolder;

      return matchesSearch && matchesFolder;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  // 删除书签
  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bookmark className="w-10 h-10 text-cyan-400" />
            <h1 className="text-5xl font-bold text-white">我的收藏</h1>
          </div>
          <p className="text-gray-400 text-lg">
            保存你最喜欢的文章和内容
          </p>
        </motion.div>

        {/* 工具栏 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* 搜索栏 */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索收藏..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition-colors"
            />
          </div>

          {/* 过滤器和排序 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 文件夹选择 */}
            <div className="flex flex-wrap gap-2">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                    selectedFolder === folder
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                  )}
                >
                  <Folder className="w-4 h-4" />
                  {folder === 'all' ? '全部' : folder === 'uncategorized' ? '未分类' : folder}
                </button>
              ))}
            </div>

            {/* 排序和视图切换 */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="date">按日期</option>
                <option value="title">按标题</option>
              </select>

              <div className="flex bg-gray-800/50 border border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded transition-all',
                    viewMode === 'grid'
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded transition-all',
                    viewMode === 'list'
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 书签列表 */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          >
            {filteredBookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                {/* 书签卡片 */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all h-full">
                  {/* 图片 */}
                  {bookmark.featuredImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={bookmark.featuredImage}
                        alt={bookmark.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* 内容 */}
                  <div className="p-6">
                    {bookmark.category && (
                      <span className="inline-block px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs mb-3">
                        {bookmark.category}
                      </span>
                    )}

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {bookmark.title}
                    </h3>

                    {bookmark.excerpt && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {bookmark.excerpt}
                      </p>
                    )}

                    {/* 元信息 */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(bookmark.createdAt).toLocaleDateString('zh-CN')}</span>
                      {bookmark.readingTime && (
                        <span>{bookmark.readingTime} 分钟</span>
                      )}
                    </div>

                    {bookmark.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <p className="text-xs text-gray-500 italic">"{bookmark.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="删除收藏"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">暂无收藏</h3>
            <p className="text-gray-400">
              {searchQuery || selectedFolder !== 'all'
                ? '没有找到匹配的收藏'
                : '开始收藏你喜欢的文章吧！'}
            </p>
          </motion.div>
        )}

        {/* 统计信息 */}
        {!loading && filteredBookmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center text-gray-400 text-sm"
          >
            共 {filteredBookmarks.length} 个收藏
            {selectedFolder !== 'all' && ` · 文件夹：${selectedFolder}`}
          </motion.div>
        )}
      </div>
    </div>
  );
}
