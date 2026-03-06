/**
 * Data Formatter - 数据格式化工具
 *
 * 提供各种数据格式化功能
 */

/**
 * 格式化数字为带逗号的字符串
 */
export function formatNumber(num: number, options?: {
  decimals?: number;
  separator?: string;
  thousandsSeparator?: string;
}): string {
  const {
    decimals = 0,
    separator = '.',
    thousandsSeparator = ',',
  } = options || {};

  const parts = num.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  return parts.join(separator);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'long' | 'full' | 'relative' = 'long',
  locale: string = 'zh-CN'
): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);

  if (format === 'relative') {
    return formatRelativeDate(dateObj);
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
    },
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  }[format];

  return dateObj.toLocaleDateString(locale, options);
}

/**
 * 格式化相对日期（如：3天前）
 */
export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    年: 31536000,
    月: 2592000,
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
 * 格式化时间范围
 */
export function formatTimeRange(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'object' ? start : new Date(start);
  const endDate = typeof end === 'object' ? end : new Date(end);

  const startStr = startDate.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });

  const endStr = endDate.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: startDate.getFullYear() !== endDate.getFullYear() ? 'numeric' : undefined,
  } as any);

  return `${startStr} - ${endStr}`;
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(words: number, wordsPerMinute: number = 200): string {
  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes < 1) {
    return '少于1分钟';
  }

  return `${minutes} 分钟阅读`;
}

/**
 * 格式化电话号码
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);

  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }

  return phone;
}

/**
 * 格式化身份证号（隐藏中间部分）
 */
export function formatIdCard(idCard: string): string {
  if (idCard.length !== 18) {
    return idCard;
  }

  return idCard.replace(/^(.{6})(.{8})(.{4})$/, '$1********$3');
}

/**
 * 格式化银行卡号（隐藏中间部分）
 */
export function formatBankCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];

  // 显示最后4位，其他用星号
  const lastFour = cleaned.slice(-4);
  const maskedLength = cleaned.length - 4;
  const masked = '*'.repeat(maskedLength);

  return (masked + lastFour).match(/.{1,4}/g)?.join(' ') || '';
}

/**
 * 格式化 URL 参数
 */
export function formatUrlParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * 格式化数组为列表字符串
 */
export function formatArrayToList<T>(
  items: T[],
  options?: {
    separator?: string;
    lastSeparator?: string;
    limit?: number;
  }
): string {
  const {
    separator = '、',
    lastSeparator,
    limit,
  } = options || {};

  if (limit && items.length > limit) {
    return [...items.slice(0, limit), `等${items.length}项`].join(separator);
  }

  if (lastSeparator && items.length > 1) {
    const last = items.pop();
    return `${items.join(separator)}${lastSeparator}${last}`;
  }

  return items.join(separator);
}

/**
 * 截断文本
 */
export function truncateText(
  text: string,
  maxLength: number,
  options?: {
    suffix?: string;
    breakOnWord?: boolean;
  }
): string {
  const {
    suffix = '...',
    breakOnWord = false,
  } = options || {};

  if (text.length <= maxLength) {
    return text;
  }

  if (breakOnWord) {
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + suffix;
    }
  }

  return text.substring(0, maxLength) + suffix;
}

/**
 * 高亮关键词
 */
export function highlightKeywords(text: string, keywords: string[]): string {
  let highlighted = text;

  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });

  return highlighted;
}

/**
 * 格式化 JSON
 */
export function formatJson(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

/**
 * 格式化字节为十六进制
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(' ');
}

/**
 * 格式化十六进制为字节
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/\s/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }

  return bytes;
}

/**
 * 格式化版本号
 */
export function formatVersion(version: string): string {
  const parts = version.split('.');
  const major = parts[0] || '0';
  const minor = parts[1] || '0';
  const patch = parts[2] || '0';

  return `v${major}.${minor}.${patch}`;
}

/**
 * 比较版本号
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }

  return 0;
}

/**
 * 格式化枚举值
 */
export function formatEnum(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * 格式化布尔值为中文
 */
export function formatBoolean(value: boolean): string {
  return value ? '是' : '否';
}

/**
 * 格式化性别
 */
export function formatGender(gender: 'male' | 'female' | 'other' | 'unknown'): string {
  const genderMap = {
    male: '男',
    female: '女',
    other: '其他',
    unknown: '未知',
  };

  return genderMap[gender] || '未知';
}

/**
 * 格式化状态
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: '活跃',
    inactive: '未激活',
    pending: '待审核',
    approved: '已批准',
    rejected: '已拒绝',
    archived: '已归档',
    deleted: '已删除',
  };

  return statusMap[status.toLowerCase()] || status;
}

export default {
  formatNumber,
  formatFileSize,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatRelativeDate,
  formatTimeRange,
  formatReadingTime,
  formatPhoneNumber,
  formatIdCard,
  formatBankCard,
  formatUrlParams,
  formatArrayToList,
  truncateText,
  highlightKeywords,
  formatJson,
  bytesToHex,
  hexToBytes,
  formatVersion,
  compareVersions,
  formatEnum,
  formatBoolean,
  formatGender,
  formatStatus,
};
