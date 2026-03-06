'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingTimeEstimatorProps {
  /** 文章内容文本 */
  content: string;
  /** 平均阅读速度（字/分钟）*/
  wordsPerMinute?: number;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义标签文本 */
  label?: string;
}

/**
 * 阅读时间估算器组件
 *
 * 根据文章内容字数和平均阅读速度，估算阅读所需时间
 *
 * @example
 * ```tsx
 * <ReadingTimeEstimator content="这是一篇很长的文章内容..." />
 *
 * <ReadingTimeEstimator
 *   content="文章内容"
 *   wordsPerMinute={300}
 *   showIcon
 *   label="预计阅读时间"
 * />
 * ```
 */
export const ReadingTimeEstimator: React.FC<ReadingTimeEstimatorProps> = ({
  content,
  wordsPerMinute = 200, // 默认每分钟200字（中文）
  showIcon = true,
  className,
  label = '阅读时间',
}) => {
  const [wordCount, setWordCount] = useState(0);

  // 计算字数（支持中英文混合）
  useEffect(() => {
    if (!content) {
      setWordCount(0);
      return;
    }

    // 移除HTML标签和多余空格
    const cleanText = content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // 计算中文字符数
    const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;

    // 计算英文单词数
    const englishWords = (cleanText.match(/[a-zA-Z]+/g) || []).length;

    setWordCount(chineseChars + englishWords);
  }, [content]);

  // 计算阅读时间
  const readingTime = useMemo(() => {
    if (wordCount === 0) return 0;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  }, [wordCount, wordsPerMinute]);

  // 格式化时间显示
  const formatTime = (minutes: number): string => {
    if (minutes < 1) return '1 分钟';
    if (minutes < 60) return `${minutes} 分钟`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) return `${hours} 小时`;
    return `${hours} 小时 ${remainingMinutes} 分钟`;
  };

  // 获取字数显示
  const getWordCountText = (): string => {
    if (wordCount < 1000) return `${wordCount} 字`;
    return `${(wordCount / 1000).toFixed(1)}k 字`;
  };

  if (!content || wordCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400',
        className
      )}
    >
      {showIcon && (
        <Clock className="h-4 w-4" />
      )}

      <span className="font-medium">{label}:</span>
      <span className="text-gray-900 dark:text-gray-100">
        {formatTime(readingTime)}
      </span>

      <span className="text-gray-400">•</span>

      {showIcon && (
        <BookOpen className="h-4 w-4" />
      )}

      <span className="text-gray-900 dark:text-gray-100">
        {getWordCountText()}
      </span>
    </div>
  );
};

/**
 * 阅读时间估算器 Hook
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { readingTime, wordCount, formatTime } = useReadingTime(content);
 *   return <div>预计阅读时间: {formatTime(readingTime)}</div>;
 * }
 * ```
 */
export const useReadingTime = (
  content: string,
  wordsPerMinute: number = 200
) => {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!content) {
      setWordCount(0);
      return;
    }

    const cleanText = content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (cleanText.match(/[a-zA-Z]+/g) || []).length;

    setWordCount(chineseChars + englishWords);
  }, [content]);

  const readingTime = useMemo(() => {
    if (wordCount === 0) return 0;
    return Math.ceil(wordCount / wordsPerMinute);
  }, [wordCount, wordsPerMinute]);

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return '1 分钟';
    if (minutes < 60) return `${minutes} 分钟`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) return `${hours} 小时`;
    return `${hours} 小时 ${remainingMinutes} 分钟`;
  };

  return {
    wordCount,
    readingTime,
    formatTime,
  };
};

export default ReadingTimeEstimator;
