/**
 * Date Utilities
 * 日期工具函数
 */

/**
 * 格式化日期
 * @param date - 日期对象或时间戳
 * @param format - 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化相对时间
 * @param date - 日期对象或时间戳
 * @param locale - 语言环境
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date | string | number, locale: string = 'zh-CN'): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (locale === 'zh-CN') {
    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 30) return `${days} 天前`;
    if (months < 12) return `${months} 个月前`;
    return `${years} 年前`;
  } else {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (seconds < 60) return rtf.format(-seconds, 'second');
    if (minutes < 60) return rtf.format(-minutes, 'minute');
    if (hours < 24) return rtf.format(-hours, 'hour');
    if (days < 30) return rtf.format(-days, 'day');
    if (months < 12) return rtf.format(-months, 'month');
    return rtf.format(-years, 'year');
  }
}

/**
 * 获取日期范围
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @returns 日期数组
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * 获取本周日期范围
 * @returns 本周的日期范围
 */
export function getThisWeek(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 调整为周一

  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * 获取本月日期范围
 * @returns 本月的日期范围
 */
export function getThisMonth(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return { start, end };
}

/**
 * 获取本年日期范围
 * @returns 本年的日期范围
 */
export function getThisYear(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  return { start, end };
}

/**
 * 判断是否为今天
 * @param date - 日期
 * @returns 是否为今天
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * 判断是否为昨天
 * @param date - 日期
 * @returns 是否为昨天
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
}

/**
 * 判断是否为本周
 * @param date - 日期
 * @returns 是否为本周
 */
export function isThisWeek(date: Date): boolean {
  const { start, end } = getThisWeek();
  return date >= start && date <= end;
}

/**
 * 判断是否为本月
 * @param date - 日期
 * @returns 是否为本月
 */
export function isThisMonth(date: Date): boolean {
  const now = new Date();
  return date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}

/**
 * 判断是否为本年
 * @param date - 日期
 * @returns 是否为本年
 */
export function isThisYear(date: Date): boolean {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
}

/**
 * 计算两个日期之间的天数差
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @returns 天数差
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

/**
 * 计算两个日期之间的小时差
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @returns 小时差
 */
export function hoursBetween(date1: Date, date2: Date): number {
  const oneHour = 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneHour);
}

/**
 * 计算两个日期之间的分钟差
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @returns 分钟差
 */
export function minutesBetween(date1: Date, date2: Date): number {
  const oneMinute = 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneMinute);
}

/**
 * 添加天数
 * @param date - 日期
 * @param days - 天数
 * @returns 新日期
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 添加月数
 * @param date - 日期
 * @param months - 月数
 * @returns 新日期
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * 添加年数
 * @param date - 日期
 * @param years - 年数
 * @returns 新日期
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * 获取月份的第一天
 * @param date - 日期
 * @returns 第一天
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * 获取月份的最后一天
 * @param date - 日期
 * @returns 最后一天
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * 获取月份的天数
 * @param date - 日期
 * @returns 天数
 */
export function getDaysInMonth(date: Date): number {
  return getLastDayOfMonth(date).getDate();
}

/**
 * 获取星期几的名称
 * @param date - 日期
 * @param locale - 语言环境
 * @returns 星期几的名称
 */
export function getDayName(date: Date, locale: string = 'zh-CN'): string {
  const days = locale === 'zh-CN'
    ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return days[date.getDay()];
}

/**
 * 获取月份的名称
 * @param date - 日期
 * @param locale - 语言环境
 * @returns 月份的名称
 */
export function getMonthName(date: Date, locale: string = 'zh-CN'): string {
  const months = locale === 'zh-CN'
    ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return months[date.getMonth()];
}

/**
 * 解析日期字符串
 * @param str - 日期字符串
 * @param format - 格式
 * @returns 日期对象
 */
export function parseDate(str: string, format: string = 'YYYY-MM-DD'): Date | null {
  try {
    const parts: Record<string, number> = {};

    if (format.includes('YYYY')) {
      const yearMatch = str.match(/(\d{4})/);
      if (yearMatch) parts.year = parseInt(yearMatch[1]);
    }

    if (format.includes('MM')) {
      const monthMatch = str.match(/(\d{2})/g)?.[format.indexOf('MM') < format.indexOf('DD') ? 0 : 1];
      if (monthMatch) parts.month = parseInt(monthMatch) - 1;
    }

    if (format.includes('DD')) {
      const dayMatch = str.match(/(\d{2})/g)?.[format.indexOf('DD') > format.indexOf('MM') ? 1 : 0];
      if (dayMatch) parts.day = parseInt(dayMatch);
    }

    return new Date(parts.year ?? 0, parts.month ?? 0, parts.day ?? 1);
  } catch {
    return null;
  }
}

/**
 * 获取时间戳（秒）
 * @param date - 日期
 * @returns 时间戳（秒）
 */
export function getTimestamp(date: Date = new Date()): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * 从时间戳创建日期
 * @param timestamp - 时间戳（秒）
 * @returns 日期对象
 */
export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * 获取时区偏移
 * @param date - 日期
 * @returns 时区偏移字符串
 */
export function getTimezoneOffset(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const sign = offset <= 0 ? '+' : '-';

  return `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * 获取 ISO 8601 格式的日期字符串
 * @param date - 日期
 * @returns ISO 8601 字符串
 */
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 获取当前日期的开始时间（00:00:00）
 * @param date - 日期
 * @returns 开始时间
 */
export function startOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 获取当前日期的结束时间（23:59:59）
 * @param date - 日期
 * @returns 结束时间
 */
export function endOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}
