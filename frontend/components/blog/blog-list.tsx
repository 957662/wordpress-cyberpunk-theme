'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogCard, BlogCardSkeleton, BlogPost } from './blog-card';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogListProps {
  posts?: BlogPost[];
  loading?: boolean;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'latest' | 'popular' | 'trending';

export function BlogList({ posts = [], loading = false, className }: BlogListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract unique categories and tags
  const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean)));
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => {
      if (selectedCategory && post.category !== selectedCategory) return false;
      if (selectedTags.length > 0) {
        const postTags = post.tags || [];
        if (!selectedTags.every((tag) => postTags.includes(tag))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'trending':
          return (b.likes || 0) - (a.likes || 0);
        case 'latest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-cyber-dark/60 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-cyber-dark/60 rounded animate-pulse" />
            <div className="h-10 w-10 bg-cyber-dark/60 rounded animate-pulse" />
          </div>
        </div>
        <div className={cn(
          'grid gap-6',
          viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        )}>
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-gray-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            {selectedCategory && ` in ${selectedCategory}`}
            {selectedTags.length > 0 && ` tagged with ${selectedTags.join(', ')}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-cyber-dark/60 border border-cyber-cyan/30 rounded-lg p-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'grid' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-gray-400 hover:text-white'
              )}
            >
              <Grid size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'list' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-gray-400 hover:text-white'
              )}
            >
              <List size={20} />
            </motion.button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="appearance-none bg-cyber-dark/60 border border-cyber-cyan/30 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-cyber-cyan cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Viewed</option>
              <option value="trending">Trending</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-cyber-dark/60 border border-cyber-cyan/30 rounded-lg p-4 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Filter size={20} className="text-cyber-cyan" />
              Categories
            </h3>

            <div className="space-y-2">
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                  !selectedCategory
                    ? 'bg-cyber-cyan/20 text-cyber-cyan font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-cyber-dark/80'
                )}
              >
                All Posts
              </motion.button>

              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                    selectedCategory === category
                      ? 'bg-cyber-cyan/20 text-cyber-cyan font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-cyber-dark/80'
                  )}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        'px-2 py-1 text-xs rounded-full border transition-all',
                        selectedTags.includes(tag)
                          ? 'bg-cyber-purple text-white border-cyber-purple'
                          : 'bg-transparent text-gray-400 border-cyber-cyan/30 hover:border-cyber-cyan hover:text-cyber-cyan'
                      )}
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Posts Grid */}
        <div className="flex-1">
          {filteredPosts.length > 0 ? (
            <div
              className={cn(
                'grid gap-6',
                viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
              )}
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BlogCard post={post} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search size={64} className="mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Paginated Blog List
interface PaginatedBlogListProps extends BlogListProps {
  itemsPerPage?: number;
}

export function PaginatedBlogList({
  posts = [],
  loading = false,
  itemsPerPage = 9,
  className,
}: PaginatedBlogListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={className}>
      <BlogList posts={currentPosts} loading={loading} />

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'px-4 py-2 rounded-lg border transition-colors',
              currentPage === 1
                ? 'border-cyber-cyan/20 text-gray-600 cursor-not-allowed'
                : 'border-cyber-cyan/30 text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/10'
            )}
          >
            Previous
          </motion.button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isCurrentPage = page === currentPage;
            const isNearCurrentPage = Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;

            if (!isNearCurrentPage && page !== 1 && page !== totalPages) {
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(page)}
                className={cn(
                  'w-10 h-10 rounded-lg border font-semibold transition-colors',
                  isCurrentPage
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple border-transparent text-white'
                    : 'border-cyber-cyan/30 text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
                )}
              >
                {page}
              </motion.button>
            );
          })}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'px-4 py-2 rounded-lg border transition-colors',
              currentPage === totalPages
                ? 'border-cyber-cyan/20 text-gray-600 cursor-not-allowed'
                : 'border-cyber-cyan/30 text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/10'
            )}
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  );
}
