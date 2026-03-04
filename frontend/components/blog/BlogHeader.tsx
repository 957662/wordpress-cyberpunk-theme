import React from 'react';
import { formatDateTime } from '@/lib/dateUtils';
import { getReadingTime } from '@/lib/dateUtils';
import { Avatar } from '@/components/ui/avatar';

export interface BlogHeaderProps {
  title: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: Date | string;
  content: string;
  category?: string;
  tags?: string[];
}

export function BlogHeader({
  title,
  coverImage,
  author,
  publishedAt,
  content,
  category,
  tags = [],
}: BlogHeaderProps) {
  const readTime = getReadingTime(content);

  return (
    <header className="mb-8">
      {coverImage && (
        <div className="mb-8 h-96 overflow-hidden rounded-2xl bg-gray-200">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="mb-4">
        {category && (
          <span className="mr-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {category}
          </span>
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {readTime} min read
        </span>
      </div>

      <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
        {title}
      </h1>

      <div className="flex items-center space-x-4 border-y border-gray-200 py-4 dark:border-gray-800">
        {author.avatar && (
          <Avatar
            src={author.avatar}
            alt={author.name}
            size="lg"
            className="h-12 w-12"
          />
        )}
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {author.name}
          </p>
          {author.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {author.bio}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Published {formatDateTime(publishedAt)}
          </p>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
