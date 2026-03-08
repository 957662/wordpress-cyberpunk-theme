/**
 * CyberPress Format Utilities
 * 格式化工具函数
 */

import { format, formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number, formatStr: string = 'yyyy-MM-dd HH:mm:ss'): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: zhCN });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

/**
 * 格式化相对时间（如："3小时前"）
 */
export function formatRelativeTime(date: Date | string | number): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { locale: zhCN, addSuffix: true });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
}

/**
 * 智能格式化时间（根据时间差选择显示方式）
 */
export function formatSmartTime(date: Date | string | number): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const now = new Date();

    const minutes = differenceInMinutes(now, dateObj);
    const hours = differenceInHours(now, dateObj);
    const days = differenceInDays(now, dateObj);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return formatDate(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Smart time formatting error:', error);
    return '';
  }
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化货币
 */
export function formatCurrency(amount: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
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

  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

/**
 * 格式化时长（秒 -> HH:MM:SS）
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化阅读时间
 */
export function formatReadTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} 小时 ${remainingMinutes} 分钟` : `${hours} 小时`;
}

/**
 * 格式化手机号（隐藏中间4位）
 */
export function formatPhone(phone: string): string {
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return phone;
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 格式化身份证号（隐藏中间部分）
 */
export function formatIdCard(id: string): string {
  if (id.length < 18) return id;
  return id.replace(/^(.{6})(.{8})(.{4})$/, '$1********$3');
}

/**
 * 格式化银行卡号（每4位一组）
 */
export function formatBankCard(cardNumber: string): string {
  return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * 截断文本（添加省略号）
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 高亮关键词
 */
export function highlightKeywords(text: string, keywords: string[], highlightClass: string = 'bg-yellow-300'): string {
  let result = text;

  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(regex, `<span class="${highlightClass}">$1</span>`);
  });

  return result;
}

/**
 * 格式化摘要（移除HTML标签，截断文本）
 */
export function formatExcerpt(html: string, maxLength: number = 200): string {
  // 移除 HTML 标签
  const text = html.replace(/<[^>]*>/g, '');
  // 移除多余的空白
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return truncateText(cleaned, maxLength);
}

/**
 * 格式化 SEO 友好的 URL slug
 */
export function formatSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 格式化关键词列表（逗号分隔）
 */
export function formatKeywords(keywords: string[]): string {
  return keywords.join(', ');
}

/**
 * 解析关键词（从字符串转为数组）
 */
export function parseKeywords(keywordsString: string): string[] {
  return keywordsString
    .split(/[,，\n]/)
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
}

/**
 * 格式化作者信息
 */
export function formatAuthor(author: { name: string; url?: string }): string {
  if (author.url) {
    return `<a href="${author.url}" class="text-cyber-cyan hover:underline">${author.name}</a>`;
  }
  return author.name;
}

/**
 * 格式化分类链接
 */
export function formatCategory(category: { name: string; slug: string }): string {
  return `<a href="/categories/${category.slug}" class="text-cyber-purple hover:underline">${category.name}</a>`;
}

/**
 * 格式化标签链接
 */
export function formatTags(tags: Array<{ name: string; slug: string }>): string {
  return tags
    .map(
      (tag) =>
        `<a href="/tags/${tag.slug}" class="inline-block px-2 py-1 bg-cyber-cyan/20 text-cyber-cyan text-xs rounded-full hover:bg-cyber-cyan/30 transition-colors">${tag.name}</a>`
    )
    .join(' ');
}

/**
 * 格式化面包屑导航
 */
export function formatBreadcrumbs(items: Array<{ name: string; url?: string }>): string {
  return items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      if (isLast) {
        return `<span class="text-gray-400">${item.name}</span>`;
      }
      return item.url
        ? `<a href="${item.url}" class="text-cyber-cyan hover:underline">${item.name}</a>`
        : `<span class="text-gray-400">${item.name}</span>`;
    })
    .join('<span class="mx-2 text-gray-600">/</span>');
}

/**
 * 格式化分页信息
 */
export function formatPaginationInfo(currentPage: number, pageSize: number, totalItems: number): string {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return `显示 ${startItem}-${endItem} 条，共 ${totalItems} 条`;
}

/**
 * 格式化进度条百分比
 */
export function formatProgress(current: number, total: number): string {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return `${percentage.toFixed(1)}%`;
}

/**
 * 格式化评级（星级）
 */
export function formatRating(rating: number, maxRating: number = 5): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    '★'.repeat(fullStars) +
    (hasHalfStar ? '½' : '') +
    '☆'.repeat(emptyStars) +
    ` (${rating.toFixed(1)})`
  );
}

/**
 * 格式化版本号
 */
export function formatVersion(version: string): string {
  const parts = version.split('.');
  if (parts.length === 3) {
    return `v${version}`;
  }
  return version;
}

/**
 * 格式化环境变量
 */
export function formatEnvironment(env: string): string {
  const envMap: Record<string, string> = {
    development: '开发环境',
    staging: '预发布环境',
    production: '生产环境',
    test: '测试环境',
  };
  return envMap[env] || env;
}

/**
 * 格式化状态
 */
export function formatStatus(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: '活跃', color: 'green' },
    inactive: { label: '未激活', color: 'gray' },
    pending: { label: '待处理', color: 'yellow' },
    completed: { label: '已完成', color: 'blue' },
    failed: { label: '失败', color: 'red' },
    published: { label: '已发布', color: 'cyan' },
    draft: { label: '草稿', color: 'gray' },
    archived: { label: '已归档', color: 'gray' },
  };

  return statusMap[status] || { label: status, color: 'gray' };
}

/**
 * 格式化代码块
 */
export function formatCodeBlock(code: string, language: string = 'typescript'): string {
  return `<pre class="bg-cyber-dark p-4 rounded-lg overflow-x-auto"><code class="language-${language}">${code}</code></pre>`;
}

/**
 * 格式化引用块
 */
export function formatBlockquote(text: string, author?: string): string {
  const attribution = author ? `<footer class="text-sm text-gray-400 mt-2">— ${author}</footer>` : '';
  return `<blockquote class="border-l-4 border-cyber-cyan pl-4 italic text-gray-300">${text}${attribution}</blockquote>`;
}

/**
 * 格式化列表
 */
export function formatList(items: string[], ordered: boolean = false): string {
  const tag = ordered ? 'ol' : 'ul';
  const listClass = ordered ? 'list-decimal' : 'list-disc';
  return `<${tag} class="${listClass} pl-6 space-y-2">${items.map((item) => `<li>${item}</li>`).join('')}</${tag}>`;
}
