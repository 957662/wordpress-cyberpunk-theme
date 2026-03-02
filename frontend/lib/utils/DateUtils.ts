/**
 * Date Utilities
 * 日期处理工具集
 */

// ============================================
// 类型定义
// ============================================

export interface DateFormatOptions {
  format?: 'short' | 'long' | 'full' | 'relative' | 'custom';
  locale?: string;
  customFormat?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// ============================================
// 格式化函数
// ============================================

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const { format = 'long', locale = 'zh-CN', customFormat } = options;

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  if (format === 'custom' && customFormat) {
    return formatCustom(dateObj, customFormat);
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    },
    relative: undefined,
  }[format] || formatOptions.long;

  if (format === 'relative') {
    return formatRelative(dateObj);
  }

  return dateObj.toLocaleDateString(locale, formatOptions);
}

/**
 * 自定义日期格式
 */
export function formatCustom(date: Date, format: string): string {
  const map: Record<string, string> = {
    'YYYY': date.getFullYear().toString(),
    'YY': date.getFullYear().toString().slice(-2),
    'MM': String(date.getMonth() + 1).padStart(2, '0'),
    'M': String(date.getMonth() + 1),
    'DD': String(date.getDate()).padStart(2, '0'),
    'D': String(date.getDate()),
    'HH': String(date.getHours()).padStart(2, '0'),
    'H': String(date.getHours()),
    'mm': String(date.getMinutes()).padStart(2, '0'),
    'm': String(date.getMinutes()),
    'ss': String(date.getSeconds()).padStart(2, '0'),
    's': String(date.getSeconds()),
  };

  let result = format;
  Object.entries(map).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });

  return result;
}

/**
 * 相对时间格式（如：3小时前）
 */
export function formatRelative(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return '刚刚';
  } else if (diffMin < 60) {
    return `${diffMin}分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour}小时前`;
  } else if (diffDay < 30) {
    return `${diffDay}天前`;
  } else if (diffMonth < 12) {
    return `${diffMonth}个月前`;
  } else {
    return `${diffYear}年前`;
  }
}

// ============================================
// 计算函数
// ============================================

/**
 * 计算两个日期之间的天数差
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
 * 减去天数
 */
export function subDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * 减去月数
 */
export function subMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

/**
 * 减去年数
 */
export function subYears(date: Date, years: number): Date {
  return addYears(date, -years);
}

// ============================================
// 判断函数
// ============================================

/**
 * 判断是否是今天
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * 判断是否是昨天
 */
export function isYesterday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = subDays(new Date(), 1);
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * 判断是否是本周
 */
export function isThisWeek(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return dateObj >= startOfWeek && dateObj <= endOfWeek;
}

/**
 * 判断是否是本月
 */
export function isThisMonth(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * 判断是否是闰年
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 判断 date1 是否在 date2 之后
 */
export function isAfter(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return d1.getTime() > d2.getTime();
}

/**
 * 判断 date1 是否在 date2 之前
 */
export function isBefore(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return d1.getTime() < d2.getTime();
}

/**
 * 判断两个日期是否相同
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

// ============================================
// 获取函数
// ============================================

/**
 * 获取月份的天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 获取一周的开始日期（周日）
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

/**
 * 获取一周的结束日期（周六）
 */
export function getEndOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  return d;
}

/**
 * 获取月份的开始日期
 */
export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * 获取月份的结束日期
 */
export function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * 获取年份的开始日期
 */
export function getStartOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

/**
 * 获取年份的结束日期
 */
export function getEndOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31);
}

// ============================================
// 时间范围函数
// ============================================

/**
 * 获取今天的日期范围
 */
export function getTodayRange(): DateRange {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * 获取本周的日期范围
 */
export function getWeekRange(): DateRange {
  const start = getStartOfWeek(new Date());
  start.setHours(0, 0, 0, 0);
  const end = getEndOfWeek(new Date());
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * 获取本月的日期范围
 */
export function getMonthRange(): DateRange {
  const start = getStartOfMonth(new Date());
  const end = getEndOfMonth(new Date());
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * 获取本年的日期范围
 */
export function getYearRange(): DateRange {
  const start = getStartOfYear(new Date());
  const end = getEndOfYear(new Date());
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// ============================================
// 时区函数
// ============================================

/**
 * 获取时区
 */
export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * 转换为 UTC 时间
 */
export function toUTC(date: Date): Date {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

/**
 * 从 UTC 时间转换
 */
export function fromUTC(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

// ============================================
// 工具函数
// ============================================

/**
 * 解析 ISO 字符串
 */
export function parseISO(isoString: string): Date {
  return new Date(isoString);
}

/**
 * 转换为 ISO 字符串
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * 克隆日期
 */
export function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

/**
 * 获取时间戳（毫秒）
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

/**
 * 比较日期
 * 返回: -1 (date1 < date2), 0 (date1 === date2), 1 (date1 > date2)
 */
export function compareDates(date1: Date, date2: Date): number {
  const time1 = date1.getTime();
  const time2 = date2.getTime();

  if (time1 < time2) return -1;
  if (time1 > time2) return 1;
  return 0;
}
