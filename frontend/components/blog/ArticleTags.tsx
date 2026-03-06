/**
 * 文章标签组件
 */

import React from 'react';
import Link from 'next/link';

export interface ArticleTag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface ArticleTagsProps {
  tags: ArticleTag[];
  className?: string;
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  maxTags?: number;
  showCount?: boolean;
  limit?: number;
}

export const ArticleTags: React.FC<ArticleTagsProps> = ({
  tags,
  className = '',
  variant = 'default',
  size = 'md',
  maxTags,
  showCount = false,
  limit,
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  // 限制显示的标签数量
  const displayTags = limit ? tags.slice(0, limit) : tags;
  const remainingCount = limit && tags.length > limit ? tags.length - limit : 0;

  // 样式配置
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses = {
    default: 'bg-cyber-muted/50 border border-cyber-cyan/30 text-cyber-cyan hover:border-cyber-cyan/60 hover:bg-cyber-muted/70',
    outlined: 'bg-transparent border border-cyber-purple/50 text-cyber-purple hover:border-cyber-purple hover:bg-cyber-purple/10',
    filled: 'bg-cyber-pink/20 border border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/30',
    minimal: 'bg-transparent text-gray-400 hover:text-cyber-cyan',
  };

  const tagClassName = `${sizeClasses[size]} ${variantClasses[variant]} rounded-full transition-all duration-200 inline-flex items-center gap-1.5`;

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className={tagClassName}
          title={tag.name}
        >
          <span>#</span>
          <span>{tag.name}</span>
          {showCount && tag.count !== undefined && (
            <span className="opacity-60">({tag.count})</span>
          )}
        </Link>
      ))}

      {remainingCount > 0 && (
        <span className="text-gray-500 text-sm">
          +{remainingCount} 更多
        </span>
      )}
    </div>
  );
};

/**
 * 文章标签云组件
 */
export interface ArticleTagCloudProps {
  tags: ArticleTag[];
  className?: string;
  maxTags?: number;
}

export const ArticleTagCloud: React.FC<ArticleTagCloudProps> = ({
  tags,
  className = '',
  maxTags = 50,
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = tags.slice(0, maxTags);

  // 根据标签数量计算字体大小
  const getFontSize = (count: number) => {
    const maxCount = Math.max(...displayTags.map(t => t.count || 0));
    const minCount = Math.min(...displayTags.map(t => t.count || 0));
    const ratio = (count - minCount) / (maxCount - minCount || 1);

    if (ratio > 0.7) return 'text-lg';
    if (ratio > 0.4) return 'text-base';
    return 'text-sm';
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {displayTags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className={`
            ${getFontSize(tag.count || 0)}
            text-gray-400 hover:text-cyber-cyan
            transition-colors duration-200
            font-medium
          `}
          title={`${tag.name} (${tag.count || 0})`}
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
};

/**
 * 文章标签选择器组件（用于筛选）
 */
export interface ArticleTagSelectorProps {
  tags: ArticleTag[];
  selectedTags: number[];
  onTagToggle: (tagId: number) => void;
  className?: string;
  maxDisplay?: number;
}

export const ArticleTagSelector: React.FC<ArticleTagSelectorProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  className = '',
  maxDisplay,
}) => {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const showMore = maxDisplay && tags.length > maxDisplay;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag) => {
        const isSelected = selectedTags.includes(tag.id);

        return (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`
              px-3 py-1.5 text-sm rounded-full border transition-all duration-200
              ${
                isSelected
                  ? 'bg-cyber-cyan text-black border-cyber-cyan'
                  : 'bg-transparent text-gray-400 border-gray-700 hover:border-cyber-cyan/50 hover:text-cyber-cyan'
              }
            `}
          >
            <span className="mr-1">#</span>
            {tag.name}
          </button>
        );
      })}

      {showMore && (
        <button
          className="px-3 py-1.5 text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
        >
          +{tags.length - maxDisplay} 更多
        </button>
      )}
    </div>
  );
};

export default ArticleTags;
