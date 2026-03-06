'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock } from 'lucide-react';
import TagBadge from './TagBadge';

interface Tag {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
  created_at?: string;
}

interface TagListProps {
  tags: Tag[];
  showStats?: boolean;
  sortBy?: 'name' | 'popular' | 'recent';
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  showStats = true,
  sortBy = 'name',
}) => {
  const sortedTags = React.useMemo(() => {
    const sorted = [...tags];
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => (b.posts_count || 0) - (a.posts_count || 0));
      case 'recent':
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [tags, sortBy]);

  return (
    <div className="space-y-2">
      {sortedTags.map((tag, index) => (
        <motion.div
          key={tag.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <TagBadge tag={tag} size="md" />

            {showStats && tag.posts_count !== undefined && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>{tag.posts_count} 篇文章</span>
              </div>
            )}
          </div>

          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default TagList;
