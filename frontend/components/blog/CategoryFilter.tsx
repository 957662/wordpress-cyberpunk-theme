/**
 * 分类筛选组件
 * 提供分类导航和筛选功能
 */

'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface Category {
  name: string;
  slug: string;
  count?: number;
  color?: string;
}

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  variant?: 'horizontal' | 'vertical' | 'pill';
  showCount?: boolean;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  variant = 'horizontal',
  showCount = false,
  className,
}: CategoryFilterProps) {
  const getCategoryColor = (category: Category) => {
    if (category.color) return category.color;
    const colors = [
      'from-cyber-cyan to-blue-500',
      'from-cyber-purple to-pink-500',
      'from-cyber-pink to-red-500',
      'from-green-400 to-emerald-500',
      'from-yellow-400 to-orange-500',
    ];
    const index = categories.indexOf(category);
    return colors[index % colors.length];
  };

  if (variant === 'pill') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.name;
          return (
            <motion.button
              key={category.slug}
              onClick={() => onSelectCategory(category.name)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                isSelected
                  ? 'text-white shadow-lg'
                  : 'text-gray-400 hover:text-white bg-cyber-dark/50 border border-cyber-cyan/20 hover:border-cyber-cyan/50'
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className={cn(
                    'absolute inset-0 rounded-full bg-gradient-to-r',
                    getCategoryColor(category)
                  )}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {category.name}
                {showCount && category.count !== undefined && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs',
                      isSelected
                        ? 'bg-white/20'
                        : 'bg-cyber-cyan/10 text-cyber-cyan'
                    )}
                  >
                    {category.count}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.name;
          return (
            <motion.button
              key={category.slug}
              onClick={() => onSelectCategory(category.name)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                'relative px-4 py-3 rounded-lg text-left transition-all duration-200',
                'border',
                isSelected
                  ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan'
                  : 'bg-cyber-dark/50 border-cyber-cyan/20 text-gray-400 hover:border-cyber-cyan/50 hover:text-white'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.name}</span>
                {showCount && category.count !== undefined && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs',
                      isSelected
                        ? 'bg-cyber-cyan/20'
                        : 'bg-cyber-cyan/10 text-gray-500'
                    )}
                  >
                    {category.count}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // 水平布局（默认）
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2', className)}>
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.name;
        return (
          <Button
            key={category.slug}
            size="sm"
            variant={isSelected ? 'primary' : 'ghost'}
            onClick={() => onSelectCategory(category.name)}
            className={cn(
              'whitespace-nowrap rounded-full transition-all duration-200',
              isSelected && 'shadow-lg'
            )}
          >
            {category.name}
            {showCount && category.count !== undefined && (
              <span
                className={cn(
                  'ml-2 px-2 py-0.5 rounded-full text-xs',
                  isSelected
                    ? 'bg-white/20'
                    : 'bg-cyber-cyan/10 text-cyber-cyan'
                )}
              >
                {category.count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
