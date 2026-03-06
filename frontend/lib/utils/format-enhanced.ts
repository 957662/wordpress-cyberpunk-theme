/**
 * Enhanced Format Utilities
 * 增强的格式化工具函数
 */

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 格式化时长 (秒 -> HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化时长为人类可读格式
 */
export function formatDurationHuman(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}小时`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}分钟`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}秒`);
  }

  return parts.join('');
}

/**
 * 格式化数字 (添加千分位)
 */
export function formatNumber(num: number, locale = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * 格式化数字为简短形式 (K, M, B)
 */
export function formatNumberCompact(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency = 'CNY',
  locale = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化日期为相对时间
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

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
 * 截断文本
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 截断单词
 */
export function truncateWords(text: string, maxWords: number): string {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * 生成 URL 友好的 slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // 分离重音字符
    .replace(/[\u0300-\u036f]/g, '') // 移除重音
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // 替换非字母数字为连字符
    .replace(/^-+/, '') // 移除前导连字符
    .replace(/-+$/, ''); // 移除尾随连字符
}

/**
 * 高亮搜索关键词
 */
export function highlightKeyword(
  text: string,
  keyword: string,
  className = 'bg-cyber-cyan/30 text-cyber-cyan px-1 rounded'
): string {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
}

/**
 * 高亮多个关键词
 */
export function highlightKeywords(
  text: string,
  keywords: string[],
  className = 'bg-cyber-cyan/30 text-cyber-cyan px-1 rounded'
): string {
  if (!keywords || keywords.length === 0) return text;

  let highlightedText = text;
  keywords.forEach((keyword) => {
    highlightedText = highlightKeyword(highlightedText, keyword, className);
  });

  return highlightedText;
}

/**
 * 格式化电话号码
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * 格式化身份证号 (隐藏中间部分)
 */
export function formatIDCard(id: string): string {
  if (id.length !== 18) return id;
  return `${id.slice(0, 6)}********${id.slice(14)}`;
}

/**
 * 格式化银行卡号 (每4位加空格)
 */
export function formatBankCard(card: string): string {
  return card.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
}

/**
 * 格式化版本号
 */
export function formatVersion(major: number, minor: number, patch = 0): string {
  return `v${major}.${minor}.${patch}`;
}

/**
 * 解析版本号
 */
export function parseVersion(version: string): { major: number; minor: number; patch: number } | null {
  const match = version.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * 比较版本号
 */
export function compareVersions(v1: string, v2: string): number {
  const version1 = parseVersion(v1);
  const version2 = parseVersion(v2);

  if (!version1 || !version2) return 0;

  if (version1.major !== version2.major) {
    return version1.major - version2.major;
  }
  if (version1.minor !== version2.minor) {
    return version1.minor - version2.minor;
  }
  return version1.patch - version2.patch;
}

/**
 * 格式化文件名 (移除扩展名)
 */
export function getFileNameWithoutExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > 0 ? filename.slice(0, lastDotIndex) : filename;
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > 0 ? filename.slice(lastDotIndex + 1).toLowerCase() : '';
}

/**
 * 格式化 MIME 类型描述
 */
export function formatMimeType(mime: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'JPEG 图片',
    'image/png': 'PNG 图片',
    'image/gif': 'GIF 图片',
    'image/webp': 'WebP 图片',
    'application/pdf': 'PDF 文档',
    'text/plain': '文本文件',
    'application/zip': 'ZIP 压缩包',
    'application/json': 'JSON 文件',
    'text/html': 'HTML 文件',
    'text/css': 'CSS 样式表',
    'application/javascript': 'JavaScript 文件',
  };

  return mimeMap[mime] || mime;
}

/**
 * 格式化数组为句子
 */
export function formatList(items: string[], conjunction = '和'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(conjunction);

  return `${items.slice(0, -1).join('、')}${conjunction}${items[items.length - 1]}`;
}

/**
 * 生成随机颜色
 */
export function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * 根据字符串生成一致的颜色
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * 颜色亮度调整
 */
export function adjustColorBrightness(hex: string, amount: number): string {
  const color = hex.replace('#', '');
  const num = parseInt(color, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default {
  formatBytes,
  formatDuration,
  formatDurationHuman,
  formatNumber,
  formatNumberCompact,
  formatPercent,
  formatCurrency,
  formatRelativeTime,
  truncate,
  truncateWords,
  slugify,
  highlightKeyword,
  highlightKeywords,
  formatPhoneNumber,
  formatIDCard,
  formatBankCard,
  formatVersion,
  parseVersion,
  compareVersions,
  getFileNameWithoutExtension,
  getFileExtension,
  formatMimeType,
  formatList,
  generateRandomColor,
  stringToColor,
  adjustColorBrightness,
};
