'use client';

/**
 * Bookmarks Page
 * 收藏管理页面
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Grid, List, Search, Filter, Trash2, Folder } from 'lucide-react';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { CyberButton } from '@/components/ui/CyberButton';
import { CyberInput } from '@/components/ui/CyberInput';
import { mockBookmarks } from '@/lib/mock-data';

export default function BookmarksPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(mockBookmarks.map((b) => b.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredBookmarks = useMemo(() => {
    return mockBookmarks.filter((bookmark) => {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || bookmark.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleRemoveBookmark = (id: string) => {
    // TODO: 实现移除收藏的逻辑
    console.log('Remove bookmark:', id);
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-cyber-pink" />
              <h1 className="text-xl font-bold text-white">我的收藏</h1>
              <span className="px-2 py-1 bg-cyber-pink/10 text-cyber-pink text-sm rounded-full">
                {filteredBookmarks.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CyberButton
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                icon={<Grid className="w-4 h-4" />}
              />
              <CyberButton
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                icon={<List className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 工具栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 space-y-4"
        >
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <CyberInput
              type="text"
              placeholder="搜索收藏的内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* 分类筛选 */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="flex gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-cyber-pink text-white'
                      : 'bg-cyber-muted/30 text-gray-400 hover:bg-cyber-muted/50'
                  }`}
                >
                  {category === 'all' ? '全部' : category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 收藏列表 */}
        {filteredBookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-white mb-2">暂无收藏</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'all'
                ? '没有找到匹配的收藏内容'
                : '开始收藏你喜欢的文章吧'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredBookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <ArticleCard post={bookmark} variant={viewMode === 'grid' ? 'grid' : 'list'} />
                {/* 删除按钮 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="absolute top-4 right-4 p-2 bg-cyber-dark/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="移除收藏"
                >
                  <Trash2 className="w-4 h-4 text-cyber-pink" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 批量操作栏 */}
        {filteredBookmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 bg-cyber-dark/95 backdrop-blur-xl border-t border-cyber-border p-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <span className="text-sm text-gray-400">
                已选择 <span className="text-white font-semibold">0</span> 项
              </span>
              <div className="flex items-center gap-3">
                <CyberButton variant="ghost" size="sm">
                  <Folder className="w-4 h-4 mr-2" />
                  移动到文件夹
                </CyberButton>
                <CyberButton variant="danger" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除选中
                </CyberButton>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
