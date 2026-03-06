'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

interface TagBadgeProps {
  tag: {
    id: number;
    name: string;
    slug: string;
    color?: string;
    count?: number;
  };
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  clickable?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  size = 'md',
  variant = 'default',
  clickable = true,
}) => {
  const sizes = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-all duration-200';

  const variantClasses = {
    default: `bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:from-violet-500/20 hover:to-purple-500/20`,
    outline: 'bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
    filled: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600',
  };

  const content = (
    <>
      <Tag className={iconSizes[size]} />
      <span>{tag.name}</span>
      {tag.count !== undefined && (
        <span className="opacity-60">({tag.count})</span>
      )}
    </>
  );

  const badge = (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${sizes[size]} ${variantClasses[variant]}`}
    >
      {content}
    </motion.span>
  );

  if (clickable) {
    return <Link href={`/tags/${tag.slug}`}>{badge}</Link>;
  }

  return badge;
};

export default TagBadge;
