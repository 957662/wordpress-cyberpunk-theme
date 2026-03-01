/**
 * TimeAgo - 相对时间显示组件
 * 将时间戳转换为"刚刚"、"5分钟前"等相对时间
 */

'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface TimeAgoProps {
  date: string | Date | number;
  className?: string;
  updateInterval?: number; // 更新间隔（毫秒）
  suffix?: string; // 后缀，如"前"
}

export function TimeAgo({
  date,
  className,
  updateInterval = 60000, // 默认每分钟更新
  suffix = '前',
}: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const formatted = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: zhCN,
      });
      setTimeAgo(formatted.replace('大约', ''));
    };

    updateTime();

    if (updateInterval > 0) {
      const interval = setInterval(updateTime, updateInterval);
      return () => clearInterval(interval);
    }
  }, [date, updateInterval]);

  return (
    <time className={cn('text-sm text-gray-400', className)} dateTime={new Date(date).toISOString()}>
      {timeAgo}
    </time>
  );
}

// 带完整日期的版本
export interface TimeAgoWithFullProps {
  date: string | Date | number;
  format?: string; // 日期格式
  className?: string;
  showTooltip?: boolean;
}

export function TimeAgoWithFull({
  date,
  format = 'yyyy-MM-dd HH:mm:ss',
  className,
  showTooltip = true,
}: TimeAgoWithFullProps) {
  const [timeAgo, setTimeAgo] = useState('');
  const [fullDate, setFullDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const formatted = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: zhCN,
      });
      setTimeAgo(formatted.replace('大约', ''));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    const dateObj = new Date(date);
    setFullDate(
      `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`
    );

    return () => clearInterval(interval);
  }, [date]);

  if (showTooltip) {
    return (
      <time
        className={cn('cursor-help', className)}
        dateTime={new Date(date).toISOString()}
        title={fullDate}
      >
        {timeAgo}
      </time>
    );
  }

  return (
    <time className={className} dateTime={new Date(date).toISOString()}>
      {timeAgo}
    </time>
  );
}

// 阅读时间估算
export interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  className?: string;
}

export function ReadingTime({
  content,
  wordsPerMinute = 200,
  className,
}: ReadingTimeProps) {
  const calculateReadingTime = () => {
    // 移除 Markdown 语法
    const cleanContent = content
      .replace(/```[\s\S]*?```/g, '') // 代码块
      .replace(/`[^`]+`/g, '') // 内联代码
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
      .replace(/[#*_~`>-]/g, '') // Markdown 符号
      .trim();

    // 计算字数（中文按字符，英文按单词）
    const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;
    const totalWords = chineseChars + englishWords;

    const minutes = Math.ceil(totalWords / wordsPerMinute);

    if (minutes < 1) {
      return '少于1分钟';
    }

    return `${minutes} 分钟`;
  };

  return (
    <span className={cn('text-sm text-gray-400', className)}>
      {calculateReadingTime()}阅读
    </span>
  );
}
