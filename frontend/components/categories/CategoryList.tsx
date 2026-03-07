'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import { CategoryCard } from './CategoryCard';

interface CategoryListProps {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    description?: string;
    posts_count?: number;
    color?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  columns = 3,
  gap = 'md',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">暂无分类</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} ${gapClasses[gap]}`}>
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <CategoryCard category={category} index={index} />
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryList;
