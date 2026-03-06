/**
 * Blog Index Page
 *
 * Main blog listing page with grid layout.
 * Displays all blog posts with pagination and filtering.
 */

import React from 'react';
import { Metadata } from 'next';
import { BlogGrid } from '@/components/blog';
import { BlogHero } from '@/components/blog/BlogHero';
import { usePosts } from '@/hooks/api/use-posts';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = {
  title: 'Blog - CyberPress Platform',
  description: 'Latest articles, tutorials, and insights about web development, design, and technology.',
  keywords: ['blog', 'articles', 'tutorials', 'web development', 'design'],
});

export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; tag?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const category = searchParams.category;
  const tag = searchParams.tag;

  const { posts, loading, error, totalPages, totalItems } = usePosts({
    page,
    perPage: 12,
    category,
    tag,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <BlogHero
        title="Blog"
        description="Explore our latest articles, tutorials, and insights"
        backgroundImage="/images/blog-hero.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                <LoadingSkeleton className="h-48 w-full" variant="rectangular" />
                <div className="p-6">
                  <LoadingSkeleton className="h-6 w-3/4 mb-3" />
                  <LoadingSkeleton className="h-4 w-full mb-2" />
                  <LoadingSkeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <EmptyState
            title="Failed to load posts"
            description={error.message}
            action={{
              label: 'Try Again',
              onClick: () => window.location.reload(),
            }}
          />
        )}

        {/* Posts Grid */}
        {!loading && !error && (
          <>
            <BlogGrid
              posts={posts}
              columns={3}
              showAuthor={true}
              showDate={true}
              showCategories={true}
            />
          </>
        )}
      </div>
    </div>
  );
}
