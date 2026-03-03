'use client';

import React, { useState, useCallback } from 'react';
import {
  Tag,
  X,
  Plus,
  Edit2,
  Search,
  TrendingUp,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  count?: number;
  color?: string;
}

interface TagManagerProps {
  tags: TagItem[];
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  onTagClick?: (tag: TagItem) => void;
  editable?: boolean;
  showSearch?: boolean;
  showTrending?: boolean;
  maxDisplay?: number;
  className?: string;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  selectedTags = [],
  onTagsChange,
  onTagClick,
  editable = false,
  showSearch = true,
  showTrending = true,
  maxDisplay,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTags = maxDisplay ? filteredTags.slice(0, maxDisplay) : filteredTags;

  const handleTagToggle = useCallback((tagId: string) => {
    if (!editable) return;

    const newSelected = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];

    onTagsChange?.(newSelected);
  }, [selectedTags, editable, onTagsChange]);

  const handleTagClick = useCallback((tag: TagItem) => {
    if (editable) {
      handleTagToggle(tag.id);
    }
    onTagClick?.(tag);
  }, [editable, handleTagToggle, onTagClick]);

  const handleRemoveTag = useCallback((tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editable) {
      onTagsChange?.(selectedTags.filter(id => id !== tagId));
    }
  }, [selectedTags, editable, onTagsChange]);

  const isSelected = (tagId: string) => selectedTags.includes(tagId);

  const popularTags = [...tags]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 10);

  return (
    <div className={`tag-manager ${className}`}>
      {/* Search */}
      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
          />
        </div>
      )}

      {/* Trending Tags */}
      {showTrending && !searchQuery && (
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-gray-200">Trending Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <motion.button
                key={tag.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  isSelected(tag.id)
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                }`}
              >
                #{tag.name}
                {tag.count && (
                  <span className="ml-1 text-xs opacity-75">({tag.count})</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* All Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-200">
            {searchQuery ? 'Search Results' : 'All Tags'}
          </h3>
          {maxDisplay && filteredTags.length > maxDisplay && (
            <span className="text-xs text-gray-500">
              Showing {displayedTags.length} of {filteredTags.length}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {displayedTags.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => handleTagClick(tag)}
                  className={`group relative px-3 py-1.5 rounded-full text-sm transition-all ${
                    isSelected(tag.id)
                      ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-lg shadow-cyber-cyan/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3 h-3" />
                    {tag.name}
                    {tag.count && (
                      <span className={`text-xs ${isSelected(tag.id) ? 'text-white/80' : 'text-gray-500'}`}>
                        ({tag.count})
                      </span>
                    )}
                  </span>

                  {isSelected(tag.id) && editable && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleRemoveTag(tag.id, e)}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </motion.button>
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No tags found</p>
          </div>
        )}
      </div>

      {/* Selected Tags Summary */}
      {editable && selectedTags.length > 0 && (
        <div className="mt-4 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTagsChange?.([])}
              className="text-xs text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
            >
              Clear all
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManager;
