/**
 * 文章元数据展示组件
 * 显示作者、日期、阅读时间等信息
 */

import React from 'react';
import Link from 'next/link';
import { formatDate, formatDistanceToNow } from '@/lib/utils';

export interface ArticleMetaDisplayProps {
  author?: {
    id: number;
    name: string;
    avatar?: string;
    slug?: string;
  };
  date: string | Date;
  readingTime?: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  views?: number;
  className?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  showCategory?: boolean;
  showViews?: boolean;
  compact?: boolean;
}

export const ArticleMetaDisplay: React.FC<ArticleMetaDisplayProps> = ({
  author,
  date,
  readingTime,
  category,
  views,
  className = '',
  showAuthor = true,
  showDate = true,
  showReadingTime = true,
  showCategory = false,
  showViews = false,
  compact = false,
}) => {
  const metaItems: React.ReactNode[] = [];

  // 作者
  if (showAuthor && author) {
    const authorLink = author.slug ? `/author/${author.slug}` : `/author/${author.id}`;
    metaItems.push(
      <Link
        key="author"
        href={authorLink}
        className="flex items-center text-gray-400 hover:text-cyber-cyan transition-colors"
      >
        {author.avatar && (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-5 h-5 rounded-full mr-2 object-cover"
          />
        )}
        <span className="text-sm">{author.name}</span>
      </Link>
    );
  }

  // 发布日期
  if (showDate && date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formattedDate = formatDistanceToNow(dateObj);

    metaItems.push(
      <div key="date" className="flex items-center text-gray-400">
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <time dateTime={dateObj.toISOString()} className="text-sm">
          {compact ? formattedDate : formatDate(dateObj)}
        </time>
      </div>
    );
  }

  // 阅读时间
  if (showReadingTime && readingTime) {
    metaItems.push(
      <div key="reading-time" className="flex items-center text-gray-400">
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm">{readingTime} 分钟阅读</span>
      </div>
    );
  }

  // 分类
  if (showCategory && category) {
    metaItems.push(
      <Link
        key="category"
        href={`/category/${category.slug}`}
        className="flex items-center text-cyber-purple hover:text-cyber-purple/80 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <span className="text-sm">{category.name}</span>
      </Link>
    );
  }

  // 浏览量
  if (showViews && views) {
    metaItems.push(
      <div key="views" className="flex items-center text-gray-400">
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span className="text-sm">{views.toLocaleString()} 次浏览</span>
      </div>
    );
  }

  if (metaItems.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 flex-wrap ${className}`}>
      {metaItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && !compact && (
            <span className="text-gray-600">•</span>
          )}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ArticleMetaDisplay;
