/**
 * BlogGrid 组件 - 完整版本
 */

'use client';

import { motion } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import { Post } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlogGridProps {
  posts: Post[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function BlogGrid({ posts, columns = 3, className }: BlogGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('grid', gridCols[columns], 'gap-6', className)}
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5 }}
        >
          <ArticleCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default BlogGrid;
