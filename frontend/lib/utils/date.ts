/**
 * Date Utility Functions
 * 日期处理工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string | number,
  format: 'full' | 'long' | 'medium' | 'short' | 'relative' = 'medium'
): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);

  if (format === 'relative') {
    return formatRelativeTime(dateObj.toString());
  }

  const options: Intl.DateTimeFormatOptions = {
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  }[format];

  return new Intl.DateTimeFormat('zh-CN', options).format(dateObj);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    年: 31536000,
    个月: 2592000,
    周: 604800,
    天: 86400,
    小时: 3600,
    分钟: 60,
    秒: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval}${unit}前`;
    }
  }

  return '刚刚';
}

/**
 * 计算阅读时间
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 获取今天的开始时间
 */
export function startOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 获取今天的结束时间
 */
export function endOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 添加天数
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 添加月数
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * 添加年数
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * 计算两个日期之间的天数
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * 判断是否为今天
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * 判断是否为本周
 */
export function isThisWeek(date: Date): boolean {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  return date >= startOfWeek && date <= endOfWeek;
}

/**
 * 格式化为 ISO 8601 格式
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * 从 ISO 8601 格式解析
 */
export function fromISOString(isoString: string): Date {
  return new Date(isoString);
}

/**
 * 获取时间戳
 */
export function getTimestamp(date: Date = new Date()): number {
  return date.getTime();
}

/**
 * 从时间戳创建日期
 */
export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}
