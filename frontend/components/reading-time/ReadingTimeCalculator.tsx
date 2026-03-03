'use client';

import React, { useEffect, useState } from 'react';
import { Clock, BookOpen } from 'lucide-react';

interface ReadingTimeCalculatorProps {
  content: string;
  wordsPerMinute?: number;
  showWordCount?: boolean;
  className?: string;
}

interface ReadingTimeInfo {
  minutes: number;
  seconds: number;
  wordCount: number;
  formatted: string;
}

export const ReadingTimeCalculator: React.FC<ReadingTimeCalculatorProps> = ({
  content,
  wordsPerMinute = 200,
  showWordCount = true,
  className = '',
}) => {
  const [readingTime, setReadingTime] = useState<ReadingTimeInfo>({
    minutes: 0,
    seconds: 0,
    wordCount: 0,
    formatted: '0 min read',
  });

  useEffect(() => {
    if (!content) return;

    // 移除 Markdown 语法标记
    const cleanContent = content
      .replace(/```[\s\S]*?```/g, '') // 代码块
      .replace(/`[^`]*`/g, '') // 行内代码
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // 图片
      .replace(/[#*_~`>|-]/g, '') // 其他 Markdown 标记
      .trim();

    // 统计中文字符和英文单词
    const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;
    const totalWords = chineseChars + englishWords;

    // 计算阅读时间
    const totalSeconds = Math.ceil((totalWords / wordsPerMinute) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // 格式化显示
    let formatted = '';
    if (minutes > 0) {
      formatted = seconds > 30 ? `${minutes + 1} min read` : `${minutes} min read`;
    } else if (seconds > 0) {
      formatted = `${seconds} sec read`;
    } else {
      formatted = 'Less than 1 min read';
    }

    setReadingTime({
      minutes,
      seconds,
      wordCount: totalWords,
      formatted,
    });
  }, [content, wordsPerMinute]);

  if (!content || readingTime.wordCount === 0) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-2 text-sm text-gray-400 ${className}`}>
      <Clock className="w-4 h-4" />
      <span>{readingTime.formatted}</span>
      {showWordCount && (
        <>
          <span className="text-gray-600">·</span>
          <BookOpen className="w-4 h-4" />
          <span>{readingTime.wordCount.toLocaleString()} words</span>
        </>
      )}
    </div>
  );
};

// Hook 版本
export const useReadingTime = (content: string, wordsPerMinute: number = 200) => {
  const [readingTime, setReadingTime] = useState<ReadingTimeInfo>({
    minutes: 0,
    seconds: 0,
    wordCount: 0,
    formatted: '0 min read',
  });

  useEffect(() => {
    if (!content) return;

    const cleanContent = content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/[#*_~`>|-]/g, '')
      .trim();

    const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;
    const totalWords = chineseChars + englishWords;

    const totalSeconds = Math.ceil((totalWords / wordsPerMinute) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let formatted = '';
    if (minutes > 0) {
      formatted = seconds > 30 ? `${minutes + 1} min read` : `${minutes} min read`;
    } else if (seconds > 0) {
      formatted = `${seconds} sec read`;
    } else {
      formatted = 'Less than 1 min read';
    }

    setReadingTime({
      minutes,
      seconds,
      wordCount: totalWords,
      formatted,
    });
  }, [content, wordsPerMinute]);

  return readingTime;
};

export default ReadingTimeCalculator;
