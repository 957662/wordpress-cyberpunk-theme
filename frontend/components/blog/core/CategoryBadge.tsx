'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

// ================================================================
// CategoryBadge - 分类徽章组件
// ================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  post_count?: number;
}

export interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showIcon?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showCount = false,
  showIcon = true,
  clickable = true,
  className,
  onClick,
}) => {
  // 根据大小设置样式
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const countSize = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  // 渲染内容
  const renderContent = () => (
    <motion.div
      whileHover={clickable ? { scale: 1.05 } : undefined}
      whileTap={clickable ? { scale: 0.95 } : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium transition-all',
        'hover:shadow-lg',
        sizeStyles[size],
        className
      )}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
        border: `1px solid ${category.color}40`,
      }}
    >
      {showIcon && (
        <Tag className={cn('flex-shrink-0', iconSize[size])} />
      )}
      <span className="truncate">{category.name}</span>
      {showCount && typeof category.post_count === 'number' && (
        <span
          className={cn(
            'ml-1 rounded-full px-1.5 py-0.5',
            countSize[size]
          )}
          style={{
            backgroundColor: category.color,
            color: '#000',
          }}
        >
          {category.post_count}
        </span>
      )}
    </motion.div>
  );

  // 如果可点击，使用 Link 组件
  if (clickable && !onClick) {
    return (
      <Link href={`/blog?category=${category.slug}`}>{renderContent()}</Link>
    );
  }

  // 如果有 onClick 处理器，使用 button
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="border-0 bg-transparent p-0 cursor-pointer"
      >
        {renderContent()}
      </button>
    );
  }

  // 否则直接渲染
  return renderContent();
};

// ================================================================
// CategoryList - 分类列表组件
// ================================================================

export interface CategoryListProps {
  categories: Category[];
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showIcon?: boolean;
  maxItems?: number;
  className?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  size = 'md',
  showCount = true,
  showIcon = true,
  maxItems,
  className,
}) => {
  const displayCategories = maxItems
    ? categories.slice(0, maxItems)
    : categories;

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayCategories.map((category) => (
        <CategoryBadge
          key={category.id}
          category={category}
          size={size}
          showCount={showCount}
          showIcon={showIcon}
        />
      ))}
      {maxItems && categories.length > maxItems && (
        <Link
          href="/blog/categories"
          className={cn(
            'inline-flex items-center gap-2 rounded-full font-medium',
            size === 'sm' ? 'px-2 py-1 text-xs' : size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base',
            'text-gray-400 hover:text-cyber-cyan transition-colors'
          )}
        >
          +{categories.length - maxItems} 更多
        </Link>
      )}
    </div>
  );
};

export default CategoryBadge;
