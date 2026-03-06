'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Hashtag } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  count?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
}

interface TagCloudProps {
  tags: Tag[];
  variant?: 'default' | 'compact' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  selectable?: boolean;
  selectedTags?: string[];
  onTagClick?: (tagId: string) => void;
  maxTags?: number;
  sortBy?: 'name' | 'count' | 'random';
  className?: string;
}

export const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  variant = 'default',
  size = 'md',
  selectable = false,
  selectedTags = [],
  onTagClick,
  maxTags,
  sortBy = 'count',
  className
}) => {
  // 排序和限制标签数量
  const processedTags = useMemo(() => {
    let sorted = [...tags];

    // 排序
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'count') {
      sorted.sort((a, b) => (b.count || 0) - (a.count || 0));
    } else if (sortBy === 'random') {
      sorted.sort(() => Math.random() - 0.5);
    }

    // 限制数量
    if (maxTags) {
      sorted = sorted.slice(0, maxTags);
    }

    return sorted;
  }, [tags, sortBy, maxTags]);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {processedTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => selectable && onTagClick?.(tag.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full transition-all duration-200',
              sizeClasses[size],
              selectable && 'cursor-pointer hover:scale-105',
              selectedTags.includes(tag.id)
                ? 'bg-cyber-cyan text-cyber-dark font-semibold'
                : 'text-gray-400 hover:text-cyber-cyan'
            )}
          >
            {tag.name}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {processedTags.map(tag => {
          const isSelected = selectedTags.includes(tag.id);
          const color = tag.color || 'cyan';

          return (
            <button
              key={tag.id}
              onClick={() => selectable && onTagClick?.(tag.id)}
              className={cn(
                'inline-flex items-center gap-1.5 border rounded-lg transition-all duration-200',
                sizeClasses[size],
                selectable && 'cursor-pointer hover:scale-105',
                isSelected
                  ? `bg-cyber-${color}/20 border-cyber-${color}/50 text-cyber-${color}`
                  : 'bg-cyber-dark/50 border-gray-700 text-gray-400 hover:border-cyber-cyan/30 hover:text-cyber-cyan'
              )}
            >
              <Hashtag className={iconSizes[size]} />
              <span>{tag.name}</span>
              {tag.count !== undefined && (
                <span className="text-xs opacity-60">({tag.count})</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // 默认变体
  return (
    <div className={cn('space-y-3', className)}>
      {processedTags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag.id);
        const color = tag.color || 'cyan';
        const maxCount = Math.max(...tags.map(t => t.count || 0));
        const minCount = Math.min(...tags.map(t => t.count || 0));
        const countRange = maxCount - minCount || 1;
        const fontSize = tag.count !== undefined
          ? 0.875 + ((tag.count - minCount) / countRange) * 0.5
          : 1;

        return (
          <motion.button
            key={tag.id}
            onClick={() => selectable && onTagClick?.(tag.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            className={cn(
              'inline-flex items-center gap-2 border rounded-full transition-all duration-200',
              'px-4 py-2',
              selectable && 'cursor-pointer hover:scale-105 hover:shadow-lg',
              isSelected
                ? `bg-cyber-${color}/20 border-cyber-${color}/50 text-cyber-${color} shadow-md shadow-cyber-${color}/20`
                : 'bg-cyber-dark/50 border-gray-700 text-gray-400 hover:border-cyber-cyan/30 hover:text-cyber-cyan'
            )}
            style={{ fontSize: `${fontSize}rem` }}
          >
            <Hashtag className={iconSizes[size]} />
            <span className="font-medium">{tag.name}</span>
            {tag.count !== undefined && (
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                isSelected
                  ? `bg-cyber-${color}/30`
                  : 'bg-gray-800'
              )}>
                {tag.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// 标签选择器（用于表单）
export const TagSelector: React.FC<{
  availableTags: Tag[];
  selectedTags: string[];
  onToggle: (tagId: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ availableTags, selectedTags, onToggle, placeholder = '选择标签...', className }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={cn('relative', className)}>
      {/* 选中的标签 */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'min-h-[48px] p-3 border rounded-lg cursor-pointer',
          'bg-cyber-dark/50 border-cyber-cyan/30',
          'focus-within:border-cyber-cyan',
          'transition-colors'
        )}
      >
        <div className="flex flex-wrap gap-2">
          {selectedTags.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            selectedTags.map(tagId => {
              const tag = availableTags.find(t => t.id === tagId);
              return tag ? (
                <span
                  key={tag.id}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-full',
                    'bg-cyber-cyan/20 text-cyber-cyan text-sm'
                  )}
                >
                  {tag.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(tag.id);
                    }}
                    className="hover:text-cyber-dark"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })
          )}
        </div>
      </div>

      {/* 下拉标签列表 */}
      {isExpanded && (
        <div className={cn(
          'absolute top-full left-0 right-0 mt-2 p-3 border rounded-lg',
          'bg-cyber-dark/90 border-cyber-cyan/30 backdrop-blur-sm',
          'max-h-60 overflow-auto z-50'
        )}>
          <TagCloud
            tags={availableTags}
            variant="compact"
            size="sm"
            selectable
            selectedTags={selectedTags}
            onTagClick={(tagId) => {
              onToggle(tagId);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TagCloud;
