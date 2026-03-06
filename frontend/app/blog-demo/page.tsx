/**
 * 博客演示页面
 * 展示如何使用博客组件和 WordPress 集成
 */

'use client';

import { useState } from 'react';
import { BlogList } from '@/components/blog/BlogListFinal';
import { BlogGrid } from '@/components/blog/BlogGridFinal';
import { usePosts, useCategories, useTags } from '@/lib/wordpress/hooks-new';
import { blogService } from '@/services/blog.service';
import { PostFilters } from '@/types/blog';
import { Search, Filter } from 'lucide-react';

export default function BlogDemoPage() {
  const [filters, setFilters] = useState<PostFilters>({
    page: 1,
    pageSize: 12,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  // 使用 React Query hooks 获取数据
  const { data: posts, isLoading, error } = usePosts(filters);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      category: categoryId ? [categoryId] : undefined,
      page: 1,
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy: sortBy as any }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">加载失败</h2>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cyber-dark)]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="p-6 rounded-xl bg-[var(--cyber-muted)]/20 border border-[var(--cyber-border)]">
                <h3 className="text-lg font-semibold text-white mb-4">搜索</h3>
                <input
                  type="text"
                  placeholder="输入关键词..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--cyber-dark)] border border-[var(--cyber-border)] text-white"
                />
              </div>

              {categories && (
                <div className="p-6 rounded-xl bg-[var(--cyber-muted)]/20 border border-[var(--cyber-border)]">
                  <h3 className="text-lg font-semibold text-white mb-4">分类</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        !filters.category?.length
                          ? 'bg-[var(--cyber-cyan)] text-black'
                          : 'text-gray-400'
                      }`}
                    >
                      全部
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          filters.category?.[0] === category.id
                            ? 'bg-[var(--cyber-cyan)] text-black'
                            : 'text-gray-400'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <main className="lg:col-span-3">
            {viewMode === 'grid' ? (
              <BlogGrid posts={posts || []} columns={3} />
            ) : (
              <BlogList
                posts={posts || []}
                loading={isLoading}
                total={posts?.length || 0}
                page={filters.page || 1}
                pageSize={filters.pageSize || 12}
                onPageChange={handlePageChange}
                variant="list"
              />
            )}

            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-[var(--cyber-cyan)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
