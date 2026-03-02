/**
 * Number Utilities
 * 数字处理工具集
 */

// ============================================
// 格式化函数
// ============================================

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(
  num: number,
  options: {
    decimals?: number;
    delimiter?: string;
    separator?: string;
  } = {}
): string {
  const { decimals = 0, delimiter = ',', separator = '.' } = options;

  const parts = num.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);

  return parts.join(separator);
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  options: {
    currency?: string;
    locale?: string;
    decimals?: number;
  } = {}
): string {
  const { currency = 'CNY', locale = 'zh-CN', decimals = 2 } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercent(
  value: number,
  options: {
    decimals?: number;
    multiply?: boolean;
  } = {}
): string {
  const { decimals = 2, multiply = true } = options;

  const percent = multiply ? value * 100 : value;

  return `${percent.toFixed(decimals)}%`;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(
  bytes: number,
  options: {
    decimals?: number;
    unit?: 'metric' | 'binary';
  } = {}
): string {
  const { decimals = 2, unit = 'binary' } = options;

  const threshold = unit === 'binary' ? 1024 : 1000;
  const units = unit === 'binary'
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (bytes === 0) return `0 ${units[0]}`;

  const i = Math.floor(Math.log(bytes) / Math.log(threshold));
  const size = bytes / Math.pow(threshold, i);

  return `${size.toFixed(decimals)} ${units[i]}`;
}

/**
 * 格式化持续时间（秒）
 */
export function formatDuration(
  seconds: number,
  options: {
    format?: 'short' | 'long' | 'verbose';
    showMilliseconds?: boolean;
  } = {}
): string {
  const { format = 'long', showMilliseconds = false } = options;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(format === 'verbose' ? `${hours}小时` : String(hours).padStart(2, '0'));
  }

  parts.push(format === 'verbose' ? `${minutes}分钟` : String(minutes).padStart(2, '0'));
  parts.push(format === 'verbose' ? `${secs}秒` : String(secs).padStart(2, '0'));

  if (showMilliseconds && ms > 0) {
    parts.push(String(ms).padStart(3, '0'));
  }

  if (format === 'short') {
    return parts.slice(-2).join(':');
  }

  return parts.join(':');
}

// ============================================
// 数学函数
// ============================================

/**
 * 限制数字在指定范围内
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * 映射数字范围
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

/**
 * 四舍五入到指定精度
 */
export function roundTo(num: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

/**
 * 向上取整到指定精度
 */
export function ceilTo(num: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.ceil(num * factor) / factor;
}

/**
 * 向下取整到指定精度
 */
export function floorTo(num: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.floor(num * factor) / factor;
}

/**
 * 生成范围内的随机数
 */
export function randomInRange(min: number, max: number, decimals = 0): number {
  const num = Math.random() * (max - min) + min;
  return decimals === 0 ? Math.floor(num) : Number(num.toFixed(decimals));
}

/**
 * 生成唯一ID
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// ============================================
// 判断函数
// ============================================

/**
 * 判断是否是数字
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 判断是否是整数
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

/**
 * 判断是否是正数
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * 判断是否是负数
 */
export function isNegative(value: number): boolean {
  return value < 0;
}

/**
 * 判断是否是偶数
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * 判断是否是奇数
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * 判断是否在范围内
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 判断两个数字是否近似相等
 */
export function isApproximatelyEqual(
  a: number,
  b: number,
  tolerance = 0.0001
): boolean {
  return Math.abs(a - b) < tolerance;
}

// ============================================
// 统计函数
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
 * 计算众数（出现最频繁的数）
 */
export function mode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];

  const frequency: Record<number, number> = {};
  numbers.forEach((num) => {
    frequency[num] = (frequency[num] || 0) + 1;
  });

  const maxFreq = Math.max(...Object.values(frequency));
  return Object.keys(frequency)
    .map(Number)
    .filter((num) => frequency[num] === maxFreq);
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
 * 计算方差
 */
export function variance(numbers: number[]): number {
  const stdDev = standardDeviation(numbers);
  return stdDev * stdDev;
}

/**
 * 找最大值
 */
export function max(numbers: number[]): number {
  return Math.max(...numbers);
}

/**
 * 找最小值
 */
export function min(numbers: number[]): number {
  return Math.min(...numbers);
}

// ============================================
// 数组操作
// ============================================

/**
 * 创建数字范围
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  const current = start;

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else if (step < 0) {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }

  return result;
}

/**
 * 随机打乱数组
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 从数组中随机选择一个元素
 */
export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 从数组中随机选择 n 个元素
 */
export function sampleSize<T>(array: T[], n: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(n, array.length));
}

// ============================================
// 进制转换
// ============================================

/**
 * 十进制转二进制
 */
export function toBinary(num: number): string {
  return num.toString(2);
}

/**
 * 二进制转十进制
 */
export function fromBinary(binary: string): number {
  return parseInt(binary, 2);
}

/**
 * 十进制转十六进制
 */
export function toHex(num: number): string {
  return num.toString(16);
}

/**
 * 十六进制转十进制
 */
export function fromHex(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * 十进制转八进制
 */
export function toOctal(num: number): string {
  return num.toString(8);
}

/**
 * 八进制转十进制
 */
export function fromOctal(octal: string): number {
  return parseInt(octal, 8);
}

// ============================================
// 特殊数字
// ============================================

/**
 * 计算阶乘
 */
export function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

/**
 * 计算斐波那契数列第 n 项
 */
export function fibonacci(n: number): number {
  if (n < 0) return NaN;
  if (n === 0) return 0;
  if (n === 1) return 1;

  let prev = 0;
  let current = 1;

  for (let i = 2; i <= n; i++) {
    [prev, current] = [current, prev + current];
  }

  return current;
}

/**
 * 计算最大公约数
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * 计算最小公倍数
 */
export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}
