'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostMetaProps {
  author?: string;
  authorImage?: string;
  date: string | Date;
  readTime?: number;
  views?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  layout?: 'horizontal' | 'vertical';
}

export const PostMeta: React.FC<PostMetaProps> = ({
  author,
  authorImage,
  date,
  readTime,
  views,
  className,
  variant = 'default',
  layout = 'horizontal',
}) => {
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const containerClass = cn(
    'flex items-center gap-4 text-sm',
    layout === 'horizontal' ? 'flex-row' : 'flex-col items-start',
    variant === 'compact' && 'text-xs',
    className
  );

  if (variant === 'compact') {
    return (
      <div className={containerClass}>
        <span className="flex items-center gap-1 text-gray-400">
          <Calendar className="w-3 h-3" />
          {formatDate(date)}
        </span>
        {readTime && (
          <span className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3 h-3" />
            {readTime} 分钟阅读
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={containerClass}
    >
      {author && (
        <div className="flex items-center gap-2">
          {authorImage ? (
            <img
              src={authorImage}
              alt={author}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-cyber-cyan/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-semibold">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-gray-300 font-medium">{author}</span>
        </div>
      )}

      <div className="flex items-center gap-4 text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(date)}
        </span>

        {readTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readTime} 分钟
          </span>
        )}

        {views && (
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {views.toLocaleString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

interface PostCategoryProps {
  category: string;
  className?: string;
  href?: string;
}

export const PostCategory: React.FC<PostCategoryProps> = ({
  category,
  className,
  href,
}) => {
  const content = (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 hover:bg-cyber-cyan/20 transition-colors">
      {category}
    </span>
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <span className={className}>{content}</span>;
};

interface PostTagsProps {
  tags: string[];
  className?: string;
  maxDisplay?: number;
}

export const PostTags: React.FC<PostTagsProps> = ({
  tags,
  className,
  maxDisplay,
}) => {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingTags = maxDisplay ? tags.slice(maxDisplay) : [];

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayTags.map((tag) => (
        <a
          key={tag}
          href={`/tag/${tag}`}
          className="inline-flex items-center px-2 py-1 rounded-md text-xs text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/5 transition-colors border border-transparent hover:border-cyber-cyan/20"
        >
          #{tag}
        </a>
      ))}
      {remainingTags.length > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs text-gray-500">
          +{remainingTags.length}
        </span>
      )}
    </div>
  );
};

interface PostStatsProps {
  views?: number;
  likes?: number;
  comments?: number;
  className?: string;
}

export const PostStats: React.FC<PostStatsProps> = ({
  views,
  likes,
  comments,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-4 text-sm text-gray-400', className)}>
      {views !== undefined && (
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {views.toLocaleString()}
        </span>
      )}
      {likes !== undefined && (
        <span className="flex items-center gap-1">
          <span>❤️</span>
          {likes.toLocaleString()}
        </span>
      )}
      {comments !== undefined && (
        <span className="flex items-center gap-1">
          <span>💬</span>
          {comments.toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default PostMeta;
