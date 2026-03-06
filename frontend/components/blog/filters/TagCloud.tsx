'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface TagItem {
  id: string | number;
  name: string;
  slug: string;
  count?: number;
}

export interface TagCloudProps {
  tags: TagItem[];
  selectedTag?: string;
  onTagSelect?: (slug: string) => void;
  maxDisplay?: number;
  sortBy?: 'name' | 'count' | 'random';
  showCount?: boolean;
  sizeVariant?: 'uniform' | 'weighted' | 'mixed';
  layout?: 'cloud' | 'list' | 'pill';
  className?: string;
}

export function TagCloud({
  tags,
  selectedTag,
  onTagSelect,
  maxDisplay,
  sortBy = 'name',
  showCount = false,
  sizeVariant = 'mixed',
  layout = 'cloud',
  className,
}: TagCloudProps) {
  // Sort tags
  const sortedTags = React.useMemo(() => {
    let sorted = [...tags];

    switch (sortBy) {
      case 'count':
        sorted.sort((a, b) => (b.count || 0) - (a.count || 0));
        break;
      case 'random':
        sorted.sort(() => Math.random() - 0.5);
        break;
      case 'name':
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return maxDisplay ? sorted.slice(0, maxDisplay) : sorted;
  }, [tags, sortBy, maxDisplay]);

  // Get font size based on count for weighted variant
  const getFontSize = (tag: TagItem) => {
    if (sizeVariant !== 'weighted' || !tag.count) return 'text-sm';

    const maxCount = Math.max(...tags.map((t) => t.count || 0));
    const minCount = Math.min(...tags.map((t) => t.count || 0));
    const range = maxCount - minCount || 1;

    const percentage = ((tag.count - minCount) / range) * 100;

    if (percentage > 80) return 'text-lg font-bold';
    if (percentage > 60) return 'text-base font-semibold';
    if (percentage > 40) return 'text-sm';
    return 'text-xs';
  };

  // Get size class for mixed variant
  const getSizeClass = (index: number) => {
    if (sizeVariant !== 'mixed') return '';

    const sizes = [
      'text-xs px-2 py-1',
      'text-sm px-3 py-1.5',
      'text-base px-4 py-2',
      'text-lg px-5 py-2.5',
    ];

    return sizes[index % sizes.length];
  };

  if (layout === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        {sortedTags.map((tag) => (
          <Link
            key={tag.id}
            href={`/blog?tag=${tag.slug}`}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200',
              selectedTag === tag.slug
                ? 'border-cyber-purple bg-cyber-purple/10 text-cyber-purple'
                : 'border-cyber-purple/20 hover:border-cyber-purple/50 hover:bg-cyber-purple/5'
            )}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="font-medium">{tag.name}</span>
            </div>
            {showCount && tag.count !== undefined && (
              <span className={cn(
                'text-xs px-2 py-1 rounded-full',
                selectedTag === tag.slug
                  ? 'bg-cyber-purple text-cyber-dark'
                  : 'bg-cyber-purple/10 text-cyber-purple'
              )}>
                {tag.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  if (layout === 'pill') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {sortedTags.map((tag) => (
          <Link
            key={tag.id}
            href={`/blog?tag=${tag.slug}`}
            className={cn(
              'cyber-badge inline-flex items-center gap-2',
              selectedTag === tag.slug
                ? 'cyber-badge--purple'
                : 'cyber-badge--muted hover:border-cyber-purple/50',
              getSizeClass(sortedTags.indexOf(tag))
            )}
          >
            <Tag className="w-3 h-3" />
            <span>{tag.name}</span>
            {showCount && tag.count !== undefined && (
              <span className="text-xs opacity-75">({tag.count})</span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  // Default cloud layout
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {sortedTags.map((tag, index) => (
        <motion.span
          key={tag.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`/blog?tag=${tag.slug}`}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200',
              'hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 hover:shadow-lg hover:shadow-cyber-cyan/20',
              selectedTag === tag.slug
                ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                : 'border-cyber-cyan/20 text-gray-300',
              getFontSize(tag),
              sizeVariant === 'uniform' && 'text-sm'
            )}
          >
            <Tag className="w-3 h-3" />
            <span className="font-medium">{tag.name}</span>
            {showCount && tag.count !== undefined && (
              <span className="text-xs opacity-75 ml-1">
                {tag.count}
              </span>
            )}
          </Link>
        </motion.span>
      ))}
    </div>
  );
}

export default TagCloud;
