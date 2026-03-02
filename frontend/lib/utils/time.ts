/**
 * 时间格式化工具
 */

import { format, formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number, formatStr: string = 'yyyy-MM-dd'): string {
  try {
    return format(new Date(date), formatStr, { locale: zhCN });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * 格式化为相对时间（如"3小时前"）
 */
export function formatRelativeTime(date: Date | string | number): string {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: zhCN,
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
}

/**
 * 格式化为友好的时间显示
 */
export function formatFriendlyTime(date: Date | string | number): string {
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const daysDiff = differenceInDays(now, targetDate);
    const hoursDiff = differenceInHours(now, targetDate);
    const minutesDiff = differenceInMinutes(now, targetDate);

    if (minutesDiff < 1) {
      return '刚刚';
    } else if (minutesDiff < 60) {
      return `${minutesDiff}分钟前`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff}小时前`;
    } else if (daysDiff < 7) {
      return `${daysDiff}天前`;
    } else if (daysDiff < 30) {
      return `${Math.floor(daysDiff / 7)}周前`;
    } else if (daysDiff < 365) {
      return `${Math.floor(daysDiff / 30)}个月前`;
    } else {
      return format(targetDate, 'yyyy年MM月dd日', { locale: zhCN });
    }
  } catch (error) {
    console.error('Error formatting friendly time:', error);
    return String(date);
  }
}

/**
 * 计算阅读时间（基于字数）
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 格式化持续时间
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  } else {
    return `${secs}秒`;
  }
}

/**
 * 判断是否为今天
 */
export function isToday(date: Date | string | number): boolean {
  const today = new Date();
  const targetDate = new Date(date);

  return (
    today.getFullYear() === targetDate.getFullYear() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getDate() === targetDate.getDate()
  );
}

/**
 * 判断是否为本周
 */
export function isThisWeek(date: Date | string | number): boolean {
  const today = new Date();
  const targetDate = new Date(date);
  const weekDiff = differenceInDays(today, targetDate);

  return weekDiff >= 0 && weekDiff < 7;
}

/**
 * 获取日期范围
 */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return { start, end };
}

/**
 * 格式化日期范围
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (format(startDate, 'yyyy-MM') === format(endDate, 'yyyy-MM')) {
      return `${format(startDate, 'yyyy年MM月dd日', { locale: zhCN })} - ${format(endDate, 'dd日', { locale: zhCN })}`;
    } else {
      return `${format(startDate, 'yyyy年MM月dd日', { locale: zhCN })} - ${format(endDate, 'yyyy年MM月dd日', { locale: zhCN })}`;
    }
  } catch (error) {
    console.error('Error formatting date range:', error);
    return '';
  }
}
