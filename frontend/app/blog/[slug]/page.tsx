/**
 * Blog Post Detail Page
 *
 * Single blog post page with full content display.
 * Includes related posts, comments, and social sharing.
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetail } from '@/components/blog/ArticleDetail';
import { ArticleHeader } from '@/components/blog/ArticleHeader';
import { ArticleFooter } from '@/components/blog/ArticleFooter';
import { usePost } from '@/hooks/api/use-posts';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { post } = await usePost(params.slug);

    return {
      title: `${post.title} - CyberPress Platform`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
        type: 'article',
        publishedTime: post.date,
        authors: post.author?.name ? [post.author.name] : [],
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { post, loading, error } = usePost(params.slug);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSkeleton className="h-8 w-3/4 mb-4" variant="text" />
          <LoadingSkeleton className="h-4 w-full mb-2" variant="text" />
          <LoadingSkeleton className="h-4 w-2/3 mb-8" variant="text" />
          <LoadingSkeleton className="h-64 w-full mb-4" variant="rectangular" />
          <LoadingSkeleton className="h-4 w-full mb-2" variant="text" />
          <LoadingSkeleton className="h-4 w-full mb-2" variant="text" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            title="Post not found"
            description="The article you're looking for doesn't exist or has been removed."
            action={{
              label: 'Back to Blog',
              onClick: () => window.location.href = '/blog',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Article Header */}
      <ArticleHeader post={post} />

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArticleDetail post={post} />
      </div>

      {/* Article Footer */}
      <ArticleFooter post={post} />
    </article>
  );
}

// Generate static params for static generation
export async function generateStaticParams() {
  // This would typically fetch from your API
  // For now, return empty array to use SSR
  return [];
}
