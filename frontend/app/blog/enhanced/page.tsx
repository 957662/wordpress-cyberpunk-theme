'use client';

/**
 * 增强版博客列表页面
 * 集成分页、筛选、错误处理功能
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { PaginationControls } from '@/components/pagination/PaginationControls';
import { AdvancedFilter } from '@/components/filtering/AdvancedFilter';
import { ErrorBoundary } from '@/components/error-handling/ErrorBoundary';
import { EmptyState } from '@/components/error-handling/EmptyState';
import { LoadingCard } from '@/components/loading/LoadingCard';
import { cn } from '@/lib/utils';

// 类型定义
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
    id?: number;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    color?: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  publishedAt: string;
  modifiedAt?: string;
  readTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: 'publish' | 'draft' | 'pending';
}

interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// 模拟数据
const mockPosts: BlogPost[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  title: `文章标题 ${i + 1} - Next.js 14 与 React Server Components`,
  slug: `post-${i + 1}`,
  excerpt: `这是一篇关于现代 Web 开发的文章，涵盖了 Next.js 14、React Server Components、TypeScript 等前沿技术。文章将深入探讨这些技术如何提升开发效率和用户体验...`,
  content: `<p>详细内容...</p>`,
  featuredImage: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&sig=${i}`,
  author: {
    name: `作者 ${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    id: i + 1,
  },
  categories: [
    {
      id: 1,
      name: '前端开发',
      slug: 'frontend',
      color: '#00f0ff',
    },
  ],
  tags: [
    { id: 1, name: 'Next.js', slug: 'nextjs' },
    { id: 2, name: 'React', slug: 'react' },
    { id: 3, name: 'TypeScript', slug: 'typescript' },
  ],
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  readTime: Math.floor(Math.random() * 10) + 5,
  viewCount: Math.floor(Math.random() * 5000) + 100,
  likeCount: Math.floor(Math.random() * 500) + 10,
  commentCount: Math.floor(Math.random() * 50),
  status: 'publish',
});

// 筛选配置
const filterConfig = [
  {
    id: 'category',
    label: '分类',
    type: 'checkbox' as const,
    options: [
      { label: '前端开发', value: 'frontend' },
      { label: '后端开发', value: 'backend' },
      { label: 'UI设计', value: 'design' },
      { label: '运维部署', value: 'devops' },
    ],
  },
  {
    id: 'tags',
    label: '标签',
    type: 'checkbox' as const,
    options: [
      { label: 'Next.js', value: 'nextjs' },
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Docker', value: 'docker' },
      { label: 'GraphQL', value: 'graphql' },
    ],
  },
  {
    id: 'dateRange',
    label: '发布时间',
    type: 'date-range' as const,
  },
];

export default function EnhancedBlogPage() {
  // 状态管理
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);

  // 筛选状态
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // 视图模式
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 加载数据
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));

      // 这里应该是实际的API调用
      // const response = await wordpressService.getPosts({ ... });
      setPosts(mockPosts);
      setTotalItems(mockPosts.length);
    } catch (err) {
      setError('加载文章失败，请稍后重试');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // 应用筛选
  useEffect(() => {
    let filtered = [...posts];

    // 应用搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query)
      );
    }

    // 应用分类筛选
    if (activeFilters.category?.length > 0) {
      filtered = filtered.filter(post =>
        post.categories.some(cat => activeFilters.category.includes(cat.slug))
      );
    }

    // 应用标签筛选
    if (activeFilters.tags?.length > 0) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => activeFilters.tags.includes(tag.slug))
      );
    }

    // 应用日期筛选
    if (activeFilters.dateRange) {
      const { from, to } = activeFilters.dateRange;
      if (from) {
        filtered = filtered.filter(post => new Date(post.publishedAt) >= new Date(from));
      }
      if (to) {
        filtered = filtered.filter(post => new Date(post.publishedAt) <= new Date(to));
      }
    }

    setFilteredPosts(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // 重置到第一页
  }, [posts, activeFilters, searchQuery]);

  // 计算分页
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayPosts = filteredPosts.slice(startIndex, endIndex);

  // 处理筛选变化
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    setActiveFilters(filters);
  }, []);

  // 处理搜索
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 处理分页变化
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 处理每页条数变化
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // 错误处理
  const handleError = useCallback((error: Error, errorInfo: any) => {
    console.error('Blog page error:', error, errorInfo);
    setError('页面发生错误，请刷新重试');
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        {/* Header */}
        <section className="relative py-20 px-4 border-b border-gray-800">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  技术博客
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                探索前沿技术，分享开发经验
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏筛选 */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-8">
                <AdvancedFilter
                  filters={filterConfig}
                  onFilterChange={handleFilterChange}
                  resultCount={totalItems}
                  searchPlaceholder="搜索文章..."
                  onSearch={handleSearch}
                />
              </div>
            </aside>

            {/* 主内容区 */}
            <main className="flex-1">
              {/* 工具栏 */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400">
                    找到 <span className="text-cyan-400 font-bold">{totalItems}</span> 篇文章
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      viewMode === 'grid'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-gray-400 hover:text-gray-300'
                    )}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      viewMode === 'list'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-gray-400 hover:text-gray-300'
                    )}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 加载状态 */}
              {loading && (
                <div className={cn(
                  'grid gap-6',
                  viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-1'
                )}>
                  {Array.from({ length: pageSize }).map((_, i) => (
                    <LoadingCard key={i} />
                  ))}
                </div>
              )}

              {/* 错误状态 */}
              {error && (
                <EmptyState
                  type="error"
                  title="加载失败"
                  message={error}
                  action={{
                    label: '重试',
                    onClick: loadPosts,
                  }}
                />
              )}

              {/* 空状态 */}
              {!loading && !error && filteredPosts.length === 0 && (
                <EmptyState
                  type="empty"
                  title="没有找到文章"
                  message="尝试调整搜索条件或筛选器"
                  action={{
                    label: '清除筛选',
                    onClick: () => {
                      setActiveFilters({});
                      setSearchQuery('');
                    },
                  }}
                />
              )}

              {/* 文章列表 */}
              {!loading && !error && displayPosts.length > 0 && (
                <>
                  <motion.div
                    layout
                    className={cn(
                      'grid gap-6',
                      viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-1'
                    )}
                  >
                    {displayPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ArticleCard
                          {...post}
                          variant={viewMode === 'grid' ? 'default' : 'compact'}
                          index={index}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* 分页 */}
                  <div className="mt-12">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={totalItems}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      showPageSizeSelector
                      showPageInfo
                    />
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
