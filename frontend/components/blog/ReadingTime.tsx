'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  showLabel?: boolean;
  className?: string;
  onChange?: (minutes: number) => void;
}

/**
 * ReadingTime Component
 *
 * Calculates and displays estimated reading time for content
 * Based on average reading speed of 200-250 words per minute
 */
export const ReadingTime: React.FC<ReadingTimeProps> = ({
  content,
  wordsPerMinute = 200,
  showLabel = true,
  className = '',
  onChange,
}) => {
  const [readingTime, setReadingTime] = useState<number>(0);

  useEffect(() => {
    // Strip HTML tags
    const textContent = content.replace(/<[^>]*>/g, '');

    // Split into words (Chinese characters + English words)
    const chineseChars = (textContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (textContent.match(/[a-zA-Z]+/g) || []).length;

    // Calculate total word count (Chinese counts as half words for reading speed)
    const totalWords = chineseChars * 0.5 + englishWords;

    // Calculate reading time
    const minutes = Math.ceil(totalWords / wordsPerMinute);
    const finalTime = Math.max(1, minutes); // Minimum 1 minute

    setReadingTime(finalTime);

    // Callback if provided
    if (onChange) {
      onChange(finalTime);
    }
  }, [content, wordsPerMinute, onChange]);

  if (readingTime === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-cyber-muted ${className}`}>
      <Clock className="w-4 h-4" />
      <span>
        {readingTime} {showLabel && '分钟阅读'}
      </span>
    </div>
  );
};

/**
 * Hook to calculate reading time
 *
 * @example
 * const readingTime = useReadingTime(content);
 * console.log(`${readingTime} min read`);
 */
export function useReadingTime(
  content: string,
  wordsPerMinute: number = 200,
): number {
  return useMemo(() => {
    // Strip HTML tags
    const textContent = content.replace(/<[^>]*>/g, '');

    // Split into words
    const chineseChars = (textContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (textContent.match(/[a-zA-Z]+/g) || []).length;

    // Calculate
    const totalWords = chineseChars * 0.5 + englishWords;
    const minutes = Math.ceil(totalWords / wordsPerMinute);

    return Math.max(1, minutes);
  }, [content, wordsPerMinute]);
}

/**
 * Utility function to calculate reading time
 *
 * @example
 * const time = calculateReadingTime(post.content);
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200,
): number {
  const textContent = content.replace(/<[^>]*>/g, '');
  const chineseChars = (textContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (textContent.match(/[a-zA-Z]+/g) || []).length;
  const totalWords = chineseChars * 0.5 + englishWords;
  const minutes = Math.ceil(totalWords / wordsPerMinute);

  return Math.max(1, minutes);
}

export default ReadingTime;
