'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { CyberCard } from '@/components/ui/CyberCard';
import { Bookmark, BookmarkCheck, Search, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type BookmarkItem = {
  id: string;
  type: 'post' | 'portfolio' | 'project';
  title: string;
  excerpt: string;
  thumbnail?: string;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
};

export default function BookmarksPage() {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'posts' | 'portfolio' | 'projects'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: 从 API 获取书签数据
  // useEffect(() => {
  //   fetchBookmarks();
  // }, []);

  const filteredBookmarks = bookmarks.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRemoveBookmark = async (id: string) => {
    try {
      await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <p className="text-gray-400">请先登录</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Bookmark className="w-8 h-8 text-cyber-purple" />
                我的书签
              </h1>
              <p className="text-gray-400 mt-1">
                {bookmarks.length} 个收藏的内容
              </p>
            </div>

            {/* 视图切换 */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyber-cyan text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-cyber-cyan text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 搜索和过滤 */}
          <CyberCard className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索书签..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>

              {/* 过滤器 */}
              <div className="flex gap-2">
                {(
                  [
                    { value: 'all', label: '全部' },
                    { value: 'posts', label: '文章' },
                    { value: 'portfolio', label: '作品' },
                    { value: 'projects', label: '项目' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      filter === item.value
                        ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Filter className="w-4 h-4 inline mr-1" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </CyberCard>

          {/* 书签列表 */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">加载中...</p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <CyberCard className="p-12 text-center">
              <BookmarkCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">暂无书签</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filter !== 'all'
                  ? '没有找到匹配的书签'
                  : '开始收藏你喜欢的内容吧'}
              </p>
              <Link href="/blog">
                <Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
                  浏览内容
                </Button>
              </Link>
            </CyberCard>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredBookmarks.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CyberCard className="overflow-hidden group hover:border-cyber-cyan transition-all">
                    {viewMode === 'grid' ? (
                      // 网格视图
                      <div>
                        {bookmark.thumbnail && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={bookmark.thumbnail}
                              alt={bookmark.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={() => handleRemoveBookmark(bookmark.id)}
                                className="p-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                              >
                                <BookmarkCheck className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-cyber-cyan/20 text-cyber-cyan rounded">
                              {bookmark.type}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {bookmark.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {bookmark.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {bookmark.author.avatar && (
                                <Image
                                  src={bookmark.author.avatar}
                                  alt={bookmark.author.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              )}
                              <span className="text-sm text-gray-400">
                                {bookmark.author.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(bookmark.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 列表视图
                      <div className="flex gap-4 p-4">
                        {bookmark.thumbnail && (
                          <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={bookmark.thumbnail}
                              alt={bookmark.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-1 bg-cyber-cyan/20 text-cyber-cyan rounded">
                              {bookmark.type}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1 truncate">
                            {bookmark.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-1 mb-2">
                            {bookmark.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{bookmark.author.name}</span>
                            <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBookmark(bookmark.id)}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <BookmarkCheck className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </CyberCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
