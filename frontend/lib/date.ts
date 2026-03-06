/**
 * 日期处理工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return formatRelativeTime(dateObj);
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      : {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };

  return dateObj.toLocaleDateString('zh-CN', options);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}天前`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}周前`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}年前`;
}

/**
 * 计算阅读时间
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '');

  // 计算中文字符数
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;

  // 计算英文单词数
  const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0;

  // 计算总阅读时间（分钟）
  const readingTime = (chineseChars / 400 + englishWords / wordsPerMinute);

  return Math.max(1, Math.ceil(readingTime));
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}小时`;
  }

  return `${hours}小时${remainingMinutes}分钟`;
}

/**
 * 判断是否为今天
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  );
}

/**
 * 判断是否为本周
 */
export function isThisWeek(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return dateObj >= startOfWeek && dateObj < endOfWeek;
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
export function formatDateRange(start: string | Date, end: string | Date): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return `${startDate.toLocaleDateString('zh-CN', options)} - ${endDate.toLocaleDateString('zh-CN', options)}`;
}

/**
 * 获取月份名称
 */
export function getMonthName(month: number, format: 'short' | 'long' = 'long'): string {
  const date = new Date();
  date.setMonth(month);

  return date.toLocaleDateString('zh-CN', { month: format });
}

/**
 * 获取星期名称
 */
export function getWeekdayName(day: number, format: 'short' | 'long' = 'long'): string {
  const date = new Date();
  date.setDate(day);

  return date.toLocaleDateString('zh-CN', { weekday: format });
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
 * 比较两个日期
 */
export function compareDates(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  return d1.getTime() - d2.getTime();
}

/**
 * 获取时间戳
 */
export function getTimestamp(date?: Date): number {
  return date ? date.getTime() : Date.now();
}

/**
 * 从时间戳创建日期
 */
export function dateFromTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}

/**
 * 格式化 ISO 日期
 */
export function formatISODate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

/**
 * 解析 ISO 日期
 */
export function parseISODate(isoString: string): Date {
  return new Date(isoString);
}

/**
 * 获取当前日期字符串
 */
export function getCurrentDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * 获取当前时间字符串
 */
export function getCurrentTimeString(): string {
  return new Date().toTimeString().split(' ')[0];
}

/**
 * 获取当前日期时间字符串
 */
export function getCurrentDateTimeString(): string {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

/**
 * 验证日期格式
 */
export function isValidDate(date: any): boolean {
  if (!(date instanceof Date) && typeof date !== 'string') {
    return false;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * 获取日期的开始时间（00:00:00）
 */
export function getStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 获取日期的结束时间（23:59:59）
 */
export function getEndOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 获取月份的开始日期
 */
export function getStartOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 获取月份的结束日期
 */
export function getEndOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 获取年份的开始日期
 */
export function getStartOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(0, 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 获取年份的结束日期
 */
export function getEndOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(11, 31);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 计算两个日期之间的天数差
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 获取季度
 */
export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

/**
 * 获取周数
 */
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;

  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * 判断是否为工作日
 */
export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day > 0 && day < 6;
}

/**
 * 判断是否为周末
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
