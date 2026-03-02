'use client';

/**
 * 日期格式化工具库
 * 用于格式化各种日期时间显示
 */

/**
 * 格式化日期为相对时间（如"3分钟前"）
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'zh-CN'
): string {
  const now = new Date();
  const target = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (locale === 'zh-CN') {
    return formatRelativeTimeChinese(diffInSeconds);
  }

  return formatRelativeTimeEnglish(diffInSeconds);
}

function formatRelativeTimeChinese(seconds: number): string {
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  const absSeconds = Math.abs(seconds);

  if (absSeconds < minute) {
    return seconds < 0 ? '刚刚' : '刚刚';
  }

  if (absSeconds < hour) {
    const minutes = Math.floor(absSeconds / minute);
    return seconds < 0 ? `${minutes}分钟后` : `${minutes}分钟前`;
  }

  if (absSeconds < day) {
    const hours = Math.floor(absSeconds / hour);
    return seconds < 0 ? `${hours}小时后` : `${hours}小时前`;
  }

  if (absSeconds < month) {
    const days = Math.floor(absSeconds / day);
    return seconds < 0 ? `${days}天后` : `${days}天前`;
  }

  if (absSeconds < year) {
    const months = Math.floor(absSeconds / month);
    return seconds < 0 ? `${months}个月后` : `${months}个月前`;
  }

  const years = Math.floor(absSeconds / year);
  return seconds < 0 ? `${years}年后` : `${years}年前`;
}

function formatRelativeTimeEnglish(seconds: number): string {
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  const absSeconds = Math.abs(seconds);

  if (absSeconds < minute) {
    return 'just now';
  }

  if (absSeconds < hour) {
    const minutes = Math.floor(absSeconds / minute);
    return seconds < 0 ? `in ${minutes} minute${minutes > 1 ? 's' : ''}` : `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  if (absSeconds < day) {
    const hours = Math.floor(absSeconds / hour);
    return seconds < 0 ? `in ${hours} hour${hours > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  if (absSeconds < month) {
    const days = Math.floor(absSeconds / day);
    return seconds < 0 ? `in ${days} day${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
  }

  if (absSeconds < year) {
    const months = Math.floor(absSeconds / month);
    return seconds < 0 ? `in ${months} month${months > 1 ? 's' : ''}` : `${months} month${months > 1 ? 's' : ''} ago`;
  }

  const years = Math.floor(absSeconds / year);
  return seconds < 0 ? `in ${years} year${years > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * 格式化日期为标准格式
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD',
  locale: string = 'zh-CN'
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const pad = (n: number) => n.toString().padStart(2, '0');

  const replacements: Record<string, string> = {
    'YYYY': year.toString(),
    'YY': year.toString().slice(-2),
    'MM': pad(month),
    'M': month.toString(),
    'DD': pad(day),
    'D': day.toString(),
    'HH': pad(hours),
    'H': hours.toString(),
    'mm': pad(minutes),
    'm': minutes.toString(),
    'ss': pad(seconds),
    's': seconds.toString(),
  };

  let result = format;

  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }

  return result;
}

/**
 * 格式化日期为简短格式
 */
export function formatShortDate(date: Date | string | number, locale: string = 'zh-CN'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const isCurrentYear = d.getFullYear() === now.getFullYear();

  if (locale === 'zh-CN') {
    if (isCurrentYear) {
      return `${d.getMonth() + 1}月${d.getDate()}日`;
    }
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  if (isCurrentYear) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * 格式化时间为简短格式
 */
export function formatShortTime(date: Date | string | number, locale: string = 'zh-CN'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (locale === 'zh-CN') {
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * 格式化日期时间为简短格式
 */
export function formatShortDateTime(date: Date | string | number, locale: string = 'zh-CN'): string {
  const dateStr = formatShortDate(date, locale);
  const timeStr = formatShortTime(date, locale);

  if (locale === 'zh-CN') {
    return `${dateStr} ${timeStr}`;
  }

  return `${dateStr} at ${timeStr}`;
}

/**
 * 格式化日期为完整格式
 */
export function formatFullDate(date: Date | string | number, locale: string = 'zh-CN'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (locale === 'zh-CN') {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * 格式化日期范围
 */
export function formatDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  locale: string = 'zh-CN'
): string {
  const start = typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;

  const isSameDay = start.toDateString() === end.toDateString();
  const isSameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const isSameYear = start.getFullYear() === end.getFullYear();

  if (locale === 'zh-CN') {
    if (isSameDay) {
      return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 ${start.getHours()}:${start.getMinutes()}-${end.getHours()}:${end.getMinutes()}`;
    }

    if (isSameMonth) {
      return `${start.getMonth() + 1}月${start.getDate()}日-${end.getDate()}日, ${start.getFullYear()}年`;
    }

    if (isSameYear) {
      return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日, ${start.getFullYear()}年`;
    }

    return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 - ${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日`;
  }

  if (isSameDay) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${start.getHours()}:${start.getMinutes()}-${end.getHours()}:${end.getMinutes()}`;
  }

  if (isSameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${end.getDate()}, ${start.getFullYear()}`;
  }

  if (isSameYear) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
  }

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

/**
 * 获取日期范围描述
 */
export function getDateRangeDescription(
  startDate: Date | string | number,
  endDate: Date | string | number,
  locale: string = 'zh-CN'
): string {
  const start = typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;
  const now = new Date();

  const isPast = end < now;
  const isFuture = start > now;
  const isOngoing = start <= now && end >= now;

  if (locale === 'zh-CN') {
    if (isOngoing) return '进行中';
    if (isFuture) return '即将开始';
    if (isPast) return '已结束';
  } else {
    if (isOngoing) return 'Ongoing';
    if (isFuture) return 'Upcoming';
    if (isPast) return 'Ended';
  }

  return '';
}

/**
 * 计算日期差异
 */
export function getDateDiff(
  date1: Date | string | number,
  date2: Date | string | number
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const d1 = typeof date1 === 'string' || typeof date1 === 'number' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' || typeof date2 === 'number' ? new Date(date2) : date2;

  const diff = Math.abs(d1.getTime() - d2.getTime());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

/**
 * 检查日期是否在范围内
 */
export function isDateInRange(
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
): boolean {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const start = typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;

  return d >= start && d <= end;
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

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return d >= startOfWeek && d <= endOfWeek;
}

/**
 * 判断是否为本月
 */
export function isThisMonth(date: Date | string | number): boolean {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();

  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

/**
 * 判断是否为本年
 */
export function isThisYear(date: Date | string | number): boolean {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();

  return d.getFullYear() === now.getFullYear();
}

export default {
  formatRelativeTime,
  formatDate,
  formatShortDate,
  formatShortTime,
  formatShortDateTime,
  formatFullDate,
  formatDateRange,
  getDateRangeDescription,
  getDateDiff,
  isDateInRange,
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
};
