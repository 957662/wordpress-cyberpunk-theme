'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PostCard, PostCardProps } from './PostCard';
import { cn } from '@/lib/utils/cn';

export interface PostGridProps {
  posts: PostCardProps[];
  layout?: 'grid' | 'masonry' | 'list';
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
  featured?: boolean;
  className?: string;
}

const layoutStyles = {
  grid: 'grid',
  masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6',
  list: 'flex flex-col gap-6',
};

const columnsStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function PostGrid({
  posts,
  layout = 'grid',
  columns = 3,
  gap = 6,
  featured = false,
  className,
}: PostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">暂无文章</p>
      </div>
    );
  }

  const gridClasses =
    layout === 'masonry'
      ? layoutStyles.masonry
      : layout === 'list'
      ? layoutStyles.list
      : cn('grid', columnsStyles[columns]);

  const gapStyle = layout === 'list' ? '' : `gap-${gap}`;

  return (
    <div className={cn(gridClasses, gapStyle, className)}>
      {posts.map((post, index) => {
        const isFeatured = featured && index === 0;
        const postVariant = isFeatured ? 'featured' : layout === 'list' ? 'compact' : 'default';

        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={layout === 'masonry' ? 'break-inside-avoid mb-6' : ''}
          >
            <PostCard {...post} variant={postVariant as any} />
          </motion.div>
        );
      })}
    </div>
  );
}

export default PostGrid;
