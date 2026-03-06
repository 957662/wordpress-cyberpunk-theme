/**
 * Blog Index Page - Server Component Version
 *
 * This is a server component that fetches data at build time or request time.
 * It provides better performance and SEO than client-side data fetching.
 */

import React from 'react';
import { Metadata } from 'next';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogHero } from '@/components/blog/BlogHero';
import { getPosts } from '@/lib/data/posts';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = {
  title: 'Blog - CyberPress Platform',
  description: 'Latest articles, tutorials, and insights about web development, design, and technology.',
  keywords: ['blog', 'articles', 'tutorials', 'web development', 'design'],
};

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const category = searchParams.category;
  const tag = searchParams.tag;

  try {
    // Fetch posts on the server
    const { posts, pagination } = await getPosts({
      page,
      perPage: 12,
      category,
      tag,
      orderby: 'date',
      order: 'desc',
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
          {/* Posts Grid */}
          {posts.length > 0 ? (
            <BlogGrid
              posts={posts}
              columns={3}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={(newPage) => {
                // This will be handled by URL params in the parent component
                // For now, we'll use Link components for navigation
                const url = new URL(window.location.href);
                url.searchParams.set('page', newPage.toString());
                window.location.href = url.toString();
              }}
            />
          ) : (
            <EmptyState
              title="暂无文章"
              description="没有找到符合条件的文章"
              action={{
                label: '返回首页',
                onClick: () => (window.location.href = '/blog'),
              }}
            />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog page:', error);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BlogHero
          title="Blog"
          description="Explore our latest articles, tutorials, and insights"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            title="加载失败"
            description="无法加载文章，请稍后重试"
            action={{
              label: '重试',
              onClick: () => window.location.reload(),
            }}
          />
        </div>
      </div>
    );
  }
}

// ============================================================================
// Generate Static Params (Optional - for static generation)
// ============================================================================

// export async function generateStaticParams() {
//   const { posts } = await getPosts({ perPage: 100 });
//   const pages = Math.ceil(posts.length / 12);

//   return Array.from({ length: pages }, (_, i) => ({
//     page: (i + 1).toString(),
//   }));
// }

// ============================================================================
// Revalidation (Optional - for ISR)
// ============================================================================

// export const revalidate = 3600; // Revalidate every hour
