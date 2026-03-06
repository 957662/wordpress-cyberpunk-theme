'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { LoadingState } from '@/components/blog/LoadingState';
import type { BlogPost } from '@/types/models/blog';

interface BlogPageClientProps {
  initialPosts: BlogPost[];
  initialPage: number;
  initialTotalPages: number;
  initialTotalItems: number;
}

export function BlogPageClient({
  initialPosts,
  initialPage,
  initialTotalPages,
  initialTotalItems,
}: BlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = React.useState<BlogPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [totalPages, setTotalPages] = React.useState(initialTotalPages);
  const [totalItems, setTotalItems] = React.useState(initialTotalItems);
  const [loading, setLoading] = React.useState(false);

  const handlePageChange = async (page: number) => {
    setLoading(true);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);

    // Fetch new data
    try {
      const response = await fetch(`/api/posts?page=${page}&${params.toString()}`);
      const data = await response.json();

      setPosts(data.posts);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <BlogGrid
      posts={posts}
      columns={3}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={handlePageChange}
    />
  );
}
