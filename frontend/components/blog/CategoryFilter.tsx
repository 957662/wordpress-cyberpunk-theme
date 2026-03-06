/**
 * 分类筛选组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/models/blog';

// ============================================================================
// Types
// ============================================================================

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string | null;
  onSelectCategory: (slug: string | null) => void;
  className?: string;
}

// ============================================================================
// Components
// ============================================================================

/**
 * 分类筛选器组件
 */
export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* 全部选项 */}
      <motion.button
        key="all"
        onClick={() => onSelectCategory(null)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
          selectedCategory === null
            ? 'bg-cyber-cyan text-black shadow-lg shadow-cyber-cyan/20'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        全部
      </motion.button>

      {/* 分类选项 */}
      {categories.map(category => (
        <motion.button
          key={category.id}
          onClick={() => onSelectCategory(category.slug)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
            selectedCategory === category.slug
              ? 'bg-cyber-cyan text-black shadow-lg shadow-cyber-cyan/20'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.name}
          <span className="text-xs opacity-60">({category.count})</span>
        </motion.button>
      ))}

      {/* 清除按钮 */}
      {selectedCategory && (
        <motion.button
          onClick={() => onSelectCategory(null)}
          className="inline-flex items-center gap-1 rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
}

/**
 * 分类标签云
 */
export function CategoryCloud({
  categories,
  selectedCategory,
  onSelectCategory,
  maxCount = 10,
  className,
}: {
  categories: Category[];
  selectedCategory?: string | null;
  onSelectCategory: (slug: string | null) => void;
  maxCount?: number;
  className?: string;
}) {
  // 按文章数量排序,取前N个
  const sortedCategories = [...categories]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, maxCount);

  // 计算相对大小 (基于最大数量)
  const maxCountValue = Math.max(...sortedCategories.map(c => c.count || 0));

  const getSizeClass = (count: number) => {
    const ratio = count / maxCountValue;
    if (ratio > 0.7) return 'text-lg';
    if (ratio > 0.4) return 'text-base';
    return 'text-sm';
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {sortedCategories.map(category => (
        <motion.button
          key={category.id}
          onClick={() => onSelectCategory(
            selectedCategory === category.slug ? null : category.slug
          )}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-all',
            selectedCategory === category.slug
              ? 'bg-cyber-cyan text-black shadow-lg'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300',
            getSizeClass(category.count || 0)
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.name}
          <span className="text-xs opacity-60">({category.count})</span>
        </motion.button>
      ))}
    </div>
  );
}

/**
 * 分类下拉选择器
 */
export function CategorySelect({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: {
  categories: Category[];
  selectedCategory?: string | null;
  onSelectCategory: (slug: string | null) => void;
  className?: string;
}) {
  return (
    <select
      value={selectedCategory || ''}
      onChange={(e) => onSelectCategory(e.target.value || null)}
      className={cn(
        'rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 outline-none',
        'focus:ring-2 focus:ring-cyber-cyan',
        className
      )}
    >
      <option value="">全部分类</option>
      {categories.map(category => (
        <option key={category.id} value={category.slug}>
          {category.name} ({category.count})
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;
