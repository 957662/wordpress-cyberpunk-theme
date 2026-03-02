/**
 * MetaInfo 元信息组件
 * 用于显示文章的元数据（日期、作者、阅读时间等）
 */

'use client';

import React from 'react';
import { Calendar, Clock, User, Eye } from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

interface MetaInfoProps {
  date?: string;
  author?: string;
  authorAvatar?: string;
  readingTime?: number;
  views?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

export function MetaInfo({
  date,
  author,
  authorAvatar,
  readingTime,
  views,
  className = '',
  variant = 'default',
}: MetaInfoProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-4 text-sm text-gray-400', className)}>
        {date && <span>{formatRelativeTime(date)}</span>}
        {readingTime && <span>{readingTime} 分钟阅读</span>}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-4 text-sm text-gray-400', className)}>
        {date && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatRelativeTime(date)}</span>
          </div>
        )}
        {readingTime && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} 分钟</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-4 text-sm text-gray-400', className)}>
      {date && (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyber-cyan" />
          <time dateTime={date}>{formatRelativeTime(date)}</time>
        </div>
      )}

      {author && (
        <div className="flex items-center gap-2">
          {authorAvatar && (
            <img
              src={authorAvatar}
              alt={author}
              className="w-5 h-5 rounded-full"
            />
          )}
          <User className="w-4 h-4 text-cyber-purple" />
          <span>{author}</span>
        </div>
      )}

      {readingTime && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyber-pink" />
          <span>{readingTime} 分钟阅读</span>
        </div>
      )}

      {views !== undefined && (
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyber-yellow" />
          <span>{views} 次浏览</span>
        </div>
      )}
    </div>
  );
}

export default MetaInfo;
