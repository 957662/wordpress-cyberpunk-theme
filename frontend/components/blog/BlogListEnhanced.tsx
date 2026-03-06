'use client';

import React, { useState, useEffect } from 'react';
import { usePosts } from '@/hooks/use-posts';
import { ArticleCardEnhanced } from './ArticleCardEnhanced';
import { PaginationEnhanced } from './PaginationEnhanced';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Grid, List } from 'lucide-react';

export interface BlogListEnhancedProps {
  categoryId?: number;
  tagId?: number;
  authorId?: number;
  searchQuery?: string;
  initialLimit?: number;
}

export function BlogListEnhanced({
  categoryId,
  tagId,
  authorId,
  searchQuery,
  initialLimit = 12
}: BlogListEnhancedProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    posts,
    total,
    isLoading,
    error,
    refetch
  } = usePosts({
    skip: (page - 1) * limit,
    limit,
    categoryId,
    tagId,
    authorId,
    search: searchQuery,
    sortBy,
    sortOrder
  });

  const totalPages = Math.ceil(total / limit);

  // 重置页码当筛选条件变化
  useEffect(() => {
    setPage(1);
  }, [categoryId, tagId, authorId, searchQuery, sortBy, sortOrder, limit]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">Failed to load posts</div>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Latest</SelectItem>
              <SelectItem value="view_count">Most Viewed</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="updated_at">Recently Updated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'asc' | 'desc')}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 文章列表 */}
      {isLoading ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found</p>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {posts.map((post) => (
            <ArticleCardEnhanced
              key={post.id}
              {...post}
              layout={viewMode === 'list' ? 'compact' : 'default'}
            />
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationEnhanced
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {posts.length} of {total} posts
      </div>
    </div>
  );
}

export default BlogListEnhanced;
