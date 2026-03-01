'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface TagListProps {
  tags: string[];
  selectedTag?: string;
  className?: string;
  variant?: 'default' | 'pill' | 'cloud';
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function TagList({ tags, selectedTag, className, variant = 'default' }: TagListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const colors = [
    'text-cyber-cyan border-cyber-cyan',
    'text-cyber-purple border-cyber-purple',
    'text-cyber-pink border-cyber-pink',
    'text-cyber-yellow border-cyber-yellow',
    'text-cyber-green border-cyber-green',
  ];

  const getColor = (index: number) => colors[index % colors.length];

  if (variant === 'cloud') {
    return (
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        <Tag className="w-4 h-4 text-gray-500" />
        {tags.map((tag, index) => {
          const isSelected = selectedTag === tag;
          const colorClass = getColor(index);

          return (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={cn(
                'px-3 py-1.5 rounded-full border transition-all duration-300',
                'hover:scale-105 hover:shadow-lg',
                isSelected
                  ? `bg-cyber-cyan/20 ${colorClass}`
                  : `bg-cyber-muted border-cyber-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan`
              )}
              style={{
                fontSize: `${Math.random() * 0.5 + 0.75}rem`,
              }}
            >
              {tag}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {tags.map((tag, index) => {
        const isSelected = selectedTag === tag;
        const colorClass = getColor(index);

        return (
          <Link
            key={tag}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
          >
            <motion.span
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'inline-block px-3 py-1.5 text-sm rounded-full border transition-all duration-300',
                isSelected
                  ? `bg-cyber-cyan/20 ${colorClass}`
                  : 'bg-cyber-muted border-cyber-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
              )}
            >
              #{tag}
            </motion.span>
          </Link>
        );
      })}
    </div>
  );
}

export function TagCloud({ tags, selectedTag, className }: Omit<TagListProps, 'variant'>) {
  return <TagList tags={tags} selectedTag={selectedTag} className={className} variant="cloud" />;
}

export default TagList;
