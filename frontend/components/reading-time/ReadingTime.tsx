'use client';

import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  variant?: 'default' | 'compact' | 'minimal';
  showIcon?: boolean;
  className?: string;
}

export const ReadingTime: React.FC<ReadingTimeProps> = ({
  content,
  wordsPerMinute = 200,
  variant = 'default',
  showIcon = true,
  className,
}) => {
  const readingTime = useMemo(() => {
    // Remove HTML tags and count words
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Calculate reading time
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return {
      wordCount,
      minutes,
      text: minutes === 1 ? '1 min read' : `${minutes} min read`,
    };
  }, [content, wordsPerMinute]);

  const variants = {
    default: (
      <div className={cn('flex items-center gap-2 text-sm text-gray-400', className)}>
        {showIcon && <Clock size={16} />}
        <span>{readingTime.text}</span>
      </div>
    ),
    compact: (
      <div className={cn('flex items-center gap-1.5 text-xs text-gray-500', className)}>
        {showIcon && <Clock size={14} />}
        <span>{readingTime.minutes}m</span>
      </div>
    ),
    minimal: (
      <span className={cn('text-xs text-gray-500', className)}>
        {readingTime.minutes} min read
      </span>
    ),
  };

  return variants[variant];
};

export default ReadingTime;
