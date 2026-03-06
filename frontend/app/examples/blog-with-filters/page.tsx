'use client';

/**
 * 博客列表页面 - 完整示例
 *
 * 展示如何使用分页、筛选和错误边界组件
 *
 * @author AI Development Team
 * @since 2026-03-06
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid, List, BookOpen } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-handling';
import { PaginationControls } from '@/components/pagination';
import { AdvancedFilter, FilterGroupConfig } from '@/components/filtering';
import { cn } from '@/lib/utils';

/**
 * 文章类型
 */
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  views: number;
  coverImage?: string;
}

/**
 * 模拟数据生成
 */
function generateMockArticles(count: number = 50): Article[] {
  const categories = ['技术', '生活', '设计', '开发', 'AI'];
  const tags = ['React', 'Next.js', 'TypeScript', 'Python', 'AI', '设计', '前端', '后端'];

  return Array.from({ length: count }, (_, i) => ({
    id: `article-${i + 1}`,
    title: `文章标题 ${i + 1}：${['如何使用 React Hooks', 'Next.js 最佳实践', 'TypeScript 入门', 'AI 技术前沿', '设计模式详解'][i % 5]}`,
    excerpt: `这是一篇关于${categories[i % 5]}的文章摘要。本文将深入探讨相关主题，帮助你更好地理解和应用这些知识...`,
    content: `完整的文章内容...`,
    author: {
      name: `作者 ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    },
    category: categories[i % 5],
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
    publishDate: new Date(Date.now() - i * 86400000).toISOString(),
    readTime: Math.floor(Math.random() * 15) + 5,
    views: Math.floor(Math.random() * 10000) + 100,
    coverImage: `https://picsum.photos/800/400?random=${i}`,
  }));
}

/**
 * 文章卡片组件
 */
interface ArticleCardProps {
  article: Article;
  layout: 'grid' | 'list';
}

function ArticleCard({ article, layout }: ArticleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-gray-900/50 border border-cyan-500/20 rounded-lg overflow-hidden',
        'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]',
        'transition-all duration-300',
        layout === 'list' ? 'flex' : ''
      )}
    >
      {article.coverImage && (
        <div
          className={cn(
            'relative overflow-hidden',
            layout === 'list' ? 'w-48 flex-shrink-0' : 'h-48'
          )}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>
      )}

      <div className={cn('p-4', layout === 'list' ? 'flex-1' : '')}>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded">
            {article.category}
          </span>
          <span className="text-xs text-gray-500">
            {article.readTime} 分钟阅读
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{new Date(article.publishDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>{article.views} 浏览</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * 博客列表页面主组件
 */
export default function BlogWithFiltersPage() {
  // 状态管理
  const [articles, setArticles] = useState<Article[]>(() => generateMockArticles());
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');

  // 筛选配置
  const filterConfig: FilterGroupConfig[] = [
    {
      id: 'category',
      title: '分类',
      type: 'checkbox',
      options: [
        { value: '技术', label: '技术', count: 20 },
        { value: '生活', label: '生活', count: 15 },
        { value: '设计', label: '设计', count: 10 },
        { value: '开发', label: '开发', count: 18 },
        { value: 'AI', label: 'AI', count: 12 },
      ],
      searchable: true,
    },
    {
      id: 'tags',
      title: '标签',
      type: 'checkbox',
      options: [
        { value: 'React', label: 'React', count: 15 },
        { value: 'Next.js', label: 'Next.js', count: 12 },
        { value: 'TypeScript', label: 'TypeScript', count: 18 },
        { value: 'Python', label: 'Python', count: 10 },
        { value: 'AI', label: 'AI', count: 8 },
      ],
      searchable: true,
    },
    {
      id: 'sort',
      title: '排序方式',
      type: 'radio',
      options: [
        { value: 'latest', label: '最新发布' },
        { value: 'popular', label: '最多浏览' },
        { value: 'trending', label: '热门趋势' },
      ],
      defaultValue: 'latest',
    },
  ];

  const [filters, setFilters] = useState<Record<string, any>>({
    category: [],
    tags: [],
    sort: 'latest',
  });

  // 应用筛选和搜索
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // 分类过滤
      if (filters.category?.length > 0) {
        if (!filters.category.includes(article.category)) return false;
      }

      // 标签过滤
      if (filters.tags?.length > 0) {
        const hasTag = article.tags.some((tag) => filters.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [articles, searchQuery, filters]);

  // 排序
  const sortedArticles = useMemo(() => {
    const sorted = [...filteredArticles];
    switch (filters.sort) {
      case 'latest':
        return sorted.sort((a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
      case 'popular':
        return sorted.sort((a, b) => b.views - a.views);
      case 'trending':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.publishDate).getTime();
          const dateB = new Date(b.publishDate).getTime();
          const daysA = (Date.now() - dateA) / (1000 * 60 * 60 * 24);
          const daysB = (Date.now() - dateB) / (1000 * 60 * 60 * 24);
          return (b.views / Math.max(daysB, 1)) - (a.views / Math.max(daysA, 1));
        });
      default:
        return sorted;
    }
  }, [filteredArticles, filters.sort]);

  // 分页
  const totalPages = Math.ceil(sortedArticles.length / pageSize);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedArticles.slice(start, end);
  }, [sortedArticles, currentPage, pageSize]);

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      category: [],
      tags: [],
      sort: 'latest',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // 筛选变化
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Blog page error:', error, errorInfo);
      }}
      showDetails
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        {/* 头部 */}
        <header className="border-b border-cyan-500/20 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">博客</h1>
                  <p className="text-sm text-gray-400">发现精彩文章</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* 搜索栏 */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="搜索文章标题、内容或标签..."
                className={cn(
                  'w-full pl-12 pr-4 py-4 text-lg rounded-xl',
                  'bg-gray-900/50 border-2 border-cyan-500/20',
                  'focus:outline-none focus:border-cyan-500',
                  'text-white placeholder-gray-500',
                  'transition-colors duration-200'
                )}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏筛选 */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* 布局切换 */}
                <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">视图模式</h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLayout('grid')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors',
                        layout === 'grid'
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      )}
                    >
                      <Grid className="w-4 h-4" />
                      网格
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLayout('list')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors',
                        layout === 'list'
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      )}
                    >
                      <List className="w-4 h-4" />
                      列表
                    </motion.button>
                  </div>
                </div>

                {/* 高级筛选 */}
                <AdvancedFilter
                  filters={filterConfig}
                  onFilterChange={handleFilterChange}
                  initialFilters={filters}
                  showReset
                  resultCount={sortedArticles.length}
                  variant="outlined"
                />
              </div>
            </aside>

            {/* 文章列表 */}
            <div className="flex-1">
              {/* 结果信息 */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-400">
                  找到 <span className="text-cyan-400 font-semibold">{sortedArticles.length}</span> 篇文章
                  {searchQuery && (
                    <span>
                      {' '}关于 "<span className="text-white">{searchQuery}</span>" 的结果
                    </span>
                  )}
                </p>
                {(filters.category?.length > 0 || filters.tags?.length > 0 || searchQuery) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-sm bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    清除所有筛选
                  </motion.button>
                )}
              </div>

              {/* 文章网格/列表 */}
              {paginatedArticles.length > 0 ? (
                <motion.div
                  layout
                  className={
                    layout === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'space-y-4'
                  }
                >
                  {paginatedArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      layout={layout}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <SlidersHorizontal className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    没有找到匹配的文章
                  </h3>
                  <p className="text-gray-500 mb-6">
                    试试调整搜索词或筛选条件
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg"
                  >
                    清除筛选
                  </motion.button>
                </div>
              )}

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={sortedArticles.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[12, 24, 48]}
                    showPageSizeSelector
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
