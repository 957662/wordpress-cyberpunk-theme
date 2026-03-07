'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Check, ChevronDown, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    posts_count?: number;
  }>;
  selectedCategory?: string | null;
  onCategorySelect?: (slug: string | null) => void;
  layout?: 'dropdown' | 'list' | 'grid';
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  layout = 'list',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (slug: string) => {
    if (selectedCategory === slug) {
      onCategorySelect?.(null);
    } else {
      onCategorySelect?.(slug);
    }
  };

  const selectedCat = categories.find(c => c.slug === selectedCategory);

  if (layout === 'dropdown') {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-violet-500 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-violet-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedCat?.name || '所有分类'}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => {
                  onCategorySelect?.(null);
                  setIsExpanded(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FolderOpen className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">所有分类</span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    handleSelect(category.slug);
                    setIsExpanded(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-violet-500" />
                    <span className="text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  {category.posts_count !== undefined && (
                    <span className="text-sm text-gray-500">
                      {category.posts_count}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategorySelect?.(null)}
          className={`
            flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
            ${
              !selectedCategory
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
            }
          `}
        >
          <FolderOpen className="w-6 h-6 text-violet-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            全部
          </span>
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(category.slug)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
              ${
                selectedCategory === category.slug
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
              }
            `}
          >
            <FolderOpen className="w-6 h-6 text-violet-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {category.name}
            </span>
            {category.posts_count !== undefined && (
              <span className="text-xs text-gray-500">
                {category.posts_count}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  // Default: list layout
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            分类筛选
          </h3>
        </div>

        {selectedCategory && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onCategorySelect?.(null)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
            清空
          </motion.button>
        )}
      </div>

      <div className="space-y-2">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => onCategorySelect?.(null)}
          className={`
            w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
            ${
              !selectedCategory
                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">所有分类</span>
          </div>
          {!selectedCategory && <Check className="w-5 h-5" />}
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ x: 4 }}
            onClick={() => handleSelect(category.slug)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
              ${
                selectedCategory === category.slug
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {category.posts_count !== undefined && (
                <span className={`text-sm ${
                  selectedCategory === category.slug ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {category.posts_count}
                </span>
              )}
              {selectedCategory === category.slug && <Check className="w-5 h-5" />}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
