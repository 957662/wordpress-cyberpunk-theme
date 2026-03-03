/**
 * 时间格式化工具函数
 */

/**
 * 格式化日期为本地字符串
 *
 * @param date - 日期对象、时间戳或日期字符串
 * @param format - 格式类型
 * @returns 格式化后的日期字符串
 *
 * @example
 * ```ts
 * formatDate(new Date()) // "2026-03-03"
 * formatDate(new Date(), 'long') // "2026年3月3日 星期二"
 * formatDate(new Date(), 'time') // "14:30"
 * ```
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'long' | 'full' | 'time' | 'datetime' = 'short'
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const options: Intl.DateTimeFormatOptions = {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
    },
    datetime: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  }[format];

  return d.toLocaleDateString('zh-CN', options);
}

/**
 * 格式化相对时间（多久之前）
 *
 * @param date - 日期对象、时间戳或日期字符串
 * @returns 相对时间字符串
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date()) // "刚刚"
 * formatRelativeTime(Date.now() - 60000) // "1分钟前"
 * formatRelativeTime(Date.now() - 3600000) // "1小时前"
 * formatRelativeTime(Date.now() - 86400000) // "1天前"
 * ```
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 10) return '刚刚';
  if (diffSec < 60) return `${diffSec}秒前`;
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;
  if (diffWeek < 4) return `${diffWeek}周前`;
  if (diffMonth < 12) return `${diffMonth}个月前`;
  return `${diffYear}年前`;
}

/**
 * 格式化时间差（持续时间）
 *
 * @param ms - 毫秒数
 * @param format - 格式类型
 * @returns 格式化后的时间差字符串
 *
 * @example
 * ```ts
 * formatDuration(60000) // "1分钟"
 * formatDuration(3661000) // "1小时1分钟1秒"
 * formatDuration(3661000, 'short') // "1h 1m 1s"
 * formatDuration(3661000, 'minimal') // "1:01:01"
 * ```
 */
export function formatDuration(
  ms: number,
  format: 'long' | 'short' | 'minimal' = 'long'
): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  if (format === 'minimal') {
    const parts = [];
    if (days > 0) parts.push(`${days}:${String(remainingHours).padStart(2, '0')}`);
    else parts.push(String(remainingHours));
    parts.push(String(remainingMinutes).padStart(2, '0'));
    parts.push(String(remainingSeconds).padStart(2, '0'));
    return parts.join(':');
  }

  if (format === 'short') {
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (remainingHours > 0) parts.push(`${remainingHours}h`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);
    return parts.join(' ');
  }

  // long format
  const parts = [];
  if (days > 0) parts.push(`${days}天`);
  if (remainingHours > 0) parts.push(`${remainingHours}小时`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes}分钟`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}秒`);
  return parts.join('');
}

/**
 * 计算阅读时间
 *
 * @param text - 文本内容
 * @param wordsPerMinute - 每分钟阅读字数（中文）
 * @returns 阅读时间（分钟）
 *
 * @example
 * ```ts
 * calculateReadingTime('这是一段文本...') // 2
 * calculateReadingTime(longText, 500) // 10
 * ```
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 300
): number {
  // 移除 HTML 标签
  const cleanText = text.replace(/<[^>]*>/g, '');

  // 计算字符数（中文）
  const charCount = cleanText.length;

  // 计算阅读时间（分钟）
  const readingTime = Math.ceil(charCount / wordsPerMinute);

  return Math.max(1, readingTime);
}

/**
 * 格式化阅读时间
 *
 * @param text - 文本内容
 * @returns 格式化后的阅读时间字符串
 *
 * @example
 * ```ts
 * formatReadingTime('这是一段文本...') // "阅读时间：2分钟"
 * ```
 */
export function formatReadingTime(text: string): string {
  const minutes = calculateReadingTime(text);
  return `阅读时间：${minutes}分钟`;
}

/**
 * 检查日期是否为今天
 *
 * @param date - 日期对象、时间戳或日期字符串
 * @returns 是否为今天
 */
export function isToday(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * 检查日期是否为本周
 *
 * @param date - 日期对象、时间戳或日期字符串
 * @returns 是否为本周
 */
export function isThisWeek(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return d >= startOfWeek && d <= endOfWeek;
}

/**
 * 检查日期是否为本月
 *
 * @param date - 日期对象、时间戳或日期字符串
 * @returns 是否为本月
 */
export function isThisMonth(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();

  return (
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * 获取日期范围
 *
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @returns 日期范围内的所有日期
 *
 * @example
 * ```ts
 * getDateRange(
 *   new Date('2026-03-01'),
 *   new Date('2026-03-05')
 * ) // [Date, Date, Date, Date, Date]
 * ```
 */
export function getDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number
): Date[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: Date[] = [];

  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * 添加时间
 *
 * @param date - 日期对象、时间戳或日期字符串
 * @param amount - 数量
 * @param unit - 单位
 * @returns 新的日期对象
 *
 * @example
 * ```ts
 * addTime(new Date(), 1, 'days') // 明天
 * addTime(new Date(), -1, 'months') // 上个月
 * ```
 */
export function addTime(
  date: Date | string | number,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): Date {
  const d = new Date(date);

  switch (unit) {
    case 'seconds':
      d.setSeconds(d.getSeconds() + amount);
      break;
    case 'minutes':
      d.setMinutes(d.getMinutes() + amount);
      break;
    case 'hours':
      d.setHours(d.getHours() + amount);
      break;
    case 'days':
      d.setDate(d.getDate() + amount);
      break;
    case 'weeks':
      d.setDate(d.getDate() + amount * 7);
      break;
    case 'months':
      d.setMonth(d.getMonth() + amount);
      break;
    case 'years':
      d.setFullYear(d.getFullYear() + amount);
      break;
  }

  return d;
}

/**
 * 获取时间戳（秒）
 *
 * @param date - 日期对象、时间戳或日期字符串
 * @returns Unix 时间戳（秒）
 */
export function getTimestamp(date: Date | string | number = new Date()): number {
  return Math.floor(new Date(date).getTime() / 1000);
}

/**
 * 从时间戳创建日期
 *
 * @param timestamp - Unix 时间戳（秒）
 * @returns 日期对象
 */
export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * 睡眠函数（用于异步等待）
 *
 * @param ms - 毫秒数
 * @returns Promise
 *
 * @example
 * ```ts
 * await sleep(1000); // 等待1秒
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 创建倒计时
 *
 * @param targetDate - 目标日期
 * @param onUpdate - 更新回调
 * @param onComplete - 完成回调
 * @returns 清除函数
 *
 * @example
 * ```ts
 * const clear = createCountdown(
 *   new Date(Date.now() + 10000),
 *   (remaining) => console.log(remaining),
 *   () => console.log('完成')
 * );
 *
 * // 清除倒计时
 * clear();
 * ```
 */
export function createCountdown(
  targetDate: Date | string | number,
  onUpdate: (remaining: number) => void,
  onComplete?: () => void
): () => void {
  const target = new Date(targetDate);
  let intervalId: NodeJS.Timeout;

  const update = () => {
    const now = new Date();
    const remaining = target.getTime() - now.getTime();

    if (remaining <= 0) {
      clearInterval(intervalId);
      onUpdate(0);
      onComplete?.();
    } else {
      onUpdate(remaining);
    }
  };

  update();
  intervalId = setInterval(update, 1000);

  return () => clearInterval(intervalId);
}

export default {
  formatDate,
  formatRelativeTime,
  formatDuration,
  calculateReadingTime,
  formatReadingTime,
  isToday,
  isThisWeek,
  isThisMonth,
  getDateRange,
  addTime,
  getTimestamp,
  fromTimestamp,
  sleep,
  createCountdown,
};
