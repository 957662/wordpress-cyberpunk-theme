'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  count?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
}

export interface TagCloudProps {
  tags: TagItem[];
  variant?: 'neon' | 'holographic' | 'minimal' | 'bubble';
  layout?: 'cloud' | 'list' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showCount?: boolean;
  animated?: boolean;
  hrefPrefix?: string;
  className?: string;
  maxTags?: number;
}

const colorStyles = {
  cyan: {
    light: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/10',
    border: 'border-cyber-cyan/30',
    hover: 'hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50',
    glow: 'shadow-lg shadow-cyber-cyan/20',
  },
  purple: {
    light: 'text-cyber-purple',
    bg: 'bg-cyber-purple/10',
    border: 'border-cyber-purple/30',
    hover: 'hover:bg-cyber-purple/20 hover:border-cyber-purple/50',
    glow: 'shadow-lg shadow-cyber-purple/20',
  },
  pink: {
    light: 'text-cyber-pink',
    bg: 'bg-cyber-pink/10',
    border: 'border-cyber-pink/30',
    hover: 'hover:bg-cyber-pink/20 hover:border-cyber-pink/50',
    glow: 'shadow-lg shadow-cyber-pink/20',
  },
  green: {
    light: 'text-cyber-green',
    bg: 'bg-cyber-green/10',
    border: 'border-cyber-green/30',
    hover: 'hover:bg-cyber-green/20 hover:border-cyber-green/50',
    glow: 'shadow-lg shadow-cyber-green/20',
  },
  yellow: {
    light: 'text-cyber-yellow',
    bg: 'bg-cyber-yellow/10',
    border: 'border-cyber-yellow/30',
    hover: 'hover:bg-cyber-yellow/20 hover:border-cyber-yellow/50',
    glow: 'shadow-lg shadow-cyber-yellow/20',
  },
};

const variantStyles = {
  neon: 'border-2 bg-cyber-dark/50',
  holographic: 'border border-white/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm',
  minimal: 'border border-gray-700 bg-gray-900/30',
  bubble: 'rounded-full border-2 bg-cyber-dark/50',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-1 gap-1',
  md: 'text-sm px-3 py-1.5 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
};

const layoutStyles = {
  cloud: 'flex flex-wrap gap-2',
  list: 'flex flex-col gap-2',
  grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2',
};

export function TagCloud({
  tags,
  variant = 'neon',
  layout = 'cloud',
  size = 'md',
  color: defaultColor,
  showCount = false,
  animated = true,
  hrefPrefix = '/tags',
  className,
  maxTags,
}: TagCloudProps) {
  // 限制标签数量
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;

  // 计算标签大小（基于 count）
  const getTagSize = (count?: number) => {
    if (!count) return 'text-base';
    const normalized = Math.min(count / 10, 2); // 最大 2 倍
    const fontSize = 0.875 + normalized * 0.25; // 0.875rem ~ 1.375rem
    return `text-[${fontSize}rem]`;
  };

  return (
    <div className={cn(layoutStyles[layout], className)}>
      {displayTags.map((tag, index) => {
        const tagColor = tag.color || defaultColor;
        const styles = colorStyles[tagColor];
        const delay = animated ? index * 0.05 : 0;

        return (
          <motion.div
            key={tag.id}
            initial={animated ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={`${hrefPrefix}/${tag.slug}`}
              className={cn(
                'inline-flex items-center rounded-lg transition-all duration-300',
                variantStyles[variant],
                styles.border,
                styles.bg,
                styles.hover,
                sizeStyles[size],
                styles.light,
                variant === 'bubble' && 'rounded-full'
              )}
            >
              <Tag className="w-3 h-3 flex-shrink-0" />
              <span className={layout === 'cloud' ? getTagSize(tag.count) : ''}>
                {tag.name}
              </span>
              {showCount && tag.count !== undefined && (
                <span className="text-xs opacity-70 ml-1">({tag.count})</span>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

// 3D 标签云组件
export interface TagCloud3DProps {
  tags: TagItem[];
  radius?: number;
  className?: string;
  hrefPrefix?: string;
}

export function TagCloud3D({
  tags,
  radius = 150,
  className,
  hrefPrefix = '/tags',
}: TagCloud3DProps) {
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });

  // 使用球面分布算法计算标签位置
  const tagPositions = tags.map((tag, i) => {
    const phi = Math.acos(-1 + (2 * i) / tags.length);
    const theta = Math.sqrt(tags.length * Math.PI) * phi;
    return {
      ...tag,
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi),
    };
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({ x: y * 0.0001, y: x * 0.0001 });
  };

  return (
    <div
      className={cn('relative w-full h-[400px] overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotateX(${rotation.x}rad) rotateY(${rotation.y}rad)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {tagPositions.map((tag) => {
          const scale = (tag.z + radius * 2) / (radius * 3);
          const opacity = (tag.z + radius) / (radius * 2);

          return (
            <motion.div
              key={tag.id}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${tag.x}px, ${tag.y}px) scale(${scale})`,
                opacity,
              }}
              whileHover={{ scale: scale * 1.2 }}
            >
              <Link
                href={`${hrefPrefix}/${tag.slug}`}
                className={cn(
                  'px-3 py-1.5 rounded-lg border bg-cyber-dark/80 backdrop-blur-sm',
                  'hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50',
                  'transition-all duration-300 text-sm',
                  colorStyles[tag.color || 'cyan'].border,
                  colorStyles[tag.color || 'cyan'].light
                )}
              >
                {tag.name}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// 热门标签组件
export interface PopularTagsProps extends Omit<TagCloudProps, 'tags'> {
  limit?: number;
  sortBy?: 'count' | 'name' | 'random';
  useAllTags?: TagItem[];
}

export function PopularTags({
  limit = 10,
  sortBy = 'count',
  useAllTags,
  ...props
}: PopularTagsProps) {
  const sortedTags = React.useMemo(() => {
    const tags = useAllTags || [];
    const sorted = [...tags];

    switch (sortBy) {
      case 'count':
        return sorted.sort((a, b) => (b.count || 0) - (a.count || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'random':
        return sorted.sort(() => Math.random() - 0.5);
      default:
        return sorted;
    }
  }, [useAllTags, sortBy]);

  const popularTags = sortedTags.slice(0, limit);

  return <TagCloud tags={popularTags} {...props} />;
}

// 标签输入组件
export interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = '输入标签后按回车...',
  maxTags = 20,
  color = 'cyan',
  className,
}: TagInputProps) {
  const [input, setInput] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (tags.length < maxTags && !tags.includes(input.trim())) {
        onTagsChange([...tags, input.trim()]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const styles = colorStyles[color];

  return (
    <div
      className={cn(
        'flex flex-wrap gap-2 p-3 rounded-lg border-2 bg-cyber-dark/50',
        styles.border,
        'focus-within:ring-2 focus-within:ring-cyber-cyan/50',
        className
      )}
    >
      {tags.map((tag) => (
        <motion.span
          key={tag}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm',
            styles.bg,
            styles.border,
            styles.light
          )}
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:text-white transition-colors"
          >
            ×
          </button>
        </motion.span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-300 placeholder-gray-500"
      />
    </div>
  );
}

export default TagCloud;
