/**
 * Blog Page Client Component
 *
 * Client-side blog listing with data fetching and state management
 */

'use client';

import React from 'react';
import { usePosts } from '@/hooks/use-posts';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Pagination } from '@/components/blog/Pagination';
import { LoadingSpinner } from '@/components/blog/LoadingSpinner';
import { EmptyState } from '@/components/blog/EmptyState';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function BlogPageClient() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const categorySlug = searchParams.get('category');
  const tagSlug = searchParams.get('tag');
  const searchQuery = searchParams.get('search');

  const [searchInput, setSearchInput] = useState(searchQuery || '');

  // Fetch posts with filters
  const { data, isLoading, error, refetch } = usePosts({
    page: currentPage,
    per_page: 12,
    category: categorySlug,
    tag: tagSlug,
    search: searchQuery,
  });

  const posts = data?.items || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  // Handle search
  const handleSearch = (query: string) => {
    setSearchInput(query);
    // Update URL would be handled by the parent component
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <BlogHero
        title="Blog"
        description="Explore our latest articles, tutorials, and insights"
        subtitle="Technology • Development • Design"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6">
          <BlogSearch
            initialValue={searchInput}
            onSearch={handleSearch}
            placeholder="Search articles..."
          />
          <CategoryFilter />
        </div>

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner
            message="Loading posts..."
            className="min-h-[400px] flex items-center justify-center"
          />
        )}

        {/* Error State */}
        {error && (
          <EmptyState
            title="Failed to load posts"
            description={error.message || 'An error occurred while loading posts'}
            action={{
              label: 'Try Again',
              onClick: () => refetch(),
            }}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && posts.length === 0 && (
          <EmptyState
            title="No posts found"
            description="Try adjusting your filters or search query"
            action={
              searchQuery || categorySlug || tagSlug
                ? {
                    label: 'Clear Filters',
                    onClick: () => {
                      window.location.href = '/blog';
                    },
                  }
                : undefined
            }
          />
        )}

        {/* Posts Grid */}
        {!isLoading && !error && posts.length > 0 && (
          <>
            <div className="mb-8">
              <p className="text-cyber-cyan text-sm">
                Showing {posts.length} of {totalItems} posts
              </p>
            </div>

            <BlogGrid
              posts={posts}
              columns={3}
              showAuthor={true}
              showDate={true}
              showCategories={true}
              showReadingTime={true}
              className="mb-12"
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/blog"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BlogPageClient;
