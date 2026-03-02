// 格式化工具函数

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, format: 'full' | 'short' | 'time' | 'relative' = 'full'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'full':
      return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'short':
      return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    case 'time':
      return d.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'relative':
      return formatRelativeTime(date);
    default:
      return d.toLocaleDateString('zh-CN');
  }
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} 天前`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} 个月前`;
  return `${Math.floor(diffInSeconds / 31536000)} 年前`;
}

/**
 * 格式化数字
 */
export function formatNumber(num: number, locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * 格式化货币
 */
export function formatCurrency(amount: number, currency: string = 'CNY', locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
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
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + suffix;
}

/**
 * 高亮关键词
 */
export function highlightKeywords(text: string, keywords: string[], className: string = 'bg-yellow-200'): string {
  let result = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(regex, `<mark class="${className}">$1</mark>`);
  });
  return result;
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
 * 格式化身份证号（隐藏部分）
 */
export function formatIdCard(idCard: string): string {
  if (idCard.length >= 14) {
    return `${idCard.slice(0, 6)}********${idCard.slice(-4)}`;
  }
  return idCard;
}

/**
 * 格式化邮箱（隐藏部分）
 */
export function formatEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username.length > 2) {
    return `${username.slice(0, 2)}***@${domain}`;
  }
  return email;
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 驼峰命名转短横线命名
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 短横线命名转驼峰命名
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 移除 HTML 标签
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * 计算阅读时间
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const text = stripHtml(content);
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * 格式化 JSON
 */
export function formatJson(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

/**
 * 生成随机颜色
 */
export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * 将 RGB 转换为 HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * 将 HEX 转换为 RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
