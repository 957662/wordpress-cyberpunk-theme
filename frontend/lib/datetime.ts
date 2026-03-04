/**
 * 日期时间处理工具
 * 提供便捷的日期时间操作和格式化功能
 */

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const tokens: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    YY: d.getFullYear().toString().slice(-2),
    MM: pad(d.getMonth() + 1),
    M: (d.getMonth() + 1).toString(),
    DD: pad(d.getDate()),
    D: d.getDate().toString(),
    HH: pad(d.getHours()),
    H: d.getHours().toString(),
    mm: pad(d.getMinutes()),
    m: d.getMinutes().toString(),
    ss: pad(d.getSeconds()),
    s: d.getSeconds().toString(),
    SSS: d.getMilliseconds().toString().padStart(3, '0'),
  };

  let result = format;
  Object.entries(tokens).forEach(([token, value]) => {
    result = result.replace(new RegExp(token, 'g'), value);
  });

  return result;
}

/**
 * 相对时间格式化
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  if (months < 12) return `${months}个月前`;
  return `${years}年前`;
}

/**
 * 格式化时间段
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天${hours % 24}小时`;
  if (hours > 0) return `${hours}小时${minutes % 60}分钟`;
  if (minutes > 0) return `${minutes}分钟${seconds % 60}秒`;
  return `${seconds}秒`;
}

/**
 * 解析日期字符串
 */
export function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

/**
 * 判断是否为有效日期
 */
export function isValidDate(date: any): boolean {
  if (!(date instanceof Date)) return false;
  return !isNaN(date.getTime());
}

/**
 * 添加时间
 */
export function addTime(
  date: Date,
  amount: number,
  unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'
): Date {
  const result = new Date(date);

  switch (unit) {
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'hours':
      result.setHours(result.getHours() + amount);
      break;
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount);
      break;
    case 'seconds':
      result.setSeconds(result.getSeconds() + amount);
      break;
  }

  return result;
}

/**
 * 减去时间
 */
export function subtractTime(
  date: Date,
  amount: number,
  unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'
): Date {
  return addTime(date, -amount, unit);
}

/**
 * 计算两个日期之间的差值
 */
export function dateDiff(
  date1: Date,
  date2: Date,
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): number {
  const diff = date2.getTime() - date1.getTime();

  switch (unit) {
    case 'days':
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    case 'hours':
      return Math.floor(diff / (1000 * 60 * 60));
    case 'minutes':
      return Math.floor(diff / (1000 * 60));
    case 'seconds':
      return Math.floor(diff / 1000);
  }
}

/**
 * 判断是否为今天
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * 判断是否为本周
 */
export function isThisWeek(date: Date): boolean {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return date >= startOfWeek && date <= endOfWeek;
}

/**
 * 判断是否为本月
 */
export function isThisMonth(date: Date): boolean {
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * 获取星期几
 */
export function getWeekday(date: Date, locale: string = 'zh-CN'): string {
  const weekdays =
    locale === 'zh-CN'
      ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays[date.getDay()];
}

/**
 * 获取月份名称
 */
export function getMonthName(
  month: number,
  locale: string = 'zh-CN',
  format: 'long' | 'short' = 'long'
): string {
  if (locale === 'zh-CN') {
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return months[month];
  }

  const months =
    format === 'long'
      ? [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]
      : [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
  return months[month];
}

/**
 * 获取月份的天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 获取月份的第一天
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * 生成日历数据
 */
export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected?: boolean;
}

export function generateCalendarData(
  year: number,
  month: number,
  selectedDate?: Date
): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const today = new Date();

  let week: CalendarDay[] = [];

  // 上个月的日期
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    week.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      day: prevMonthDays - i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // 当前月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    week.push({
      date,
      day,
      isCurrentMonth: true,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isSelected:
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear(),
    });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // 下个月的日期
  if (week.length > 0) {
    const nextMonthDay = 1;
    const remainingDays = 7 - week.length;
    for (let i = 0; i < remainingDays; i++) {
      week.push({
        date: new Date(year, month + 1, nextMonthDay + i),
        day: nextMonthDay + i,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    weeks.push(week);
  }

  return weeks;
}

/**
 * 获取时间范围
 */
export function getTimeRange(range: 'today' | 'week' | 'month' | 'year'): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'week':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;

    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

/**
 * 倒计时
 */
export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export function getCountdown(targetDate: Date | string | number): CountdownResult {
  const target = typeof targetDate === 'string' || typeof targetDate === 'number' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}

/**
 * 日期时间类
 */
export class DateTime {
  private date: Date;

  constructor(date?: Date | string | number) {
    this.date = date ? new Date(date) : new Date();
  }

  format(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return formatDate(this.date, format);
  }

  relative(): string {
    return formatRelativeTime(this.date);
  }

  add(amount: number, unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'): DateTime {
    return new DateTime(addTime(this.date, amount, unit));
  }

  subtract(amount: number, unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'): DateTime {
    return new DateTime(subtractTime(this.date, amount, unit));
  }

  diff(other: DateTime, unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'): number {
    return dateDiff(this.date, other.date, unit);
  }

  isToday(): boolean {
    return isToday(this.date);
  }

  isThisWeek(): boolean {
    return isThisWeek(this.date);
  }

  isThisMonth(): boolean {
    return isThisMonth(this.date);
  }

  toDate(): Date {
    return this.date;
  }

  toISOString(): string {
    return this.date.toISOString();
  }

  toString(): string {
    return this.date.toString();
  }

  static now(): DateTime {
    return new DateTime();
  }
}

/**
 * Hook: 使用倒计时
 */
export function useCountdown(targetDate: Date | string | number, interval: number = 1000) {
  const [countdown, setCountdown] = React.useState(() => getCountdown(targetDate));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, interval);

    return () => clearInterval(timer);
  }, [targetDate, interval]);

  return countdown;
}

/**
 * Hook: 使用当前时间
 */
export function useCurrentTime(interval: number = 1000) {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return time;
}
