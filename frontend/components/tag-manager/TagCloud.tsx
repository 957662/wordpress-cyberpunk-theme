'use client';

import React from 'react';
import { Hash } from 'lucide-react';
import { motion } from 'framer-motion';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface TagCloudProps {
  tags: TagItem[];
  onTagClick?: (tag: TagItem) => void;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  onTagClick,
  minSize = 12,
  maxSize = 32,
  className = '',
}) => {
  // Calculate size based on count
  const getTagSize = (count?: number) => {
    if (!count) return minSize;

    const maxCount = Math.max(...tags.map(t => t.count || 0));
    const minCount = Math.min(...tags.map(t => t.count || 0));

    if (maxCount === minCount) return (minSize + maxSize) / 2;

    const ratio = (count - minCount) / (maxCount - minCount);
    return minSize + ratio * (maxSize - minSize);
  };

  // Get color based on size
  const getTagColor = (size: number) => {
    const ratio = (size - minSize) / (maxSize - minSize);

    if (ratio > 0.7) return 'text-cyber-pink';
    if (ratio > 0.4) return 'text-cyber-purple';
    if (ratio > 0.2) return 'text-cyber-cyan';
    return 'text-gray-400';
  };

  return (
    <div className={`tag-cloud ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-3 p-6">
        {tags.map((tag) => {
          const size = getTagSize(tag.count);
          const color = getTagColor(size);

          return (
            <motion.button
              key={tag.id}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTagClick?.(tag)}
              className="group relative"
              style={{ fontSize: `${size}px` }}
            >
              <span className={`flex items-center gap-1 transition-colors ${color} hover:text-white`}>
                <Hash className="w-3 h-3" />
                {tag.name}
              </span>

              {tag.count && (
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gray-800 rounded-full text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {tag.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TagCloud;
