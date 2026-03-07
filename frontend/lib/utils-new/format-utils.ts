/**
 * Format Utilities - 格式化工具函数
 * 提供各种数据格式化功能
 */

/**
 * 格式化数字，添加千位分隔符
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化日期为相对时间
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

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
 * 格式化日期
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'zh-CN'
): string {
  const target = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'long', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit' },
  }[format];

  return target.toLocaleDateString(locale, options);
}

/**
 * 格式化时间范围
 */
export function formatTimeRange(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}天${diffHours % 24}小时`;
  } else if (diffHours > 0) {
    return `${diffHours}小时${diffMinutes % 60}分钟`;
  } else {
    return `${diffMinutes}分钟`;
  }
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(wordCount: number, wordsPerMinute: number = 200): string {
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) {
    return '少于1分钟';
  } else if (minutes < 60) {
    return `${minutes}分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}小时${remainingMinutes > 0 ? remainingMinutes + '分钟' : ''}`;
  }
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 高亮搜索关键词
 */
export function highlightSearchTerm(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return <mark key={index} className="bg-cyber-cyan/30 text-cyber-cyan px-1 rounded">{part}</mark>;
    }
    return part;
  });
}

/**
 * 格式化 URL
 */
export function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

/**
 * 格式化电话号码
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * 格式化身份证号（隐藏中间部分）
 */
export function formatIdCard(idCard: string): string {
  if (idCard.length !== 18) return idCard;
  return `${idCard.slice(0, 6)}********${idCard.slice(14)}`;
}

/**
 * 格式化邮箱（隐藏部分）
 */
export function formatEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username.length <= 3) return email;

  const visibleChars = Math.ceil(username.length / 3);
  const maskedUsername = username.slice(0, visibleChars) + '***';

  return `${maskedUsername}@${domain}`;
}

/**
 * 转换为标题格式
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 生成随机字符串
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 格式化 JSON
 */
export function formatJson(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

/**
 * 解析用户代理
 */
export function parseUserAgent(ua: string): {
  browser: string;
  os: string;
  device: string;
} {
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  // 浏览器检测
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  // 操作系统检测
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';

  // 设备检测
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
    device = 'Mobile';
  } else if (ua.includes('Tablet') || ua.includes('iPad')) {
    device = 'Tablet';
  }

  return { browser, os, device };
}

export default {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatRelativeTime,
  formatDate,
  formatTimeRange,
  formatReadingTime,
  truncateText,
  highlightSearchTerm,
  formatUrl,
  formatPhoneNumber,
  formatIdCard,
  formatEmail,
  toTitleCase,
  generateRandomString,
  formatJson,
  parseUserAgent,
};
