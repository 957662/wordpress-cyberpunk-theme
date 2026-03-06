'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FolderOpen, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  children?: Category[];
}

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect?: (slug: string) => void;
  layout?: 'list' | 'grid' | 'dropdown';
  showCount?: boolean;
  showDescription?: boolean;
  collapsible?: boolean;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
  layout = 'list',
  showCount = true,
  showDescription = false,
  collapsible = false,
  className,
}: CategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = React.useState(!collapsible);

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const renderCategory = (category: Category, depth: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.slug);
    const isSelected = selectedCategory === category.slug;

    const content = (
      <>
        <motion.button
          onClick={() => {
            if (onCategorySelect) {
              onCategorySelect(category.slug);
            } else if (hasChildren) {
              toggleCategory(category.slug);
            }
          }}
          className={cn(
            'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 border',
            'hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5',
            isSelected
              ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
              : 'border-cyber-cyan/20 text-gray-300',
            depth > 0 && 'ml-4 border-cyber-purple/20 hover:border-cyber-purple/50 hover:bg-cyber-purple/5'
          )}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          style={{ paddingLeft: `${1 + depth * 1}rem` }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {isExpanded ? (
                <FolderOpen className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
              ) : (
                <Folder className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
              )}
              <span className={cn('font-medium truncate', isSelected && 'text-cyber-cyan')}>
                {category.name}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {showCount && category.count !== undefined && (
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  isSelected
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'bg-cyber-cyan/10 text-cyber-cyan'
                )}>
                  {category.count}
                </span>
              )}

              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              )}
            </div>
          </div>

          {showDescription && category.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </motion.button>

        {hasChildren && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-1">
                  {category.children!.map((child) => renderCategory(child, depth + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </>
    );

    return <div key={category.id}>{content}</div>;
  };

  if (layout === 'dropdown') {
    return (
      <div className={cn('cyber-card p-4', className)}>
        <h3 className="text-lg font-bold text-glow-cyan mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          分类
        </h3>
        <div className="space-y-1">
          {categories.map((category) => renderCategory(category))}
        </div>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3', className)}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?category=${category.slug}`}
            className={cn(
              'cyber-card cyber-card--interactive p-4 text-center transition-all duration-200',
              selectedCategory === category.slug
                ? 'border-cyber-cyan bg-cyber-cyan/10'
                : 'hover:border-cyber-cyan/50'
            )}
          >
            <Folder className="w-8 h-8 mx-auto mb-2 text-cyber-cyan" />
            <h4 className={cn(
              'font-semibold text-sm',
              selectedCategory === category.slug ? 'text-cyber-cyan' : ''
            )}>
              {category.name}
            </h4>
            {showCount && category.count !== undefined && (
              <span className="text-xs text-gray-400 mt-1 block">
                {category.count} 篇文章
              </span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  // Default list layout
  return (
    <div className={cn('cyber-card p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-glow-cyan flex items-center gap-2">
          <Folder className="w-5 h-5" />
          分类
        </h3>
        {collapsible && (
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="cyber-button cyber-button--icon"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1">
              {/* All Categories Link */}
              <motion.button
                onClick={() => onCategorySelect?.('')}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 border',
                  'hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5',
                  !selectedCategory
                    ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                    : 'border-cyber-cyan/20 text-gray-300'
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5" />
                    <span className="font-medium">全部分类</span>
                  </div>
                </div>
              </motion.button>

              {categories.map((category) => renderCategory(category))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryFilter;
