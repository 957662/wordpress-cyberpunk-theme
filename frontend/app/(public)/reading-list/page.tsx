'use client';

/**
 * Reading List Page
 * 阅读列表页面 - 管理用户的阅读列表
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ExternalLink, Trash2, Search, Filter, Grid, List, BookOpen } from 'lucide-react';
import { bookmarkService, Bookmark as BookmarkType } from '@/lib/services/bookmark-service';
import { ArticleCard } from '@/components/blog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ReadingListPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'post' | 'portfolio' | 'page'>('all');

  useEffect(() => {
    const unsubscribe = bookmarkService.subscribe(setBookmarks);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let filtered = bookmarks;

    // 类型过滤
    if (filterType !== 'all') {
      filtered = filtered.filter(b => b.type === filterType);
    }

    // 搜索过滤
    if (searchQuery) {
      filtered = bookmarkService.search(searchQuery).filter(b =>
        filterType === 'all' || b.type === filterType
      );
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, filterType]);

  const handleRemove = (id: string) => {
    bookmarkService.remove(id);
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有书签吗？')) {
      bookmarkService.clear();
    }
  };

  const handleExport = () => {
    const data = bookmarkService.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: bookmarks.length,
    posts: bookmarks.filter(b => b.type === 'post').length,
    portfolios: bookmarks.filter(b => b.type === 'portfolio').length,
    pages: bookmarks.filter(b => b.type === 'page').length,
  };

  return (
    <div className="min-h-screen bg-cyber-dark py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                <span className="text-cyber-cyan">阅读</span>
                <span className="text-cyber-purple">列表</span>
              </h1>
              <p className="text-gray-400 text-lg">
                保存你感兴趣的文章，随时阅读
              </p>
            </div>
            <div className="hidden md:block p-4 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/30">
              <Bookmark className="w-12 h-12 text-cyber-cyan" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="cyber-card p-4 text-center">
              <div className="text-2xl font-bold text-cyber-cyan mb-1">{stats.total}</div>
              <div className="text-xs text-gray-400">总计</div>
            </div>
            <div className="cyber-card p-4 text-center">
              <div className="text-2xl font-bold text-cyber-purple mb-1">{stats.posts}</div>
              <div className="text-xs text-gray-400">文章</div>
            </div>
            <div className="cyber-card p-4 text-center">
              <div className="text-2xl font-bold text-cyber-pink mb-1">{stats.portfolios}</div>
              <div className="text-xs text-gray-400">作品</div>
            </div>
            <div className="cyber-card p-4 text-center">
              <div className="text-2xl font-bold text-cyber-yellow mb-1">{stats.pages}</div>
              <div className="text-xs text-gray-400">页面</div>
            </div>
          </div>
        </motion.div>

        {/* Filters & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索书签..."
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Type Filter */}
              <div className="flex items-center gap-2 p-1 bg-cyber-dark rounded-lg">
                {(['all', 'post', 'portfolio', 'page'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-cyber-cyan text-cyber-dark'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'all' ? '全部' :
                     type === 'post' ? '文章' :
                     type === 'portfolio' ? '作品' : '页面'}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-cyber-dark rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-cyber-cyan text-cyber-dark' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-cyber-cyan text-cyber-dark' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={bookmarks.length === 0}
                >
                  导出
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={bookmarks.length === 0}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bookmarks */}
        {filteredBookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-card p-12 text-center"
          >
            <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery || filterType !== 'all' ? '没有找到匹配的书签' : '阅读列表为空'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterType !== 'all'
                ? '尝试调整搜索或过滤条件'
                : '开始添加你感兴趣的文章吧'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button href="/blog" variant="primary">
                <BookOpen className="w-4 h-4 mr-2" />
                浏览文章
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }
          >
            {filteredBookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <Link
                  href={`/${bookmark.type === 'post' ? 'blog' : bookmark.type}/${bookmark.itemId}`}
                  className="block"
                >
                  <div className="cyber-card p-4 hover:border-cyber-cyan/50 transition-all h-full">
                    <div className="flex items-start gap-4">
                      {bookmark.thumbnail && (
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={bookmark.thumbnail}
                            alt={bookmark.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold mb-1 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                          {bookmark.title}
                        </h4>
                        {bookmark.excerpt && (
                          <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                            {bookmark.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>添加于 {new Date(bookmark.createdAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(bookmark.id);
                        }}
                        className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
