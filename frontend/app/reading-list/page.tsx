'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookOpen, Clock, Trash2, Filter, Grid, List } from 'lucide-react';
import { ArticleTimeline, TimelineArticle } from '@/components/blog/ArticleTimeline';
import CyberCard from '@/components/cyber/CyberCard';
import { useReadingHistory, useBookmark } from '@/hooks';

export default function ReadingListPage() {
  const { history, removeFromHistory } = useReadingHistory(50);
  const { bookmarks, removeBookmark } = useBookmark({ maxBookmarks: 100 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'unread' | 'completed'>('all');

  // Mock data for demonstration
  const [readingList, setReadingList] = useState<TimelineArticle[]>([
    {
      id: '1',
      title: 'Next.js 14 App Router 完全指南',
      excerpt: '深入了解 Next.js 14 的新特性，包括 Server Components、Server Actions 等。',
      date: '2026-03-01',
      category: '前端开发',
      tags: ['Next.js', 'React', 'TypeScript'],
      views: 1234,
      likes: 56,
      readTime: 15,
    },
    {
      id: '2',
      title: '赛博朋克设计系统实践',
      excerpt: '如何构建一个完整的赛博朋克风格设计系统，包括色彩、排版、组件等。',
      date: '2026-02-28',
      category: 'UI设计',
      tags: ['设计系统', '赛博朋克', 'UI/UX'],
      views: 892,
      likes: 34,
      readTime: 12,
    },
    {
      id: '3',
      title: 'TypeScript 高级类型技巧',
      excerpt: '掌握 TypeScript 的高级类型系统，提升代码质量和开发效率。',
      date: '2026-02-25',
      category: '前端开发',
      tags: ['TypeScript', '类型系统', '最佳实践'],
      views: 2156,
      likes: 89,
      readTime: 18,
    },
  ]);

  const filteredList = readingList.filter(item => {
    if (filter === 'unread') return !history.includes(item.id);
    if (filter === 'completed') return history.includes(item.id);
    return true;
  });

  const stats = {
    total: readingList.length,
    unread: readingList.length - history.filter(id => readingList.some(item => item.id === id)).length,
    completed: history.filter(id => readingList.some(item => item.id === id)).length,
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/10 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-cyber-white mb-4">
              <span className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                阅读清单
              </span>
            </h1>
            <p className="text-cyber-gray text-lg max-w-2xl mx-auto">
              管理你的阅读进度，收藏喜欢的文章
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <CyberCard className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-cyber-cyan mx-auto mb-3" />
              <div className="text-3xl font-bold text-cyber-white mb-1">{stats.total}</div>
              <div className="text-sm text-cyber-gray">总文章数</div>
            </CyberCard>

            <CyberCard className="p-6 text-center">
              <Clock className="w-8 h-8 text-cyber-purple mx-auto mb-3" />
              <div className="text-3xl font-bold text-cyber-white mb-1">{stats.unread}</div>
              <div className="text-sm text-cyber-gray">未阅读</div>
            </CyberCard>

            <CyberCard className="p-6 text-center">
              <Bookmark className="w-8 h-8 text-cyber-pink mx-auto mb-3" />
              <div className="text-3xl font-bold text-cyber-white mb-1">{stats.completed}</div>
              <div className="text-sm text-cyber-gray">已完成</div>
            </CyberCard>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'all'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                  : 'bg-cyber-dark/50 text-cyber-gray border border-cyber-gray/30 hover:border-cyber-cyan/30'
              )}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'unread'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                  : 'bg-cyber-dark/50 text-cyber-gray border border-cyber-gray/30 hover:border-cyber-cyan/30'
              )}
            >
              未阅读
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'completed'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                  : 'bg-cyber-dark/50 text-cyber-gray border border-cyber-gray/30 hover:border-cyber-cyan/30'
              )}
            >
              已完成
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan'
                  : 'bg-cyber-dark/50 text-cyber-gray hover:text-cyber-cyan'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan'
                  : 'bg-cyber-dark/50 text-cyber-gray hover:text-cyber-cyan'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Reading List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {viewMode === 'list' ? (
            <ArticleTimeline
              articles={filteredList}
              showStats
              showTags
              onArticleClick={(article) => {
                // Navigate to article
                console.log('Navigate to:', article.id);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((article) => (
                <CyberCard key={article.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 text-xs bg-cyber-purple/20 text-cyber-purple rounded-full">
                      {article.category}
                    </span>
                    {history.includes(article.id) && (
                      <span className="text-cyber-green text-sm">已阅读</span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-cyber-cyan mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-cyber-gray text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-cyber-dark border border-cyber-gray/30 text-cyber-gray rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-cyber-gray border-t border-cyber-gray/20 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime} 分钟
                      </div>
                      <div>{article.views} 浏览</div>
                    </div>
                    <button
                      onClick={() => removeFromHistory(article.id)}
                      className="p-1 rounded hover:bg-cyber-pink/20 hover:text-cyber-pink transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CyberCard>
              ))}
            </div>
          )}
        </motion.div>

        {filteredList.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-cyber-gray mx-auto mb-4" />
            <p className="text-cyber-gray text-lg">暂无文章</p>
            <p className="text-cyber-gray/60 text-sm mt-2">开始添加你想阅读的文章吧</p>
          </div>
        )}
      </div>
    </div>
  );
}
