'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export interface TimeAgoProps {
  date: Date | string | number;
  formatter?: (value: number, unit: string) => string;
  updateInterval?: number;
  showTooltip?: boolean;
  className?: string;
}

/**
 * TimeAgo - 相对时间显示组件
 *
 * 显示"X分钟前"、"X小时前"等相对时间
 *
 * @example
 * ```tsx
 * <TimeAgo date={new Date()} />
 * <TimeAgo date="2024-03-01" />
 * <TimeAgo date={Date.now() - 3600000} />
 * ```
 */
export const TimeAgo: React.FC<TimeAgoProps> = ({
  date,
  formatter,
  updateInterval = 60000, // 默认每分钟更新
  showTooltip = true,
  className = '',
}) => {
  const [timeAgo, setTimeAgo] = useState('');

  const getTimeAgo = (dateInput: Date | string | number): string => {
    const now = new Date().getTime();
    const past = new Date(dateInput).getTime();
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return formatter ? formatter(diffInSeconds, 'second') : 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return formatter
        ? formatter(diffInMinutes, 'minute')
        : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return formatter
        ? formatter(diffInHours, 'hour')
        : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return formatter
        ? formatter(diffInDays, 'day')
        : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return formatter
        ? formatter(diffInWeeks, 'week')
        : `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return formatter
        ? formatter(diffInMonths, 'month')
        : `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return formatter
      ? formatter(diffInYears, 'year')
      : `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  const getFullDate = (dateInput: Date | string | number): string => {
    const date = new Date(dateInput);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    setTimeAgo(getTimeAgo(date));

    if (updateInterval > 0) {
      const interval = setInterval(() => {
        setTimeAgo(getTimeAgo(date));
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [date, updateInterval]);

  const fullDate = getFullDate(date);

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm text-gray-400 ${className}`}
      title={showTooltip ? fullDate : undefined}
    >
      <Clock className="w-3 h-3" />
      <time dateTime={new Date(date).toISOString()}>{timeAgo}</time>
    </span>
  );
};

/**
 * 格式化日期范围
 */
export const DateRange: React.FC<{
  start: Date | string | number;
  end: Date | string | number;
  format?: 'short' | 'long' | 'relative';
}> = ({ start, end, format = 'long' }) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const formatShort = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatLong = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  let display = '';
  if (format === 'short') {
    display = `${formatShort(startDate)} - ${formatShort(endDate)}`;
  } else if (format === 'long') {
    display = `${formatLong(startDate)} - ${formatLong(endDate)}`;
  } else {
    display = `${getTimeAgo(start)} - ${getTimeAgo(end)}`;
  }

  return <span className="text-sm text-gray-400">{display}</span>;
};

/**
 * 读取时间估算器
 */
export const ReadTime: React.FC<{
  content: string;
  wordsPerMinute?: number;
  className?: string;
}> = ({ content, wordsPerMinute = 200, className = '' }) => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return (
    <span className={`inline-flex items-center gap-1 text-sm text-gray-400 ${className}`}>
      <Clock className="w-3 h-3" />
      <span>{minutes} min read</span>
    </span>
  );
};

// 辅助函数
function getTimeAgo(dateInput: Date | string | number): string {
  const now = new Date().getTime();
  const past = new Date(dateInput).getTime();
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

export default TimeAgo;
