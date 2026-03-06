'use client';

import React from 'react';
import { ArticleCardEnhanced } from './ArticleCardEnhanced';

export interface BlogGridEnhancedProps {
  posts: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string;
    author: {
      id: number;
      username: string;
      fullName?: string;
      avatarUrl?: string;
    };
    category?: {
      id: number;
      name: string;
      slug: string;
    };
    tags?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    viewCount: number;
    commentCount: number;
    likeCount?: number;
    createdAt: string;
    isFeatured?: boolean;
  }>;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  showFeatured?: boolean;
}

export function BlogGridEnhanced({
  posts,
  columns = 3,
  gap = 'md',
  showFeatured = false
}: BlogGridEnhancedProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  // 分离精选文章和普通文章
  const featuredPosts = showFeatured ? posts.filter(p => p.isFeatured) : [];
  const regularPosts = showFeatured ? posts.filter(p => !p.isFeatured) : posts;

  return (
    <div className="space-y-8">
      {/* 精选文章区域 */}
      {showFeatured && featuredPosts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Featured Posts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <ArticleCardEnhanced
                key={post.id}
                {...post}
                layout="detailed"
              />
            ))}
          </div>
        </div>
      )}

      {/* 普通文章网格 */}
      <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]}`}>
        {regularPosts.map((post) => (
          <ArticleCardEnhanced
            key={post.id}
            {...post}
            layout="default"
          />
        ))}
      </div>

      {/* 如果没有文章 */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts available</p>
        </div>
      )}
    </div>
  );
}

export default BlogGridEnhanced;
