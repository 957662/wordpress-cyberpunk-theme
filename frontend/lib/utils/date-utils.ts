/**
 * Date Utilities
 * 日期处理工具函数
 */

/**
 * 格式化日期
 * @param date - 日期
 * @param format - 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const milliseconds = String(d.getMilliseconds()).padStart(3, '0');

  return format
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds);
}

/**
 * 格式化相对时间
 * @param date - 日期
 * @param locale - 地区代码
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date | string | number, locale: string = 'zh-CN'): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (locale === 'zh-CN') {
    if (diffSecs < 60) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    if (diffMonths < 12) return `${diffMonths}个月前`;
    return `${diffYears}年前`;
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSecs < 60) return rtf.format(-diffSecs, 'second');
  if (diffMins < 60) return rtf.format(-diffMins, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  if (diffMonths < 12) return rtf.format(-diffMonths, 'month');
  return rtf.format(-diffYears, 'year');
}

/**
 * 获取日期范围
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @returns 日期数组
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * 获取某月的所有日期
 * @param year - 年份
 * @param month - 月份（0-11）
 * @returns 日期数组
 */
export function getMonthDates(year: number, month: number): Date[] {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return getDateRange(startDate, endDate);
}

/**
 * 获取某周的所有日期
 * @param date - 日期
 * @returns 日期数组
 */
export function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);

  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return getDateRange(monday, sunday);
}

/**
 * 判断是否为闰年
 * @param year - 年份
 * @returns 是否为闰年
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 获取月份的天数
 * @param year - 年份
 * @param month - 月份（0-11）
 * @returns 天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 获取年份的天数
 * @param year - 年份
 * @returns 天数
 */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * 判断两个日期是否为同一天
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @returns 是否为同一天
 */
export function isSameDay(date1: Date | string | number, date2: Date | string | number): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * 判断是否为今天
 * @param date - 日期
 * @returns 是否为今天
 */
export function isToday(date: Date | string | number): boolean {
  return isSameDay(date, new Date());
}

/**
 * 判断是否为昨天
 * @param date - 日期
 * @returns 是否为昨天
 */
export function isYesterday(date: Date | string | number): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

/**
 * 判断是否为明天
 * @param date - 日期
 * @returns 是否为明天
 */
export function isTomorrow(date: Date | string | number): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
}

/**
 * 判断是否为工作日
 * @param date - 日期
 * @returns 是否为工作日
 */
export function isWeekday(date: Date | string | number): boolean {
  const d = new Date(date);
  const day = d.getDay();
  return day > 0 && day < 6;
}

/**
 * 判断是否为周末
 * @param date - 日期
 * @returns 是否为周末
 */
export function isWeekend(date: Date | string | number): boolean {
  return !isWeekday(date);
}

/**
 * 计算两个日期之间的天数差
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @returns 天数差
 */
export function daysBetween(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 计算两个日期之间的小时数差
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @returns 小时数差
 */
export function hoursBetween(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60));
}

/**
 * 计算年龄
 * @param birthDate - 出生日期
 * @returns 年龄
 */
export function calculateAge(birthDate: Date | string | number): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * 添加天数
 * @param date - 日期
 * @param days - 天数
 * @returns 新日期
 */
export function addDays(date: Date | string | number, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * 添加月数
 * @param date - 日期
 * @param months - 月数
 * @returns 新日期
 */
export function addMonths(date: Date | string | number, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * 添加年数
 * @param date - 日期
 * @param years - 年数
 * @returns 新日期
 */
export function addYears(date: Date | string | number, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * 减去天数
 * @param date - 日期
 * @param days - 天数
 * @returns 新日期
 */
export function subtractDays(date: Date | string | number, days: number): Date {
  return addDays(date, -days);
}

/**
 * 减去月数
 * @param date - 日期
 * @param months - 月数
 * @returns 新日期
 */
export function subtractMonths(date: Date | string | number, months: number): Date {
  return addMonths(date, -months);
}

/**
 * 减去年数
 * @param date - 日期
 * @param years - 年数
 * @returns 新日期
 */
export function subtractYears(date: Date | string | number, years: number): Date {
  return addYears(date, -years);
}

/**
 * 获取日期的开始时间（00:00:00）
 * @param date - 日期
 * @returns 新日期
 */
export function startOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 获取日期的结束时间（23:59:59）
 * @param date - 日期
 * @returns 新日期
 */
export function endOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 获取月份的开始日期
 * @param date - 日期
 * @returns 新日期
 */
export function startOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * 获取月份的结束日期
 * @param date - 日期
 * @returns 新日期
 */
export function endOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * 获取年份的开始日期
 * @param date - 日期
 * @returns 新日期
 */
export function startOfYear(date: Date | string | number): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), 0, 1);
}

/**
 * 获取年份的结束日期
 * @param date - 日期
 * @returns 新日期
 */
export function endOfYear(date: Date | string | number): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), 11, 31);
}

/**
 * 获取时区偏移（分钟）
 * @param date - 日期
 * @returns 时区偏移
 */
export function getTimezoneOffset(date: Date | string | number = new Date()): number {
  const d = new Date(date);
  return d.getTimezoneOffset();
}

/**
 * 转换为 UTC 时间
 * @param date - 日期
 * @returns UTC 时间
 */
export function toUTC(date: Date | string | number): Date {
  const d = new Date(date);
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

/**
 * 从 UTC 时间转换
 * @param date - UTC 时间
 * @returns 本地时间
 */
export function fromUTC(date: Date | string | number): Date {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
}

/**
 * 获取季度
 * @param date - 日期
 * @returns 季度（1-4）
 */
export function getQuarter(date: Date | string | number): number {
  const d = new Date(date);
  return Math.floor(d.getMonth() / 3) + 1;
}

/**
 * 获取星期几
 * @param date - 日期
 * @param locale - 地区代码
 * @returns 星期几
 */
export function getWeekday(date: Date | string | number, locale: string = 'zh-CN'): string {
  const d = new Date(date);
  const day = d.getDay();

  if (locale === 'zh-CN') {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[day];
  }

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[day];
}

/**
 * 获取月份名称
 * @param month - 月份（0-11）
 * @param locale - 地区代码
 * @returns 月份名称
 */
export function getMonthName(month: number, locale: string = 'zh-CN'): string {
  if (locale === 'zh-CN') {
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return months[month];
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
}

/**
 * 格式化时间段
 * @param seconds - 秒数
 * @returns 格式化后的时间段
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];

  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}秒`);

  return parts.join('');
}

/**
 * 获取时间戳（毫秒）
 * @param date - 日期
 * @returns 时间戳
 */
export function getTimestamp(date: Date | string | number = new Date()): number {
  return new Date(date).getTime();
}

/**
 * 从时间戳创建日期
 * @param timestamp - 时间戳
 * @returns Date 对象
 */
export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}

/**
 * 判断是否为过去日期
 * @param date - 日期
 * @returns 是否为过去日期
 */
export function isPast(date: Date | string | number): boolean {
  return new Date(date) < new Date();
}

/**
 * 判断是否为未来日期
 * @param date - 日期
 * @returns 是否为未来日期
 */
export function isFuture(date: Date | string | number): boolean {
  return new Date(date) > new Date();
}

/**
 * 判断日期是否在范围内
 * @param date - 日期
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @returns 是否在范围内
 */
export function isInRange(
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
): boolean {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
}
