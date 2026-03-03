/**
 * Number Helpers - 数字处理工具函数
 * 提供各种数字格式化和处理的工具函数
 */

// ============================================
// 类型定义
// ============================================

export type NumberFormatOptions = {
  /** 小数位数 */
  decimals?: number;
  /** 千分位分隔符 */
  separator?: string;
  /** 小数点符号 */
  decimalPoint?: string;
  /** 是否添加前缀 */
  prefix?: string;
  /** 是否添加后缀 */
  suffix?: string;
};

export type CurrencyFormatOptions = NumberFormatOptions & {
  /** 货币符号 */
  symbol?: string;
  /** 符号位置 */
  symbolPosition?: 'before' | 'after';
};

export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

// ============================================
// 数字格式化
// ============================================

/**
 * 格式化数字
 */
export function formatNumber(
  num: number,
  options: NumberFormatOptions = {}
): string {
  const {
    decimals = 0,
    separator = ',',
    decimalPoint = '.',
    prefix = '',
    suffix = '',
  } = options;

  const rounded = Number(num.toFixed(decimals));
  const parts = rounded.toString().split('.');

  // 添加千分位分隔符
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  // 组合结果
  let result = parts.join(decimalPoint);
  if (prefix) result = prefix + result;
  if (suffix) result = result + suffix;

  return result;
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {}
): string {
  const {
    symbol = '$',
    symbolPosition = 'before',
    decimals = 2,
    ...rest
  } = options;

  const formatted = formatNumber(amount, { decimals, ...rest });

  if (symbolPosition === 'before') {
    return symbol + formatted;
  } else {
    return formatted + symbol;
  }
}

/**
 * 格式化百分比
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return formatNumber(value, {
    decimals,
    suffix: '%',
  });
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化数字（简化形式）
 */
export function formatCompactNumber(num: number): string {
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
 * 格式化整数（带序数后缀）
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  const suffix = suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  return num + suffix;
}

// ============================================
// 数字转换
// ============================================

/**
 * 转换为整数
 */
export function toInteger(value: any, defaultValue: number = 0): number {
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 转换为浮点数
 */
export function toFloat(value: any, defaultValue: number = 0): number {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 安全除法（避免除以零）
 */
export function safeDivide(
  numerator: number,
  denominator: number,
  defaultValue: number = 0
): number {
  if (denominator === 0) return defaultValue;
  return numerator / denominator;
}

/**
 * 范围限制
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

/**
 * 映射范围
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// ============================================
// 随机数生成
// ============================================

/**
 * 生成指定范围内的随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定范围内的随机浮点数
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * 生成随机布尔值
 */
export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}

/**
 * 从数组中随机选择一个元素
 */
export function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * 生成UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================
// 数学计算
// ============================================

/**
 * 计算总和
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * 计算平均值
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

/**
 * 计算中位数
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * 计算标准差
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const avg = average(numbers);
  const squareDiffs = numbers.map((num) => Math.pow(num - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  
  return Math.sqrt(avgSquareDiff);
}

/**
 * 计算百分比
 */
export function calculatePercentage(
  part: number,
  total: number,
  decimals: number = 1
): number {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(decimals));
}

/**
 * 计算增长率
 */
export function calculateGrowthRate(
  current: number,
  previous: number,
  decimals: number = 1
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number(((current - previous) / previous * 100).toFixed(decimals));
}

// ============================================
// 时间转换
// ============================================

/**
 * 秒转换为毫秒
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * 毫秒转换为秒
 */
export function msToSeconds(ms: number): number {
  return ms / 1000;
}

/**
 * 分钟转换为毫秒
 */
export function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000;
}

/**
 * 毫秒转换为分钟
 */
export function msToMinutes(ms: number): number {
  return ms / (60 * 1000);
}

/**
 * 格式化持续时间
 */
export function formatDuration(
  ms: number,
  units: TimeUnit[] = ['hour', 'minute', 'second']
): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const result: string[] = [];

  if (units.includes('day') && days > 0) {
    result.push(`${days}d`);
  }
  if (units.includes('hour') && hours % 24 > 0) {
    result.push(`${hours % 24}h`);
  }
  if (units.includes('minute') && minutes % 60 > 0) {
    result.push(`${minutes % 60}m`);
  }
  if (units.includes('second') && seconds % 60 > 0) {
    result.push(`${seconds % 60}s`);
  }

  return result.length > 0 ? result.join(' ') : '0s';
}

// ============================================
// 验证函数
// ============================================

/**
 * 检查是否为有效数字
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * 检查是否为整数
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(value);
}

/**
 * 检查是否为正数
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * 检查是否为偶数
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * 检查是否为奇数
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * 检查是否在范围内
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

// ============================================
// 进制转换
// ============================================

/**
 * 十进制转十六进制
 */
export function toHex(decimal: number): string {
  return '0x' + decimal.toString(16);
}

/**
 * 十六进制转十进制
 */
export function fromHex(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * 十进制转二进制
 */
export function toBinary(decimal: number): string {
  return decimal.toString(2);
}

/**
 * 二进制转十进制
 */
export function fromBinary(binary: string): number {
  return parseInt(binary, 2);
}

/**
 * RGB转十六进制颜色
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 十六进制颜色转RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

// ============================================
// 导出所有函数
// ============================================

export const numberHelpers = {
  // 格式化
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatCompactNumber,
  formatOrdinal,
  
  // 转换
  toInteger,
  toFloat,
  safeDivide,
  clamp,
  lerp,
  mapRange,
  
  // 随机
  randomInt,
  randomFloat,
  randomBoolean,
  randomChoice,
  generateUUID,
  
  // 数学
  sum,
  average,
  median,
  standardDeviation,
  calculatePercentage,
  calculateGrowthRate,
  
  // 时间
  secondsToMs,
  msToSeconds,
  minutesToMs,
  msToMinutes,
  formatDuration,
  
  // 验证
  isValidNumber,
  isInteger,
  isPositive,
  isEven,
  isOdd,
  isInRange,
  
  // 进制
  toHex,
  fromHex,
  toBinary,
  fromBinary,
  rgbToHex,
  hexToRgb,
};

export default numberHelpers;
