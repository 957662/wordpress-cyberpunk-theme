/**
 * 格式化工具函数
 */

import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'yyyy年MM月dd日'
): string {
  try {
    return format(new Date(date), formatStr, { locale: zhCN });
  } catch {
    return '';
  }
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const days = differenceInDays(now, targetDate);

    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return formatDistanceToNow(targetDate, { locale: zhCN, addSuffix: true });
    }
  } catch {
    return '';
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化数字（千分位）
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化手机号
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * 格式化身份证号（隐藏中间部分）
 */
export function formatIdCard(id: string): string {
  if (id.length === 18) {
    return `${id.slice(0, 6)}********${id.slice(-4)}`;
  }
  return id;
}

/**
 * 格式化银行卡号（隐藏中间部分）
 */
export function formatBankCard(card: string): string {
  const cleaned = card.replace(/\D/g, '');
  if (cleaned.length >= 12) {
    const start = cleaned.slice(0, 4);
    const end = cleaned.slice(-4);
    const middle = '*'.repeat(Math.min(cleaned.length - 8, 8));
    return `${start} ${middle} ${end}`;
  }
  return card;
}

/**
 * 截断文本
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
}

/**
 * 高亮关键词
 */
export function highlightKeywords(
  text: string,
  keywords: string[],
  highlightClass: string = 'bg-cyber-cyan/20 text-cyber-cyan'
): string {
  let result = text;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(regex, `<span class="${highlightClass}">$1</span>`);
  });
  return result;
}

/**
 * 格式化 slug
 */
export function formatSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 格式化标签
 */
export function formatTags(tags: string[]): string {
  return tags.map((tag) => `#${tag}`).join(' ');
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(wordCount: number, wordsPerMinute: number = 200): string {
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  if (minutes < 1) return '少于1分钟';
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
}

/**
 * 格式化时长
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化 URL 参数
 */
export function formatUrlParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

/**
 * 首字母大写
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * 驼峰命名转短横线命名
 */
export function camelToKebab(text: string): string {
  return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 短横线命名转驼峰命名
 */
export function kebabToCamel(text: string): string {
  return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
