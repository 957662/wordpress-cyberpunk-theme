'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CategoryCard from './CategoryCard';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  posts_count?: number;
  color?: string;
}

interface CategoryGridProps {
  categories: Category[];
  columns?: 2 | 3 | 4;
  showDescription?: boolean;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  columns = 3,
  showDescription = true,
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          index={index}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
