'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderOpen, TrendingUp } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    slug: string;
    description?: string;
    posts_count?: number;
    color?: string;
  };
  index?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0 }) => {
  const defaultColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-indigo-500 to-purple-500',
    'from-rose-500 to-orange-500',
  ];

  const colorClass = category.color || defaultColors[index % defaultColors.length];

  return (
    <Link href={`/categories/${category.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-90`} />

        <div className="relative p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <FolderOpen className="w-6 h-6" />
            </div>

            {category.posts_count !== undefined && category.posts_count > 0 && (
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{category.posts_count}</span>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2 line-clamp-1">{category.name}</h3>

          {category.description && (
            <p className="text-white/90 text-sm line-clamp-2 mb-4">
              {category.description}
            </p>
          )}

          <div className="flex items-center text-sm text-white/80 group-hover:text-white transition-colors">
            <span>浏览文章</span>
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
