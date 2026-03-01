'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface Category {
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

export interface CategoryListProps {
  categories: Category[];
  selectedCategory?: string;
  className?: string;
  variant?: 'list' | 'grid' | 'inline';
}

const icons = {
  tech: '💻',
  design: '🎨',
  life: '🌱',
  tutorial: '📚',
  news: '📰',
  review: '✨',
};

export function CategoryList({
  categories,
  selectedCategory,
  className,
  variant = 'list',
}: CategoryListProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.slug;
          const icon = icons[category.slug as keyof typeof icons] || '📁';

          return (
            <Link key={category.slug} href={`/blog?category=${category.slug}`}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'p-4 rounded-lg border transition-all duration-300',
                  isSelected
                    ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-neon-cyan'
                    : 'bg-cyber-muted border-cyber-border hover:border-cyber-cyan hover:bg-cyber-cyan/5'
                )}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <h3 className="font-medium text-white mb-1">{category.name}</h3>
                {category.description && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{category.description}</p>
                )}
                {category.count !== undefined && (
                  <p className="text-xs text-gray-500">{category.count} 篇文章</p>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.slug;

          return (
            <Link key={category.slug} href={`/blog?category=${category.slug}`}>
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-all',
                  isSelected
                    ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan'
                    : 'bg-cyber-muted text-gray-400 border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan'
                )}
              >
                {isSelected ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
                <span>{category.name}</span>
                {category.count !== undefined && (
                  <span className="text-xs opacity-60">({category.count})</span>
                )}
              </motion.span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {categories.map((category) => {
        const isSelected = selectedCategory === category.slug;

        return (
          <Link key={category.slug} href={`/blog?category=${category.slug}`}>
            <motion.div
              whileHover={{ x: 4 }}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border transition-all',
                isSelected
                  ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan'
                  : 'bg-cyber-muted text-gray-400 border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan'
              )}
            >
              <div className="flex items-center gap-3">
                {isSelected ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                <span className="font-medium">{category.name}</span>
              </div>
              {category.count !== undefined && (
                <span className="text-sm opacity-60">{category.count}</span>
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

export default CategoryList;
