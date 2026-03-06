/**
 * 博客列表页面 - 增强版本
 * 集成分页、筛选、搜索等功能
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BlogListUnified } from '@/components/blog';
import { BlogSearchBar } from '@/components/blog';
import { PaginationControls } from '@/components/pagination';
import { AdvancedFilter } from '@/components/filtering';
import { ErrorBoundary, EmptyState } from '@/components/error-handling';
import { LoadingState } from '@/components/blog';
import { getPosts, getCategories, getTags, type WordPressPost, type WordPressCategory, type WordPressTag } from '@/services/api/blog-api.service';
import { debounce } from '@/lib/utils';

interface FilterState {
  categories: number[];
  tags: number[];
  search: string;
  sortBy: 'date' | 'modified' | 'title';
  sortOrder: 'asc' | 'desc';
}

export default function BlogPageEnhanced() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [tags, setTags] = useState<WordPressTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 筛选状态
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    tags: [],
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  /**
   * 加载分类和标签
   */
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories({ per_page: 100 }),
          getTags({ per_page: 100 }),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error('加载筛选选项失败:', err);
      }
    };

    loadFilters();
  }, []);

  /**
   * 加载文章列表
   */
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPosts({
        page: currentPage,
        per_page: pageSize,
        search: filters.search || undefined,
        categories: filters.categories.length > 0 ? filters.categories : undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        orderby: filters.sortBy,
        order: filters.sortOrder,
      });

      setPosts(response.posts);
      setTotalItems(response.totalPosts);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      console.error('加载文章失败:', err);
      setError(err.message || '加载文章失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  /**
   * 初始化 URL 参数
   */
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');
    const searchParam = searchParams.get('q');

    if (categoryParam || tagParam || searchParam) {
      setFilters(prev => ({
        ...prev,
        categories: categoryParam ? [parseInt(categoryParam)] : [],
        tags: tagParam ? [parseInt(tagParam)] : [],
        search: searchParam || '',
      }));
    }
  }, [searchParams]);

  /**
   * 当筛选条件变化时重新加载文章
   */
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /**
   * 处理搜索输入（防抖）
   */
  const handleSearchChange = debounce((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1); // 重置到第一页
  }, 500);

  /**
   * 处理分类选择
   */
  const handleCategoryChange = (categoryIds: number[]) => {
    setFilters(prev => ({ ...prev, categories: categoryIds }));
    setCurrentPage(1);
  };

  /**
   * 处理标签选择
   */
  const handleTagChange = (tagIds: number[]) => {
    setFilters(prev => ({ ...prev, tags: tagIds }));
    setCurrentPage(1);
  };

  /**
   * 处理排序变化
   */
  const handleSortChange = (sortBy: FilterState['sortBy'], sortOrder: FilterState['sortOrder']) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  /**
   * 处理清除筛选
   */
  const handleClearFilters = () => {
    setFilters({
      categories: [],
      tags: [],
      search: '',
      sortBy: 'date',
      sortOrder: 'desc',
    });
    setCurrentPage(1);
  };

  /**
   * 处理分页变化
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 处理每页条数变化
   */
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // 筛选配置
  const filterConfig = [
    {
      id: 'categories',
      label: '分类',
      type: 'checkbox' as const,
      options: categories.map(cat => ({
        label: cat.name,
        value: cat.id,
        count: cat.count,
      })),
      value: filters.categories,
      onChange: handleCategoryChange,
    },
    {
      id: 'tags',
      label: '标签',
      type: 'checkbox' as const,
      options: tags.map(tag => ({
        label: tag.name,
        value: tag.id,
        count: tag.count,
      })),
      value: filters.tags,
      onChange: handleTagChange,
    },
    {
      id: 'sortBy',
      label: '排序方式',
      type: 'select' as const,
      options: [
        { label: '发布日期（降序）', value: 'date-desc' },
        { label: '发布日期（升序）', value: 'date-asc' },
        { label: '修改日期（降序）', value: 'modified-desc' },
        { label: '修改日期（升序）', value: 'modified-asc' },
        { label: '标题（A-Z）', value: 'title-asc' },
        { label: '标题（Z-A）', value: 'title-desc' },
      ],
      value: `${filters.sortBy}-${filters.sortOrder}`,
      onChange: (value: string) => {
        const [sortBy, sortOrder] = value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
        handleSortChange(sortBy, sortOrder);
      },
    },
  ];

  // 计算当前筛选结果数量
  const activeFilterCount =
    filters.categories.length + filters.tags.length + (filters.search ? 1 : 0);

  return (
    <ErrorBoundary
      onError={(error) => console.error('页面错误:', error)}
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-cyber-cyan">页面加载失败</h2>
            <p className="text-gray-400 mb-6">抱歉，页面加载时出现错误</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyber-cyan text-black font-bold rounded-lg hover:bg-cyber-cyan/80 transition-all duration-200"
            >
              重新加载
            </button>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-cyber-dark">
        {/* 页面头部 */}
        <div className="relative overflow-hidden">
          {/* 背景效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-muted via-cyber-dark to-cyber-muted opacity-50" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />

          <div className="relative container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                博客<span className="text-cyber-cyan">文章</span>
              </h1>
              <p className="text-gray-400 text-lg mb-6">
                探索我们的最新文章、技术见解和创意思考
              </p>

              {/* 快速统计 */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="px-4 py-2 bg-cyber-muted/50 rounded-lg border border-cyber-cyan/20">
                  <span className="text-cyber-cyan font-bold">{totalItems}</span>
                  <span className="text-gray-400 ml-2">篇文章</span>
                </div>
                <div className="px-4 py-2 bg-cyber-muted/50 rounded-lg border border-cyber-purple/20">
                  <span className="text-cyber-purple font-bold">{categories.length}</span>
                  <span className="text-gray-400 ml-2">个分类</span>
                </div>
                <div className="px-4 py-2 bg-cyber-muted/50 rounded-lg border border-cyber-pink/20">
                  <span className="text-cyber-pink font-bold">{tags.length}</span>
                  <span className="text-gray-400 ml-2">个标签</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* 搜索栏 */}
          <div className="mb-8">
            <BlogSearchBar
              placeholder="搜索文章标题、内容、标签..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏筛选 */}
            <aside className="lg:w-1/4">
              <div className="sticky top-6 space-y-6">
                {/* 快速导航 */}
                <div className="bg-cyber-muted/30 backdrop-blur-sm rounded-lg border border-cyber-cyan/20 p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    快速链接
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/blog/latest"
                        className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mr-2"></span>
                        最新文章
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog/popular"
                        className="text-gray-400 hover:text-cyber-purple transition-colors text-sm flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-cyber-purple rounded-full mr-2"></span>
                        热门文章
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog/tags"
                        className="text-gray-400 hover:text-cyber-pink transition-colors text-sm flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-cyber-pink rounded-full mr-2"></span>
                        标签云
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* 高级筛选 */}
                <AdvancedFilter
                  filters={filterConfig}
                  onFilterChange={() => {}}
                  resultCount={totalItems}
                  activeFilterCount={activeFilterCount}
                  onClear={handleClearFilters}
                  className="bg-cyber-muted/30 backdrop-blur-sm border border-cyber-cyan/20"
                />
              </div>
            </aside>

            {/* 主内容区 */}
            <main className="lg:w-3/4">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">加载失败</h3>
                  <p className="text-gray-400 mb-6">{error}</p>
                  <button
                    onClick={loadPosts}
                    className="px-6 py-3 bg-cyber-cyan text-black font-bold rounded-lg hover:bg-cyber-cyan/80 transition-all duration-200"
                  >
                    重试
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <EmptyState
                  title={activeFilterCount > 0 ? '没有找到匹配的文章' : '暂无文章'}
                  description={
                    activeFilterCount > 0
                      ? '试试调整筛选条件或清除所有筛选'
                      : '还没有发布任何文章'
                  }
                  action={
                    activeFilterCount > 0
                      ? {
                          label: '清除筛选',
                          onClick: handleClearFilters,
                        }
                      : undefined
                  }
                />
              ) : (
                <>
                  {/* 结果提示 */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                    <p className="text-gray-400">
                      显示 <span className="text-cyber-cyan font-semibold">{totalItems}</span> 篇文章
                      {activeFilterCount > 0 && (
                        <span className="ml-2">
                          (已应用 <span className="text-cyber-purple">{activeFilterCount}</span> 个筛选条件)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* 文章列表 */}
                  <BlogListUnified posts={posts} />

                  {/* 分页 */}
                  {totalPages > 1 && (
                    <div className="mt-12 pt-8 border-t border-gray-800">
                      <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
