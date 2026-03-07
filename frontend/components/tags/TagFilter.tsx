'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X, Check, ChevronDown } from 'lucide-react';
import { TagBadge } from './TagBadge';

interface TagFilterProps {
  tags: Array<{
    id: number;
    name: string;
    slug: string;
    count?: number;
  }>;
  selectedTags?: string[];
  onTagSelect?: (tagSlug: string) => void;
  onClearAll?: () => void;
  placeholder?: string;
  maxVisible?: number;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags = [],
  onTagSelect,
  onClearAll,
  placeholder = '筛选标签...',
  maxVisible = 10,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleTags = isExpanded ? filteredTags : filteredTags.slice(0, maxVisible);
  const hasMore = filteredTags.length > maxVisible;

  const handleTagClick = (tagSlug: string) => {
    onTagSelect?.(tagSlug);
  };

  const isSelected = (tagSlug: string) => selectedTags.includes(tagSlug);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            标签筛选
          </h3>
          {selectedTags.length > 0 && (
            <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-full">
              {selectedTags.length}
            </span>
          )}
        </div>

        {selectedTags.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClearAll}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
            清空
          </motion.button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500"
        />
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {visibleTags.map((tag) => {
            const selected = isSelected(tag.slug);

            return (
              <motion.button
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTagClick(tag.slug)}
                className={`
                  relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${
                    selected
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{tag.name}</span>
                {tag.count !== undefined && (
                  <span className={`text-xs ${selected ? 'text-white/80' : 'text-gray-500'}`}>
                    {tag.count}
                  </span>
                )}
                {selected && (
                  <Check className="w-3.5 h-3.5 ml-auto" />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>

        {hasMore && !isExpanded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            <span>显示全部</span>
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}

        {isExpanded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsExpanded(false)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <span>收起</span>
            <ChevronDown className="w-4 h-4 rotate-180" />
          </motion.button>
        )}
      </div>

      {/* No results */}
      {filteredTags.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>没有找到匹配的标签</p>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
