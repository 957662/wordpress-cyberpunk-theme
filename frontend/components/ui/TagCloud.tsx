'use client';

/**
 * 标签云组件
 * 展示分类和标签
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

// 标签项
export interface TagItem {
  name: string;
  count?: number;
  slug: string;
}

interface TagCloudProps {
  tags: TagItem[];
  maxTags?: number;
  activeTag?: string;
  onTagClick?: (tag: TagItem) => void;
  variant?: 'default' | 'pill' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TagCloud({
  tags,
  maxTags,
  activeTag,
  onTagClick,
  variant = 'default',
  size = 'md',
  className,
}: TagCloudProps) {
  // 限制标签数量
  const displayTags = useMemo(() => {
    if (maxTags && maxTags < tags.length) {
      return tags.slice(0, maxTags);
    }
    return tags;
  }, [tags, maxTags]);

  // 计算标签权重（用于字体大小）
  const maxCount = useMemo(() => {
    const counts = displayTags.map(t => t.count || 0);
    return Math.max(...counts, 1);
  }, [displayTags]);

  // 获取字体大小类
  const getSizeClass = (count: number = 0) => {
    if (variant === 'pill') {
      return '';
    }

    const weight = count / maxCount;
    if (weight > 0.7) return 'text-xl';
    if (weight > 0.4) return 'text-base';
    return 'text-sm';
  };

  // 获取尺寸类
  const paddingClass = useMemo(() => {
    const sizeMap = {
      sm: variant === 'pill' ? 'px-2 py-1 text-xs' : 'px-2 py-1',
      md: variant === 'pill' ? 'px-3 py-1.5 text-sm' : 'px-3 py-1.5',
      lg: variant === 'pill' ? 'px-4 py-2 text-base' : 'px-4 py-2',
    };
    return sizeMap[size];
  }, [variant, size]);

  // 获取颜色
  const getColorClass = (index: number) => {
    const colors = [
      'from-cyber-cyan to-cyber-purple',
      'from-cyber-purple to-cyber-pink',
      'from-cyber-pink to-cyber-yellow',
      'from-cyber-yellow to-cyber-green',
      'from-cyber-green to-cyber-cyan',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayTags.map((tag, index) => (
        <motion.button
          key={tag.slug}
          onClick={() => onTagClick?.(tag)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border transition-all',
            'hover:shadow-lg hover:shadow-cyber-cyan/20',
            paddingClass,
            activeTag === tag.slug
              ? 'border-cyber-cyan bg-gradient-to-r ' + getColorClass(index) + ' text-white'
              : 'border-cyber-cyan/30 bg-cyber-dark/50 text-gray-300 hover:border-cyber-cyan/60',
            variant === 'compact' && 'border-0 px-0 py-0'
          )}
        >
          {variant !== 'compact' && (
            <Tag className={cn(
              'w-3 h-3',
              size === 'lg' && 'w-4 h-4'
            )} />
          )}
          <span className={cn(
            'font-medium',
            variant === 'default' && getSizeClass(tag.count)
          )}>
            {tag.name}
          </span>
          {tag.count !== undefined && variant !== 'compact' && (
            <span className={cn(
              'px-1.5 py-0.5 rounded-full text-xs',
              activeTag === tag.slug
                ? 'bg-white/20'
                : 'bg-cyber-cyan/10 text-cyber-cyan'
            )}>
              {tag.count}
            </span>
          )}
        </motion.button>
      ))}
      {maxTags && maxTags < tags.length && (
        <span className={cn(
          'text-gray-500 italic',
          paddingClass
        )}>
          +{tags.length - maxTags} 更多
        </span>
      )}
    </div>
  );
}

// 分类列表组件
interface CategoryListProps {
  categories: TagItem[];
  activeCategory?: string;
  onCategoryClick?: (category: TagItem) => void;
  className?: string;
}

export function CategoryList({
  categories,
  activeCategory,
  onCategoryClick,
  className,
}: CategoryListProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <h3 className="text-sm font-semibold text-gray-400 mb-3">分类</h3>
      {categories.map((category) => (
        <motion.button
          key={category.slug}
          onClick={() => onCategoryClick?.(category)}
          whileHover={{ x: 4 }}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all',
            activeCategory === category.slug
              ? 'bg-cyber-cyan/10 border-l-2 border-cyber-cyan text-cyber-cyan'
              : 'hover:bg-cyber-dark/50 text-gray-400 hover:text-gray-200'
          )}
        >
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            {category.name}
          </span>
          {category.count !== undefined && (
            <span className="text-sm opacity-60">{category.count}</span>
          )}
        </motion.button>
      ))}
    </div>
  );
}

export default TagCloud;
