'use client';

/**
 * 数字格式化工具库
 * 用于格式化各种数字显示
 */

/**
 * 格式化数字（添加千位分隔符）
 */
export function formatNumber(
  num: number,
  options: {
    decimals?: number;
    locale?: string;
  } = {}
): string {
  const { decimals = 0, locale = 'zh-CN' } = options;

  return num.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化大数字（K, M, B）
 */
export function formatLargeNumber(num: number, locale: string = 'zh-CN'): string {
  if (num < 1000) {
    return num.toString();
  }

  const units = locale === 'zh-CN' ? ['', '万', '亿', '万亿'] : ['', 'K', 'M', 'B'];
  const threshold = locale === 'zh-CN' ? 10000 : 1000;
  const unitIndex = Math.floor(Math.log(num) / Math.log(threshold));

  const value = num / Math.pow(threshold, unitIndex);
  const unit = units[unitIndex];

  // 如果值小于100，保留1位小数
  const decimals = value < 100 ? 1 : 0;

  return `${value.toFixed(decimals)}${unit}`;
}

/**
 * 格式化百分比
 */
export function formatPercent(
  value: number,
  options: {
    decimals?: number;
    showSign?: boolean;
    locale?: string;
  } = {}
): string {
  const { decimals = 2, showSign = false, locale = 'zh-CN' } = options;

  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: showSign ? 'always' : 'auto',
  });

  return `${formatted}%`;
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN',
  options: {
    decimals?: number;
    symbol?: boolean;
  } = {}
): string {
  const { decimals = 2, symbol = true } = options;

  return amount.toLocaleString(locale, {
    style: symbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number, locale: string = 'zh-CN'): string {
  const units = locale === 'zh-CN'
    ? ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (bytes === 0) return `0 ${units[0]}`;

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${size.toFixed(i < 2 ? 0 : 2)} ${units[i]}`;
}

/**
 * 格式化时间间隔
 */
export function formatDuration(seconds: number, locale: string = 'zh-CN'): string {
  const units = locale === 'zh-CN'
    ? { year: '年', day: '天', hour: '小时', minute: '分钟', second: '秒' }
    : { year: 'y', day: 'd', hour: 'h', minute: 'm', second: 's' };

  const years = Math.floor(seconds / (365 * 24 * 3600));
  const days = Math.floor((seconds % (365 * 24 * 3600)) / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (years > 0) parts.push(`${years}${units.year}`);
  if (days > 0) parts.push(`${days}${units.day}`);
  if (hours > 0) parts.push(`${hours}${units.hour}`);
  if (minutes > 0) parts.push(`${minutes}${units.minute}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}${units.second}`);

  return parts.join(' ');
}

/**
 * 格式化速度（每秒）
 */
export function formatRate(
  value: number,
  unit: string,
  perTime: string = '秒',
  locale: string = 'zh-CN'
): string {
  const timeUnit = perTime === '秒' ? (locale === 'zh-CN' ? '秒' : 's') : perTime;
  return `${formatNumber(value, { locale })} ${unit}/${timeUnit}`;
}

/**
 * 格式化比率（如 3.5:1）
 */
export function formatRatio(a: number, b: number, decimals: number = 1): string {
  return `${a.toFixed(decimals)}:${b.toFixed(decimals)}`;
}

/**
 * 格式化分数
 */
export function formatFraction(
  numerator: number,
  denominator: number,
  options: {
    simplify?: boolean;
    decimals?: number;
  } = {}
): string {
  const { simplify = true, decimals = 2 } = options;

  if (simplify && denominator !== 0) {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };

    const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
    const simplifiedNum = numerator / divisor;
    const simplifiedDen = denominator / divisor;

    return `${simplifiedNum}/${simplifiedDen}`;
  }

  const value = denominator !== 0 ? numerator / denominator : 0;
  return value.toFixed(decimals);
}

/**
 * 格式化序数（1st, 2nd, 3rd）
 */
export function formatOrdinal(num: number, locale: string = 'en'): string {
  if (locale === 'zh-CN') {
    return `第${num}位`;
  }

  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];

  return `${num}${suffix}`;
}

/**
 * 格式化科学计数法
 */
export function formatScientific(num: number, decimals: number = 2): string {
  return num.toExponential(decimals);
}

/**
 * 格式化罗马数字
 */
export function formatRoman(num: number): string {
  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' },
  ];

  let result = '';
  let remaining = num;

  for (const { value, symbol } of romanNumerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}

/**
 * 格式化数字为中文大写
 */
export function formatChineseNumber(num: number): string {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];

  if (num === 0) return digits[0];

  let result = '';
  let unitIndex = 0;
  let lastNonZero = false;

  while (num > 0) {
    const digit = num % 10;
    num = Math.floor(num / 10);

    if (digit > 0) {
      result = digits[digit] + units[unitIndex] + result;
      lastNonZero = true;
    } else if (lastNonZero && result !== '') {
      result = digits[0] + result;
      lastNonZero = false;
    }

    unitIndex++;
  }

  return result;
}

/**
 * 解析数字字符串
 */
export function parseNumber(str: string, locale: string = 'zh-CN'): number | null {
  try {
    // 移除所有非数字字符（除了小数点、负号和百分号）
    let cleaned = str.replace(/[^\d.\-+%]/g, '');

    // 处理百分比
    if (cleaned.includes('%')) {
      cleaned = cleaned.replace('%', '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num / 100;
    }

    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

/**
 * 数字范围检查
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

/**
 * 限制数字范围
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 四舍五入到指定精度
 */
export function roundTo(num: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

export default {
  formatNumber,
  formatLargeNumber,
  formatPercent,
  formatCurrency,
  formatFileSize,
  formatDuration,
  formatRate,
  formatRatio,
  formatFraction,
  formatOrdinal,
  formatScientific,
  formatRoman,
  formatChineseNumber,
  parseNumber,
  isInRange,
  clamp,
  roundTo,
};
