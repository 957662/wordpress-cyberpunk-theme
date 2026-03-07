/**
 * Blog List Page - WordPress Integration
 *
 * 完整的博客列表页，集成 WordPress API
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogCardAdaptive } from '@/components/blog/BlogCardAdaptive';
import { Pagination } from '@/components/blog/Pagination';
import { LoadingSpinner } from '@/components/blog/LoadingSpinner';
import { EmptyState } from '@/components/blog/EmptyState';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { SearchBar } from '@/components/blog/SearchBar';
import { usePosts, useCategories } from '@/lib/wordpress/react-hooks';
import { cn } from '@/lib/utils';

const POSTS_PER_PAGE = 12;

export default function BlogPageIntegrated() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 获取分类列表
  const { data: categories, isLoading: categoriesLoading } = useCategories({
    hide_empty: true,
    per_page: 100,
  });

  // 获取文章列表
  const { data: posts, isLoading: postsLoading, error } = usePosts(
    {
      page: currentPage,
      per_page: POSTS_PER_PAGE,
      categories: selectedCategory ? [selectedCategory] : undefined,
      search: searchQuery || undefined,
      orderby: 'date',
      order: 'desc',
    },
    {
      enabled: !categoriesLoading,
    }
  );

  // 当分类或搜索改变时，重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // 处理分类选择
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-muted to-cyber-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-cyber-cyan/20">
        <div className="absolute inset-0 bg-grid-cyber opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-6">
              博客文章
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              探索最新的技术文章、教程和见解
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-cyber-cyan mb-4">搜索文章</h3>
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="输入关键词搜索..."
                />
              </div>

              {/* Categories */}
              <div className="cyber-card p-6 mt-6">
                <h3 className="text-lg font-semibold text-cyber-cyan mb-4">分类</h3>
                <CategoryFilter
                  categories={categories || []}
                  selectedCategoryId={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                  loading={categoriesLoading}
                />
              </div>
            </motion.div>
          </aside>

          {/* Blog Posts */}
          <main className="lg:col-span-3">
            {postsLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <div className="cyber-card p-8 text-center">
                <p className="text-cyber-pink">加载失败，请稍后重试</p>
              </div>
            ) : !posts || posts.length === 0 ? (
              <EmptyState
                title="没有找到文章"
                description={searchQuery ? '尝试使用其他关键词搜索' : '还没有发布任何文章'}
                action={
                  searchQuery
                    ? {
                        label: '清除搜索',
                        onClick: () => setSearchQuery(''),
                      }
                    : undefined
                }
              />
            ) : (
              <>
                {/* Posts Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
                >
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BlogCardAdaptive
                        post={{
                          id: String(post.id),
                          title: post.title.rendered,
                          excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
                          slug: post.slug,
                          featuredImage: post.featured_media
                            ? String(post.featured_media)
                            : undefined,
                          date: post.date,
                          author: {
                            id: post.author,
                            name: '作者',
                          },
                          categories: post.categories.map(catId => ({
                            id: catId,
                            name: categories?.find(c => c.id === catId)?.name || '',
                            slug: '',
                            description: '',
                            count: 0,
                            link: '',
                          })),
                          link: post.link,
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {posts && posts.length >= POSTS_PER_PAGE && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil((posts?.length || 0) / POSTS_PER_PAGE)}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
