/**
 * Blog Complete Page - 完整的博客集成页面示例
 * Complete blog integration example page
 */

'use client';

import { useState, useMemo } from 'react';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogList } from '@/components/blog/BlogList';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { LoadingState } from '@/components/blog/LoadingState';
import { EmptyState } from '@/components/blog/EmptyState';
import { usePosts, useCategories } from '@/lib/hooks/useWordPress';
import type { BlogPost } from '@/types/models/blog';

type ViewMode = 'grid' | 'list';

export default function BlogCompletePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 获取文章数据
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts({
    page: currentPage,
    perPage: viewMode === 'grid' ? 12 : 10,
    search: searchQuery || undefined,
    categories: selectedCategory ? [selectedCategory] : undefined,
  });

  // 获取分类数据
  const { data: categories, isLoading: categoriesLoading } = useCategories({
    hideEmpty: true,
    perPage: 50,
  });

  // 过滤后的文章
  const filteredPosts = useMemo(() => {
    if (!postsData?.posts) return [];

    let posts = [...postsData.posts];

    // 客户端搜索过滤(作为额外保障)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.rendered.toLowerCase().includes(query) ||
        post.excerpt.rendered.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [postsData?.posts, searchQuery]);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理分类选择
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 加载状态
  if (postsLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-cyber-dark">
        <div className="container mx-auto px-4 py-8">
          <LoadingState variant="skeleton" />
        </div>
      </div>
    );
  }

  // 错误状态
  if (postsError) {
    return (
      <div className="min-h-screen bg-cyber-dark">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            title="加载失败"
            description="无法加载文章数据,请稍后重试"
            action={{
              label: '重新加载',
              onClick: () => window.location.reload(),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-cyan/20 bg-cyber-muted/50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-glow-cyan text-cyber-cyan mb-2">
            博客
          </h1>
          <p className="text-gray-400">
            探索最新文章、技术见解和创意内容
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <BlogSearch
                onSearch={handleSearch}
                placeholder="搜索文章..."
                debounce={300}
                className="w-full"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded border transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                    : 'bg-cyber-muted/50 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                网格
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded border transition-all ${
                  viewMode === 'list'
                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                    : 'bg-cyber-muted/50 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                列表
              </button>
            </div>
          </div>

          {/* Category Filter */}
          {categories && !categoriesLoading && (
            <CategoryFilter
              categories={categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                count: cat.count,
              }))}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>

        {/* Posts Display */}
        {filteredPosts.length === 0 ? (
          <EmptyState
            title="没有找到文章"
            description={
              searchQuery
                ? `没有找到与"${searchQuery}"相关的文章`
                : selectedCategory
                ? '该分类下暂时没有文章'
                : '暂时没有文章'
            }
            action={
              searchQuery || selectedCategory
                ? {
                    label: '清除筛选',
                    onClick: () => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    },
                  }
                : undefined
            }
          />
        ) : viewMode === 'grid' ? (
          <BlogGrid
            posts={filteredPosts}
            loading={postsLoading}
            currentPage={currentPage}
            totalPages={postsData?.totalPages || 1}
            totalItems={filteredPosts.length}
            onPageChange={handlePageChange}
            columns={3}
          />
        ) : (
          <BlogList
            posts={filteredPosts}
            loading={postsLoading}
            currentPage={currentPage}
            totalPages={postsData?.totalPages || 1}
            totalItems={filteredPosts.length}
            onPageChange={handlePageChange}
          />
        )}

        {/* Stats Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          显示 {filteredPosts.length} 篇文章
          {postsData?.total && ` / 共 ${postsData.total} 篇`}
          {searchQuery && ` (搜索: "${searchQuery}")`}
          {selectedCategory && ` (分类: ${categories?.find(c => c.id === selectedCategory)?.name})`}
        </div>
      </div>
    </div>
  );
}
