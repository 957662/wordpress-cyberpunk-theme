/**
 * BadgeList 徽章列表组件
 * 用于显示分类和标签
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Badge {
  id: number | string;
  name: string;
  slug?: string;
  count?: number;
}

interface BadgeListProps {
  badges: Badge[];
  variant?: 'default' | 'outline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: (slug: string) => string;
  maxItems?: number;
}

export function BadgeList({
  badges,
  variant = 'default',
  size = 'md',
  className = '',
  href,
  maxItems,
}: BadgeListProps) {
  const displayBadges = maxItems ? badges.slice(0, maxItems) : badges;

  const variantClasses = {
    default: 'bg-cyber-muted text-cyber-cyan border-cyber-cyan/30',
    outline: 'bg-transparent text-cyber-cyan border-cyber-cyan',
    glow: 'bg-cyber-muted text-cyber-cyan border-cyber-cyan shadow-neon-cyan',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn('flex flex-wrap gap-2', className)}
    >
      {displayBadges.map((badge) => {
        const content = (
          <>
            {badge.name}
            {badge.count !== undefined && (
              <span className="ml-1 opacity-60">({badge.count})</span>
            )}
          </>
        );

        const badgeElement = (
          <motion.div
            key={badge.id}
            variants={item}
            className={cn(
              'inline-flex items-center rounded-full border transition-all duration-300',
              'hover:shadow-neon-cyan hover:scale-105',
              variantClasses[variant],
              sizeClasses[size]
            )}
          >
            {content}
          </motion.div>
        );

        if (href && badge.slug) {
          return (
            <Link key={badge.id} href={href(badge.slug)}>
              {badgeElement}
            </Link>
          );
        }

        return badgeElement;
      })}
    </motion.div>
  );
}

// ============ CategoryBadges ============
interface CategoryBadgesProps {
  categories: Array<{ id: number; name: string; slug: string }>;
  className?: string;
}

export function CategoryBadges({ categories, className = '' }: CategoryBadgesProps) {
  return (
    <BadgeList
      badges={categories}
      variant="glow"
      size="md"
      className={className}
      href={slug => `/blog?category=${slug}`}
    />
  );
}

// ============ TagBadges ============
interface TagBadgesProps {
  tags: Array<{ id: number; name: string; slug: string }>;
  className?: string;
}

export function TagBadges({ tags, className = '' }: TagBadgesProps) {
  return (
    <BadgeList
      badges={tags}
      variant="outline"
      size="sm"
      className={className}
      href={slug => `/blog?tag=${slug}`}
    />
  );
}

export default BadgeList;
