/**
 * WordPress Integration Example Component
 *
 * 展示如何使用 WordPress 集成的完整示例
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogCardAdaptive } from '@/components/blog/BlogCardAdaptive';
import { LoadingSpinner } from '@/components/blog/LoadingSpinner';
import { EmptyState } from '@/components/blog/EmptyState';
import { usePosts, useCategories, useLatestPosts, useFeaturedPosts } from '@/lib/wordpress/react-hooks';
import { PostService, CategoryService } from '@/services/wordpress-service';
import { cn } from '@/lib/utils';

export function WordPressIntegrationExample() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 使用 hooks 获取数据
  const { data: categories, isLoading: categoriesLoading } = useCategories({
    hide_empty: true,
    per_page: 20,
  });

  const { data: posts, isLoading: postsLoading, error } = usePosts(
    {
      per_page: 6,
      categories: selectedCategory ? [selectedCategory] : undefined,
      search: searchQuery || undefined,
      orderby: 'date',
      order: 'desc',
    },
    {
      enabled: !categoriesLoading,
    }
  );

  const { data: latestPosts } = useLatestPosts(3);
  const { data: featuredPosts } = useFeaturedPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-muted to-cyber-dark p-8">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-4">
            WordPress 集成示例
          </h1>
          <p className="text-gray-400 text-lg">
            展示如何使用 WordPress API 获取和展示数据
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-cyber-cyan mb-4">分类筛选</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-lg transition-all duration-300',
                  selectedCategory === null
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'bg-cyber-muted text-gray-300 hover:bg-cyber-purple/20'
                )}
              >
                全部
              </button>
              {categories?.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-all duration-300',
                    selectedCategory === category.id
                      ? 'bg-cyber-cyan text-cyber-dark'
                      : 'bg-cyber-muted text-gray-300 hover:bg-cyber-purple/20'
                  )}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="cyber-card p-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章..."
              className="w-full bg-cyber-muted border border-cyber-cyan/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts && featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-cyber-cyan mb-6">精选文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
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
            </div>
          </motion.div>
        )}

        {/* Latest Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-cyber-cyan mb-6">最新文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts?.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
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
          </div>
        </motion.div>

        {/* Main Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-cyber-cyan mb-6">
            {selectedCategory
              ? `分类: ${categories?.find(c => c.id === selectedCategory)?.name}`
              : searchQuery
              ? `搜索: ${searchQuery}`
              : '所有文章'}
          </h2>

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
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
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
            </div>
          )}
        </motion.div>

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="cyber-card p-8">
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4">使用说明</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                1. 在 <code className="bg-cyber-muted px-2 py-1 rounded">.env.local</code> 中配置 WordPress URL:
              </p>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto">
                <code>{`NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com`}</code>
              </pre>
              <p>
                2. 使用 React Hooks 获取数据:
              </p>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto">
                <code>{`import { usePosts, useCategories } from '@/lib/wordpress/react-hooks';

function MyComponent() {
  const { data: posts, isLoading } = usePosts();
  const { data: categories } = useCategories();

  // ...
}`}</code>
              </pre>
              <p>
                3. 或使用服务层:
              </p>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto">
                <code>{`import { PostService } from '@/services/wordpress-service';

const posts = await PostService.getPosts({ per_page: 10 });`}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WordPressIntegrationExample;
