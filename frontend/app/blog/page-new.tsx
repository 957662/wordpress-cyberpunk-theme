'use client';

/**
 * 博客列表页面（改进版）
 * 使用 WordPress API 和 React Query
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/api/use-posts';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { Pagination } from '@/components/blog/Pagination';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';
import { CyberLoader } from '@/components/cyber/CyberLoader';
import { SearchFilters } from '@/types';

export default function BlogPageNew() {
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const perPage = 12;

  // 使用自定义 hook 获取文章数据
  const { data, isLoading, error } = usePosts({
    page,
    perPage,
    category: searchFilters.categories?.[0],
    tag: searchFilters.tags?.[0],
    search: searchFilters.query,
    enabled: true,
  });

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setPage(1); // 重置到第一页
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <section className="relative py-20 px-4 border-b border-cyber-border">
        <div className="absolute inset-0 bg-cyber-grid opacity-10" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="text-glow-cyan text-cyber-cyan">技术</span>
              <span className="text-glow-purple text-cyber-purple">博客</span>
            </h1>
            <p className="text-xl text-gray-400">
              探索前沿技术，分享开发经验
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 border-b border-cyber-border">
        <div className="max-w-6xl mx-auto">
          <AdvancedSearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Info Bar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-400">
              共 <span className="text-cyber-cyan font-bold">{data?.total || 0}</span> 篇文章
            </p>
            {searchFilters.query && (
              <button
                onClick={() => handleSearch({})}
                className="text-cyber-purple hover:text-cyber-pink transition-colors"
              >
                清除搜索
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <CyberLoader size="lg" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-cyber-pink mb-2">
                加载失败
              </h3>
              <p className="text-cyber-muted">{error.message}</p>
            </div>
          )}

          {/* Posts Grid */}
          {!isLoading && !error && data?.posts && (
            <>
              <BlogGrid
                posts={data.posts}
                columns={3}
                className="min-h-[500px]"
              />

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    basePath="/blog"
                  />
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && !error && data?.posts?.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-cyber-cyan mb-2">
                暂无文章
              </h3>
              <p className="text-cyber-muted">
                {searchFilters.query ? '没有找到匹配的文章' : '还没有发布任何文章'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 border-t border-cyber-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            订阅更新
          </h2>
          <p className="text-gray-400 mb-8">
            获取最新文章和技术见解，直接发送到您的邮箱
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-cyber-dark border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan text-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-cyber-cyan text-cyber-dark font-bold rounded-lg hover:bg-cyber-cyan/80 transition-colors"
            >
              订阅
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
