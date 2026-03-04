/**
 * 格式化工具函数
 * 提供各种数据格式化功能
 */

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const d = new Date(date);

  if (format === 'short') {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  if (format === 'long') {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (format === 'relative') {
    return formatRelativeTime(d);
  }

  return d.toLocaleDateString('zh-CN');
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 30) return `${diffDay}天前`;
  if (diffMonth < 12) return `${diffMonth}个月前`;
  return `${diffYear}年前`;
}

/**
 * 格式化时间
 */
export function formatTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 格式化数字
 */
export function formatNumber(
  num: number,
  options?: {
    decimals?: number;
    style?: 'decimal' | 'currency' | 'percent';
    currency?: string;
    locale?: string;
  }
): string {
  const {
    decimals = 0,
    style = 'decimal',
    currency = 'CNY',
    locale = 'zh-CN',
  } = options || {};

  return num.toLocaleString(locale, {
    style,
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 格式化持续时间
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  decimals: number = 2
): string {
  return formatNumber(amount, {
    decimals,
    style: 'currency',
    currency,
  });
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 格式化 URL
 */
export function formatUrl(url: string, params: Record<string, any>): string {
  const urlObj = new URL(url);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      urlObj.searchParams.set(key, String(params[key]));
    }
  });
  return urlObj.toString();
}

/**
 * 高亮搜索关键词
 */
export function highlightSearchTerm(
  text: string,
  searchTerm: string,
  highlightClass: string = 'bg-cyber-cyan/20 text-cyber-cyan'
): string {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}

/**
 * 格式化手机号（隐藏中间4位）
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 11) return phone;
  return `${cleaned.slice(0, 3)}****${cleaned.slice(7)}`;
}

/**
 * 格式化身份证号（隐藏中间部分）
 */
export function formatIdCard(idCard: string): string {
  if (idCard.length !== 18) return idCard;
  return `${idCard.slice(0, 6)}********${idCard.slice(14)}`;
}

/**
 * 格式化银行卡号（每4位一组）
 */
export function formatBankCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
}
