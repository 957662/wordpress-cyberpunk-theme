/**
 * Format Utilities
 * 格式化工具函数
 */

/**
 * 格式化数字（添加千位分隔符）
 * @param num - 数字
 * @param locale - 地区代码
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number, locale: string = 'zh-CN'): string {
  return num.toLocaleString(locale);
}

/**
 * 格式化百分比
 * @param value - 值
 * @param decimals - 小数位数
 * @returns 格式化后的字符串
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @param decimals - 小数位数
 * @returns 格式化后的字符串
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 格式化货币
 * @param amount - 金额
 * @param currency - 货币代码
 * @param locale - 地区代码
 * @returns 格式化后的字符串
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
 * 格式化日期
 * @param date - 日期
 * @param format - 格式
 * @returns 格式化后的字符串
 */
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化相对时间
 * @param date - 日期
 * @param locale - 地区代码
 * @returns 格式化后的字符串
 */
export function formatRelativeTime(date: Date | string | number, locale: string = 'zh-CN'): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (locale === 'zh-CN') {
    if (diffSecs < 60) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    if (diffMonths < 12) return `${diffMonths}个月前`;
    return `${diffYears}年前`;
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSecs < 60) return rtf.format(-diffSecs, 'second');
  if (diffMins < 60) return rtf.format(-diffMins, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  if (diffMonths < 12) return rtf.format(-diffMonths, 'month');
  return rtf.format(-diffYears, 'year');
}

/**
 * 格式化时间范围
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @param format - 格式
 * @returns 格式化后的字符串
 */
export function formatTimeRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm'
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

  return `${formatDate(start, format)} - ${formatDate(end, format)}`;
}

/**
 * 格式化持续时间
 * @param seconds - 秒数
 * @returns 格式化后的字符串（HH:mm:ss）
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');

  if (hours > 0) {
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * 格式化手机号
 * @param phone - 手机号
 * @returns 格式化后的字符串
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * 格式化身份证号
 * @param idCard - 身份证号
 * @returns 格式化后的字符串
 */
export function formatIdCard(idCard: string): string {
  if (idCard.length === 18) {
    return `${idCard.slice(0, 6)} ${idCard.slice(6, 14)} ${idCard.slice(14)}`;
  }

  return idCard;
}

/**
 * 格式化银行卡号
 * @param cardNumber - 银行卡号
 * @returns 格式化后的字符串
 */
export function formatBankCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);

  return groups ? groups.join(' ') : cardNumber;
}

/**
 * 格式化 URL
 * @param url - URL
 * @returns 格式化后的 URL
 */
export function formatUrl(url: string): string {
  if (!url) return '';

  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
}

/**
 * 格式化邮箱
 * @param email - 邮箱地址
 * @returns 格式化后的邮箱地址
 */
export function formatEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * 格式化用户名
 * @param username - 用户名
 * @returns 格式化后的用户名
 */
export function formatUsername(username: string): string {
  return username.trim().replace(/\s+/g, '_').toLowerCase();
}

/**
 * 格式化地址（省市区）
 * @param province - 省份
 * @param city - 城市
 * @param district - 区县
 * @param detail - 详细地址
 * @returns 格式化后的地址
 */
export function formatAddress(
  province: string,
  city: string,
  district: string,
  detail?: string
): string {
  const parts = [province, city, district].filter(Boolean);
  const area = parts.join(' ');
  return detail ? `${area} ${detail}` : area;
}

/**
 * 格式化 MAC 地址
 * @param mac - MAC 地址
 * @param separator - 分隔符
 * @returns 格式化后的 MAC 地址
 */
export function formatMacAddress(mac: string, separator: string = ':'): string {
  const cleaned = mac.replace(/[^a-fA-F0-9]/g, '');

  if (cleaned.length !== 12) return mac;

  return cleaned.match(/.{1,2}/g)!.join(separator);
}

/**
 * 格式化版本号
 * @param version - 版本号
 * @returns 格式化后的版本号
 */
export function formatVersion(version: string): string {
  const cleaned = version.replace(/[^\d.]/g, '');

  if (cleaned.startsWith('.')) {
    return `0${cleaned}`;
  }

  return cleaned;
}

/**
 * 比较版本号
 * @param version1 - 版本号1
 * @param version2 - 版本号2
 * @returns 比较结果
 */
export function compareVersions(version1: string, version2: string): number {
  const v1 = formatVersion(version1).split('.').map(Number);
  const v2 = formatVersion(version2).split('.').map(Number);

  const maxLength = Math.max(v1.length, v2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

/**
 * 格式化 JSON
 * @param obj - 对象
 * @param indent - 缩进空格数
 * @returns 格式化后的 JSON 字符串
 */
export function formatJson(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

/**
 * 高亮关键词
 * @param text - 文本
 * @param keywords - 关键词数组
 * @param tag - 标签名
 * @returns 高亮后的 HTML
 */
export function highlightKeywords(
  text: string,
  keywords: string[],
  tag: string = 'mark'
): string {
  let highlighted = text;

  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlighted = highlighted.replace(regex, `<${tag}>$1</${tag}>`);
  });

  return highlighted;
}

/**
 * 截断文本并添加省略号
 * @param text - 文本
 * @param maxLength - 最大长度
 * @param suffix - 后缀
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 隐藏敏感信息
 * @param str - 字符串
 * @param visibleStart - 开头可见字符数
 * @param visibleEnd - 结尾可见字符数
 * @param maskChar - 掩码字符
 * @returns 隐藏后的字符串
 */
export function maskSensitive(
  str: string,
  visibleStart: number = 3,
  visibleEnd: number = 4,
  maskChar: string = '*'
): string {
  if (str.length <= visibleStart + visibleEnd) return str;

  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const masked = maskChar.repeat(str.length - visibleStart - visibleEnd);

  return start + masked + end;
}

/**
 * 格式化文本（首字母大写，去除多余空格）
 * @param text - 文本
 * @returns 格式化后的文本
 */
export function formatText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
}
