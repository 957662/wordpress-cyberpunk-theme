/**
 * BlogList Enhanced Component
 * 增强版博客列表组件，支持多种布局和过滤
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogGrid } from './BlogGrid';
import { BlogCard } from './BlogCard';
import type { ArticleCardProps } from './ArticleCard';
import { LoadingState } from './LoadingState';
import { cn } from '@/lib/utils';

export interface BlogListEnhancedProps {
  posts?: ArticleCardProps[];
  loading?: boolean;
  error?: Error | null;
  columns?: 1 | 2 | 3 | 4;
  layout?: 'grid' | 'list' | 'magazine';
  variant?: 'default' | 'compact' | 'featured';
  showStats?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  emptyMessage?: string;
  emptyDescription?: string;
}

export const BlogListEnhanced: React.FC<BlogListEnhancedProps> = ({
  posts = [],
  loading = false,
  error = null,
  columns = 3,
  layout = 'grid',
  variant = 'default',
  showStats = true,
  showFilters = false,
  showSearch = false,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  emptyMessage = '暂无文章',
  emptyDescription = '还没有发布任何文章，敬请期待！',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 过滤文章
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      post.categories.some(cat => cat.slug === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // 获取所有分类
  const allCategories = React.useMemo(() => {
    const categories = new Set<string>();
    posts.forEach(post => {
      post.categories.forEach(cat => {
        categories.add(cat.slug);
      });
    });
    return Array.from(categories);
  }, [posts]);

  // 加载状态
  if (loading) {
    return (
      <div className="cyber-blog-list-enhanced">
        <LoadingState type="skeleton" count={columns * 2} />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="cyber-blog-list-enhanced">
        <div className="cyber-error-state">
          <div className="text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <h3 className="text-xl font-bold text-cyber-pink">加载失败</h3>
            <p className="text-cyber-muted">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // 空状态
  if (filteredPosts.length === 0) {
    return (
      <div className={cn('cyber-blog-list-enhanced', className)}>
        <div className="cyber-empty-state">
          <div className="text-center space-y-4">
            <div className="text-6xl">📝</div>
            <h3 className="text-xl font-bold text-cyber-cyan">{emptyMessage}</h3>
            <p className="text-cyber-muted">{emptyDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('cyber-blog-list-enhanced space-y-6', className)}>
      {/* 搜索和过滤器 */}
      {(showSearch || showFilters) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-blog-filters space-y-4"
        >
          {/* 搜索栏 */}
          {showSearch && (
            <div className="cyber-search-bar">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索文章..."
                className="cyber-input w-full"
              />
            </div>
          )}

          {/* 分类过滤器 */}
          {showFilters && allCategories.length > 0 && (
            <div className="cyber-category-filters">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    'cyber-filter-button',
                    selectedCategory === 'all' && 'active'
                  )}
                >
                  全部
                </button>
                {posts
                  .flatMap(post => post.categories)
                  .filter((cat, index, self) =>
                    index === self.findIndex(c => c.slug === cat.slug)
                  )
                  .map(category => (
                    <button
                      key={category.slug}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={cn(
                        'cyber-filter-button',
                        selectedCategory === category.slug && 'active'
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 文章列表 */}
      {layout === 'grid' || layout === 'magazine' ? (
        <BlogGrid
          posts={filteredPosts}
          columns={columns}
          variant={variant}
          showStats={showStats}
        />
      ) : (
        <div className="cyber-blog-list space-y-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BlogCard
                {...post}
                variant={variant}
                showStats={showStats}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {showPagination && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cyber-pagination flex justify-center items-center gap-2"
        >
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="cyber-pagination-button"
            aria-label="上一页"
          >
            ←
          </button>

          <div className="cyber-pagination-numbers flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={cn(
                  'cyber-pagination-number',
                  currentPage === page && 'active'
                )}
                aria-label={`第 ${page} 页`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cyber-pagination-button"
            aria-label="下一页"
          >
            →
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BlogListEnhanced;
