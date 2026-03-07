/**
 * Blog List Page
 *
 * Main blog listing page with pagination, filtering, and search
 */

'use client';

import { useState } from 'react';
import { usePosts, useCategories, useTags } from '@/hooks/use-wordpress';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogList } from '@/components/blog/BlogList';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Pagination } from '@/components/blog/Pagination';
import { EmptyState } from '@/components/blog/EmptyState';
import { LoadingSpinner } from '@/components/blog/LoadingSpinner';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogStats } from '@/components/blog/BlogStats';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [postsPerPage] = useState(12);

  // Fetch categories and tags for filters
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(
    { per_page: 100 },
    { enabled: true }
  );

  const { data: tags = [], isLoading: tagsLoading } = useTags(
    { per_page: 100 },
    { enabled: true }
  );

  // Fetch posts with filters
  const {
    data: posts = [],
    isLoading,
    error,
  } = usePosts(
    {
      page,
      per_page: postsPerPage,
      categories: selectedCategory ? [parseInt(selectedCategory)] : undefined,
      tags: selectedTag ? [parseInt(selectedTag)] : undefined,
      search: searchQuery || undefined,
    },
    { enabled: true }
  );

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSelectedTag('');
    setPage(1);
  };

  // Handle tag change
  const handleTagChange = (tagSlug: string) => {
    setSelectedTag(tagSlug);
    setSelectedCategory('');
    setPage(1);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearchQuery('');
    setPage(1);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" color="cyan" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          type="error"
          title="Failed to Load Posts"
          description="There was an error loading the blog posts. Please try again later."
          action={{
            label: 'Retry',
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <BlogHero
        title="Blog"
        description="Explore the latest insights, tutorials, and updates from the cyberpunk world"
      />

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 mb-8">
        <BlogStats
          stats={{
            totalPosts: posts.length,
            totalCategories: categories.length,
            totalTags: tags.length,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div className="cyber-card p-6">
              <h3 className="text-lg font-bold text-cyber-cyan mb-4">Search</h3>
              <BlogSearch
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search posts..."
              />
            </div>

            {/* Categories */}
            <div className="cyber-card p-6">
              <h3 className="text-lg font-bold text-cyber-cyan mb-4">Categories</h3>
              <CategoryFilter
                categories={categories.map(cat => ({
                  id: cat.id,
                  name: cat.name,
                  slug: cat.slug,
                  count: cat.count,
                }))}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                variant="list"
              />
            </div>

            {/* Tags */}
            {!tagsLoading && tags.length > 0 && (
              <div className="cyber-card p-6">
                <h3 className="text-lg font-bold text-cyber-cyan mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 20).map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagChange(tag.slug)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTag === tag.slug
                          ? 'bg-cyber-cyan text-cyber-dark'
                          : 'bg-cyber-muted text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Posts Section */}
          <main className="lg:col-span-3">
            {/* View Toggle & Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid'
                      ? 'bg-cyber-cyan text-cyber-dark'
                      : 'bg-cyber-muted text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark'
                  }`}
                  aria-label="Grid view"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list'
                      ? 'bg-cyber-cyan text-cyber-dark'
                      : 'bg-cyber-muted text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark'
                  }`}
                  aria-label="List view"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Active Filters Display */}
              {(selectedCategory || selectedTag || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-cyber-pink text-white rounded hover:bg-cyber-pink/80 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <EmptyState
                type="no-results"
                title="No Posts Found"
                description={
                  searchQuery
                    ? `No posts matching "${searchQuery}" found.`
                    : selectedCategory
                    ? 'No posts in this category yet.'
                    : selectedTag
                    ? 'No posts with this tag yet.'
                    : 'No posts published yet.'
                }
                action={
                  searchQuery || selectedCategory || selectedTag
                    ? { label: 'Clear Filters', onClick: clearFilters }
                    : undefined
                }
              />
            ) : viewMode === 'grid' ? (
              <BlogGrid
                posts={posts}
                columns={{
                  sm: 1,
                  md: 2,
                  lg: 3,
                }}
                gap={6}
              />
            ) : (
              <BlogList
                posts={posts}
                variant="default"
                showDivider
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  maxVisiblePages={7}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
