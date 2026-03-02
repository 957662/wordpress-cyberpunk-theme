/**
 * PostList Component
 * 文章列表组件
 */

'use client';

import { PostCard } from './PostCard';
import type { Post } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PostListProps {
  posts?: Post[];
  loading?: boolean;
  error?: Error | null;
  columns?: 1 | 2 | 3;
}

export function PostList({
  posts = [],
  loading = false,
  error = null,
  columns = 3,
}: PostListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">加载失败</p>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">暂无文章</p>
      </div>
    );
  }

  const gridColumns = {
    1: 'grid-cols-1 max-w-3xl mx-auto',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={`grid gap-8 ${gridColumns[columns]}`}>
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}

export default PostList;
