'use client';

import React from 'react';
import { BlogCard } from './BlogCard';
import { motion } from 'framer-motion';
import { BlogCardProps } from './BlogCard';

export interface BlogGridProps {
  posts: BlogCardProps[];
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'featured' | 'grid';
  showStats?: boolean;
  className?: string;
}

export const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  columns = 3,
  variant = 'grid',
  showStats = true,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  if (posts.length === 0) {
    return (
      <div className="cyber-empty-state">
        <div className="text-center space-y-4">
          <div className="text-6xl">📝</div>
          <h3 className="text-xl font-bold text-cyber-cyan">暂无文章</h3>
          <p className="text-cyber-muted">还没有发布任何文章，敬请期待！</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${gridCols[columns]} gap-6 ${className}`}
    >
      {posts.map((post, index) => (
        <motion.div key={post.id} variants={itemVariants}>
          <BlogCard
            {...post}
            variant={variant}
            showStats={showStats}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BlogGrid;
