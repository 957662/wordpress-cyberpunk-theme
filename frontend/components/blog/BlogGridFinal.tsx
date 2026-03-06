/**
 * BlogGrid 组件 - 最终版本
 * 以网格布局展示博客文章
 */

'use client';

import { motion } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import { Post } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlogGridProps {
  posts: Post[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'masonry' | 'compact';
  className?: string;
}

export function BlogGrid({
  posts,
  columns = 3,
  gap = 'md',
  variant = 'default',
  className,
}: BlogGridProps) {
  const gapStyles = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'grid',
        gridCols[columns],
        gapStyles[gap],
        className
      )}
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ArticleCard
            post={post}
            variant={variant === 'compact' ? 'compact' : 'default'}
            showExcerpt={variant !== 'compact'}
            showMeta
            showCategory
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default BlogGrid;
