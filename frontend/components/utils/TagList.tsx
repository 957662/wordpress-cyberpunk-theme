'use client';

import React from 'react';
import { Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TagItem {
  id: string;
  label: string;
  count?: number;
  color?: string;
  removable?: boolean;
}

export interface TagListProps {
  tags: TagItem[];
  onTagClick?: (tag: TagItem) => void;
  onRemove?: (tagId: string) => void;
  variant?: 'default' | 'pill' | 'outline' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  maxTags?: number;
  showCount?: boolean;
  className?: string;
}

/**
 * TagList - 标签列表组件
 *
 * 显示可交互的标签列表，支持点击、删除、计数等功能
 *
 * @example
 * ```tsx
 * <TagList
 *   tags={[
 *     { id: '1', label: 'React', count: 10 },
 *     { id: '2', label: 'TypeScript', count: 5 }
 *   ]}
 *   onTagClick={(tag) => console.log(tag)}
 *   variant="neon"
 * />
 * ```
 */
export const TagList: React.FC<TagListProps> = ({
  tags,
  onTagClick,
  onRemove,
  variant = 'default',
  size = 'md',
  maxTags,
  showCount = true,
  className = '',
}) => {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const hiddenCount = maxTags ? tags.length - maxTags : 0;

  const variants = {
    default: {
      base: 'bg-gray-800 text-gray-300 border-gray-700',
      hover: 'hover:bg-gray-700',
      count: 'bg-gray-900 text-gray-400',
    },
    pill: {
      base: 'bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 text-gray-300 border-cyber-purple/50',
      hover: 'hover:from-cyber-purple/30 hover:to-cyber-cyan/30',
      count: 'bg-black/30 text-gray-400',
    },
    outline: {
      base: 'bg-transparent text-gray-300 border-gray-600',
      hover: 'hover:bg-gray-800',
      count: 'bg-gray-800 text-gray-400',
    },
    neon: {
      base: 'bg-[#0a0a0f] text-cyber-cyan border-cyber-cyan/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]',
      hover: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:border-cyber-cyan',
      count: 'bg-cyber-purple/20 text-cyber-purple',
    },
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <AnimatePresence>
        {displayTags.map((tag) => (
          <motion.div
            key={tag.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`inline-flex items-center border rounded-full ${currentSize} ${currentVariant.base} ${onTagClick ? 'cursor-pointer ' + currentVariant.hover : ''} ${tag.removable || onRemove ? 'pr-1' : ''}`}
            onClick={() => onTagClick?.(tag)}
          >
            <Tag className="w-3 h-3" />
            <span className="font-medium">{tag.label}</span>
            {showCount && tag.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${currentVariant.count}`}>
                {tag.count}
              </span>
            )}
            {(tag.removable || onRemove) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(tag.id);
                }}
                className="p-0.5 rounded-full hover:bg-white/10 transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {hiddenCount > 0 && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center px-2 py-1 text-xs text-gray-500"
        >
          +{hiddenCount} more
        </motion.span>
      )}
    </div>
  );
};

/**
 * TagCloud - 标签云组件
 */
export const TagCloud: React.FC<{
  tags: Array<{ name: string; weight: number }>;
  onTagClick?: (tag: string) => void;
  className?: string;
}> = ({ tags, onTagClick, className = '' }) => {
  const maxWeight = Math.max(...tags.map(t => t.weight));
  const minWeight = Math.min(...tags.map(t => t.weight));

  const getFontSize = (weight: number) => {
    const ratio = (weight - minWeight) / (maxWeight - minWeight);
    return 0.8 + ratio * 1.2; // 0.8rem to 2rem
  };

  const getOpacity = (weight: number) => {
    const ratio = (weight - minWeight) / (maxWeight - minWeight);
    return 0.4 + ratio * 0.6; // 0.4 to 1.0
  };

  return (
    <div className={`flex flex-wrap gap-3 p-4 ${className}`}>
      {tags.map((tag, index) => (
        <motion.button
          key={tag.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: getOpacity(tag.weight), scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onTagClick?.(tag.name)}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 text-gray-300 border border-cyber-cyan/30 hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          style={{
            fontSize: `${getFontSize(tag.weight)}rem`,
          }}
        >
          {tag.name}
        </motion.button>
      ))}
    </div>
  );
};

/**
 * TagInput - 标签输入组件
 */
export const TagInput: React.FC<{
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}> = ({ tags, onChange, placeholder = 'Add tag...', maxTags, className = '' }) => {
  const [input, setInput] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!maxTags || tags.length < maxTags) {
        onChange([...tags, input.trim()]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleRemove = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-wrap gap-2 p-2 border border-cyber-cyan/30 rounded-lg bg-[#0a0a0f] ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-cyber-purple/20 text-cyber-cyan border border-cyber-cyan/30 rounded"
        >
          {tag}
          <button
            onClick={() => handleRemove(index)}
            className="hover:text-red-400 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {(maxTags === undefined || tags.length < maxTags) && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] bg-transparent text-gray-300 outline-none placeholder:text-gray-600"
        />
      )}
      {maxTags !== undefined && (
        <span className="text-xs text-gray-600">
          {tags.length}/{maxTags}
        </span>
      )}
    </div>
  );
};

export default TagList;
