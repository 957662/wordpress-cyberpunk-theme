/**
 * 日期格式化工具函数
 */

import { format, formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number, formatStr: string = 'yyyy-MM-dd HH:mm:ss'): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return format(d, formatStr, { locale: zhCN });
  } catch (error) {
    console.error('[Date] Format error:', error);
    return '';
  }
}

/**
 * 相对时间格式化 (例如: "3分钟前")
 */
export function formatRelativeTime(date: Date | string | number): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return formatDistanceToNow(d, { locale: zhCN, addSuffix: true });
  } catch (error) {
    console.error('[Date] Relative format error:', error);
    return '';
  }
}

/**
 * 智能时间格式化 (根据时间差自动选择格式)
 */
export function formatSmartTime(date: Date | string | number): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const now = new Date();
    
    const minutes = differenceInMinutes(now, d);
    const hours = differenceInHours(now, d);
    const days = differenceInDays(now, d);

    if (minutes < 1) {
      return '刚刚';
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return formatDate(d, 'yyyy-MM-dd');
    }
  } catch (error) {
    console.error('[Date] Smart format error:', error);
    return '';
  }
}

/**
 * 获取时间段描述
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

/**
 * 获取时间段问候语
 */
export function getGreeting(): string {
  const timeOfDay = getTimeOfDay();

  const greetings = {
    morning: '早上好',
    afternoon: '下午好',
    evening: '晚上好',
    night: '夜深了',
  };

  return greetings[timeOfDay];
}

/**
 * 判断是否为今天
 */
export function isToday(date: Date | string | number): boolean {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const today = new Date();

  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

/**
 * 判断是否为本周
 */
export function isThisWeek(date: Date | string | number): boolean {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 7;
}

/**
 * 计算阅读时间 (基于字数)
 */
export function calculateReadingTime(wordCount: number, wordsPerMinute: number = 200): string {
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) {
    return '不到1分钟';
  } else if (minutes < 60) {
    return `约${minutes}分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `约${hours}小时${remainingMinutes}分钟`;
  }
}

/**
 * 格式化日期范围
 */
export function formatDateRange(startDate: Date | string | number, endDate: Date | string | number): string {
  const start = typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;

  const startStr = formatDate(start, 'yyyy-MM-dd');
  const endStr = formatDate(end, 'yyyy-MM-dd');

  return `${startStr} ~ ${endStr}`;
}

/**
 * 获取星期几
 */
export function getWeekday(date: Date | string | number, format: 'long' | 'short' = 'long'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const weekdays = {
    long: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    short: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  };

  return weekdays[format][d.getDay()];
}

/**
 * 倒计时格式化
 */
export function formatCountdown(targetDate: Date | string | number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const target = typeof targetDate === 'string' || typeof targetDate === 'number' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, formatted: '已结束' };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;

  return { days, hours, minutes, seconds, formatted };
}
