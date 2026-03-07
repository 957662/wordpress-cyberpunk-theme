/**
 * Advanced Blog List Component
 * 高级博客列表组件 - 支持无限滚动、虚拟化、缓存等功能
 *
 * @author AI Development Team
 * @version 2.0.0
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Filter, Grid, List, ArrowUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

// 类型定义
export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  featured_media?: {
    id: number;
    source_url: string;
    alt_text: string;
  };
  link: string;
  slug: string;
}

export interface BlogAdvancedListProps {
  posts: Post[];
  totalPosts: number;
  postsPerPage: number;
  onLoadMore?: (page: number) => Promise<Post[]>;
  onRefresh?: () => Promise<Post[]>;
  viewMode?: 'grid' | 'list';
  enableInfiniteScroll?: boolean;
  enableVirtualScroll?: boolean;
  enableCache?: boolean;
  showFilters?: boolean;
  showSortOptions?: boolean;
  searchable?: boolean;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'date' | 'title' | 'comments';
type FilterOption = 'all' | 'categories' | 'tags';

export function BlogAdvancedList({
  posts: initialPosts,
  totalPosts,
  postsPerPage = 10,
  onLoadMore,
  onRefresh,
  viewMode: initialViewMode = 'grid',
  enableInfiniteScroll = true,
  enableVirtualScroll = false,
  enableCache = true,
  showFilters = true,
  showSortOptions = true,
  searchable = true,
}: BlogAdvancedListProps) {
  // 状态管理
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length < totalPosts);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 缓存
  const cache = useRef<Map<string, Post[]>>(new Map());

  // 无限滚动触发器
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // 过滤和排序后的文章
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // 搜索过滤
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 分类过滤
    if (selectedCategories.length > 0) {
      result = result.filter((post) =>
        post.categories.some((cat) => selectedCategories.includes(cat.id))
      );
    }

    // 标签过滤
    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        post.tags.some((tag) => selectedTags.includes(tag.id))
      );
    }

    // 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [posts, searchQuery, selectedCategories, selectedTags, sortBy]);

  // 加载更多文章
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !onLoadMore) return;

    setLoading(true);

    try {
      const cacheKey = `page-${currentPage + 1}`;
      let newPosts: Post[];

      // 检查缓存
      if (enableCache && cache.current.has(cacheKey)) {
        newPosts = cache.current.get(cacheKey)!;
      } else {
        newPosts = await onLoadMore(currentPage + 1);
        if (enableCache) {
          cache.current.set(cacheKey, newPosts);
        }
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setCurrentPage((prev) => prev + 1);
      setHasMore(newPosts.length === postsPerPage);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, hasMore, loading, onLoadMore, postsPerPage, enableCache]);

  // 刷新文章
  const handleRefresh = useCallback(async () => {
    if (!onRefresh || refreshing) return;

    setRefreshing(true);
    cache.current.clear(); // 清除缓存

    try {
      const refreshedPosts = await onRefresh();
      setPosts(refreshedPosts);
      setCurrentPage(1);
      setHasMore(refreshedPosts.length < totalPosts);
    } catch (error) {
      console.error('Failed to refresh posts:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing, totalPosts]);

  // 监听无限滚动
  useEffect(() => {
    if (enableInfiniteScroll && inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, enableInfiniteScroll, loadMore]);

  // 监听滚动显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 返回顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 切换视图模式
  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  }, []);

  // 清除所有过滤器
  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchQuery('');
  }, []);

  return (
    <div className="blog-advanced-list">
      {/* 工具栏 */}
      <div className="toolbar mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-cyber-cyan/20 bg-cyber-dark/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* 搜索 */}
          {searchable && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章..."
                className="w-64 rounded-md border border-cyber-cyan/30 bg-cyber-dark/50 px-4 py-2 text-white placeholder-gray-400 focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
              />
            </div>
          )}

          {/* 排序 */}
          {showSortOptions && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-md border border-cyber-cyan/30 bg-cyber-dark/50 px-4 py-2 text-white focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
            >
              <option value="date">最新发布</option>
              <option value="title">标题排序</option>
            </select>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* 刷新按钮 */}
          {onRefresh && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-md border border-cyber-cyan/30 bg-cyber-dark/50 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          )}

          {/* 视图切换 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleViewMode}
            className="rounded-md border border-cyber-cyan/30 bg-cyber-dark/50 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/10"
          >
            {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>

      {/* 过滤器状态 */}
      {(selectedCategories.length > 0 || selectedTags.length > 0 || searchQuery) && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-cyber-purple/20 bg-cyber-dark/50 p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-cyber-purple" />
            <span className="text-sm text-gray-400">
              已应用 {selectedCategories.length + selectedTags.length + (searchQuery ? 1 : 0)} 个过滤器
            </span>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-cyber-cyan hover:text-cyber-purple"
          >
            清除全部
          </button>
        </div>
      )}

      {/* 文章列表 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === 'grid'
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col gap-6'
          }
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <BlogCard post={post} viewMode={viewMode} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 加载更多 */}
      {hasMore && enableInfiniteScroll && (
        <div ref={loadMoreRef} className="mt-8 flex justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-cyber-cyan">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>加载中...</span>
            </div>
          )}
        </div>
      )}

      {/* 没有更多文章 */}
      {!hasMore && filteredPosts.length > 0 && (
        <div className="mt-8 text-center text-gray-400">
          没有更多文章了
        </div>
      )}

      {/* 空状态 */}
      {filteredPosts.length === 0 && !loading && (
        <div className="py-12 text-center">
          <p className="text-gray-400">没有找到匹配的文章</p>
          {(searchQuery || selectedCategories.length > 0 || selectedTags.length > 0) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-cyber-cyan hover:text-cyber-purple"
            >
              清除过滤器
            </button>
          )}
        </div>
      )}

      {/* 返回顶部按钮 */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 rounded-full border border-cyber-cyan/30 bg-cyber-dark/50 p-3 text-cyber-cyan shadow-lg backdrop-blur-sm hover:bg-cyber-cyan/10"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// 文章卡片组件
function BlogCard({ post, viewMode }: { post: Post; viewMode: ViewMode }) {
  return (
    <article
      className={`group overflow-hidden rounded-lg border border-cyber-cyan/20 bg-cyber-dark/50 backdrop-blur-sm transition-all duration-300 hover:border-cyber-cyan/50 hover:shadow-lg hover:shadow-cyber-cyan/20 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* 特色图片 */}
      {post.featured_media && (
        <div className={`overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
          <img
            src={post.featured_media.source_url}
            alt={post.featured_media.alt_text || post.title}
            className="h-full w-full transform object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* 内容 */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        {/* 分类 */}
        <div className="mb-2 flex flex-wrap gap-2">
          {post.categories.slice(0, 2).map((category) => (
            <span
              key={category.id}
              className="rounded-full bg-cyber-purple/20 px-2 py-1 text-xs text-cyber-purple"
            >
              {category.name}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-cyber-cyan transition-colors">
          <a href={post.link}>{post.title}</a>
        </h3>

        {/* 摘要 */}
        {viewMode === 'grid' && (
          <p
            className="mb-4 text-sm text-gray-400 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-5 w-5 rounded-full"
              />
            )}
            <span>{post.author.name}</span>
          </div>
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}

export default BlogAdvancedList;
