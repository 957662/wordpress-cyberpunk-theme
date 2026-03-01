/**
 * 格式化工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(
  date: string | Date,
  locale: string = 'zh-CN',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return String(date);
  }
}

/**
 * 格式化相对时间（如"3小时前"）
 */
export function formatRelativeTime(date: string | Date, locale: string = 'zh-CN'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return String(date);
  }
}

/**
 * 格式化数字
 */
export function formatNumber(
  num: number,
  locale: string = 'zh-CN',
  options?: Intl.NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(num);
  } catch (error) {
    console.error('Number formatting error:', error);
    return String(num);
  }
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN'
): string {
  return formatNumber(amount, locale, {
    style: 'currency',
    currency
  });
}

/**
 * 格式化百分比
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  locale: string = 'zh-CN'
): string {
  return formatNumber(value, locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number, locale: string = 'zh-CN'): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size, locale, { maximumFractionDigits: 2 })} ${units[unitIndex]}`;
}

/**
 * 格式化持续时间
 */
export function formatDuration(seconds: number, locale: string = 'zh-CN'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}${locale === 'zh-CN' ? '小时' : 'h'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}${locale === 'zh-CN' ? '分钟' : 'm'}`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}${locale === 'zh-CN' ? '秒' : 's'}`);
  }

  return parts.join(locale === 'zh-CN' ? '' : ' ');
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(wordCount: number, locale: string = 'zh-CN'): string {
  // 假设平均阅读速度：中文 400 字/分钟，英文 200 词/分钟
  const wordsPerMinute = locale === 'zh-CN' ? 400 : 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (locale === 'zh-CN') {
    return `${minutes} 分钟阅读`;
  } else {
    return `${minutes} min read`;
  }
}

/**
 * 格式化电话号码
 */
export function formatPhoneNumber(phone: string, locale: string = 'zh-CN'): string {
  // 移除非数字字符
  const cleaned = phone.replace(/\D/g, '');

  if (locale === 'zh-CN' && cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
  }

  return phone;
}

/**
 * 格式化身份证号（脱敏）
 */
export function formatIdCard(idCard: string): string {
  if (idCard.length >= 6) {
    return idCard.slice(0, 6) + '********' + idCard.slice(-4);
  }
  return idCard;
}

/**
 * 格式化银行卡号（脱敏）
 */
export function formatBankCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length > 8) {
    const start = cleaned.slice(0, 4);
    const end = cleaned.slice(-4);
    const middle = '*'.repeat(Math.min(cleaned.length - 8, 8));
    return `${start} ${middle} ${end}`;
  }
  return cardNumber;
}

/**
 * 格式化 URL
 */
export function formatUrl(url: string, maxLength: number = 50): string {
  try {
    const urlObj = new URL(url);
    const cleanUrl = urlObj.hostname + urlObj.pathname;
    return cleanUrl.length > maxLength
      ? cleanUrl.slice(0, maxLength) + '...'
      : cleanUrl;
  } catch {
    return url.length > maxLength ? url.slice(0, maxLength) + '...' : url;
  }
}

/**
 * 格式化邮箱（脱敏）
 */
export function formatEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username && domain) {
    const visibleLength = Math.min(3, username.length);
    const masked = username.slice(0, visibleLength) + '***';
    return `${masked}@${domain}`;
  }
  return email;
}

/**
 * 格式化文本截断
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 格式化文本为驼峰命名
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (_, char) => char.toLowerCase());
}

/**
 * 格式化文本为短横线命名
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * 格式化文本为蛇形命名
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * 格式化文本为帕斯卡命名
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (_, char) => char.toUpperCase());
}

/**
 * 格式化首字母大写
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 格式化标题（每个单词首字母大写）
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * 高亮搜索关键词
 */
export function highlightKeywords(
  text: string,
  keywords: string[],
  highlightClass: string = 'bg-yellow-200'
): string {
  let result = text;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(regex, `<span class="${highlightClass}">$1</span>`);
  });
  return result;
}

/**
 * 格式化 JSON
 */
export function formatJSON(obj: any, indent: number = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    console.error('JSON formatting error:', error);
    return String(obj);
  }
}

/**
 * 格式化代码片段
 */
export function formatCode(code: string, language: string = ''): string {
  // 简单的代码格式化，实际项目中可能需要使用 prettier 或其他格式化工具
  return code.trim();
}

/**
 * 格式化地址
 */
export function formatAddress(address: {
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  detail?: string;
}): string {
  const parts = [
    address.province,
    address.city,
    address.district,
    address.street,
    address.detail
  ].filter(Boolean);

  return parts.join('');
}

/**
 * 格式化经纬度
 */
export function formatCoordinates(
  latitude: number,
  longitude: number,
  precision: number = 6
): string {
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
}

/**
 * 格式化版本号
 */
export function formatVersion(version: string): string {
  // 补全版本号，如 1 -> 1.0.0
  const parts = version.split('.');
  while (parts.length < 3) {
    parts.push('0');
  }
  return parts.join('.');
}

/**
 * 比较版本号
 */
export function compareVersions(version1: string, version2: string): number {
  const v1 = formatVersion(version1).split('.').map(Number);
  const v2 = formatVersion(version2).split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (v1[i] > v2[i]) return 1;
    if (v1[i] < v2[i]) return -1;
  }
  return 0;
}

/**
 * 格式化 RGB 为十六进制
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * 格式化十六进制为 RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

/**
 * 格式化 RGBA
 */
export function formatRgba(r: number, g: number, b: number, a: number = 1): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * 颜色亮度调整
 */
export function adjustColorBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (value: number) => {
    const adjusted = Math.round(value * (1 + percent / 100));
    return Math.max(0, Math.min(255, adjusted));
  };

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
}

/**
 * 格式化进度条百分比
 */
export function formatProgress(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, (value / total) * 100));
}

/**
 * 格式化星级
 */
export function formatStarRating(rating: number, maxStars: number = 5): number {
  return Math.min(maxStars, Math.max(0, rating));
}

/**
 * 格式化标签
 */
export function formatTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

/**
 * 格式化 slug
 */
export function formatSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
