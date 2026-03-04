/**
 * Number utilities for CyberPress Platform
 * Enhanced number formatting and manipulation utilities
 */

/**
 * Format number with commas (e.g., 1,234,567)
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format number as compact string (e.g., 1.2K, 1.5M, 2.3B)
 */
export function formatCompactNumber(num: number): string {
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs < 1000) {
    return sign + abs.toString();
  }

  if (abs < 1000000) {
    return sign + (abs / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  if (abs < 1000000000) {
    return sign + (abs / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

  if (abs < 1000000000000) {
    return sign + (abs / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }

  return sign + (abs / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
}

/**
 * Format number as currency
 */
export function formatCurrency(
  num: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(num);
}

/**
 * Format number as percentage
 */
export function formatPercentage(
  num: number,
  decimals: number = 1
): string {
  return (num * 100).toFixed(decimals) + '%';
}

/**
 * Format number with ordinal suffix (e.g., 1st, 2nd, 3rd, 4th)
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  const suffix =
    suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  return num + suffix;
}

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Round number to decimal places
 */
export function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Generate random number between min and max
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate random integer between min and max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

/**
 * Check if number is in range
 */
export function inRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

/**
 * Lerp (linear interpolation) between two numbers
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map number from one range to another
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
 * Convert bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Convert seconds to human readable duration
 */
export function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate percentage change between two numbers
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format number with abbreviations for social media stats
 */
export function formatStatCount(num: number): string {
  const abs = Math.abs(num);

  if (abs < 1000) {
    return num.toString();
  }

  if (abs < 10000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  if (abs < 1000000) {
    return (num / 1000).toFixed(0) + 'K';
  }

  if (abs < 10000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

  return (num / 1000000).toFixed(0) + 'M';
}

/**
 * Parse string to number safely
 */
export function parseNumber(str: string, defaultValue: number = 0): number {
  const num = parseFloat(str);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Check if number is even
 */
export function isEven(num: number): boolean {
  return num % 2 === 0;
}

/**
 * Check if number is odd
 */
export function isOdd(num: number): boolean {
  return !isEven(num);
}

/**
 * Get average of numbers
 */
export function average(...numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Get sum of numbers
 */
export function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

/**
 * Get max of numbers
 */
export function max(...numbers: number[]): number {
  return Math.max(...numbers);
}

/**
 * Get min of numbers
 */
export function min(...numbers: number[]): number {
  return Math.min(...numbers);
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Round to nearest multiple
 */
export function roundToMultiple(num: number, multiple: number): number {
  return Math.round(num / multiple) * multiple;
}

/**
 * Ceil to nearest multiple
 */
export function ceilToMultiple(num: number, multiple: number): number {
  return Math.ceil(num / multiple) * multiple;
}

/**
 * Floor to nearest multiple
 */
export function floorToMultiple(num: number, multiple: number): number {
  return Math.floor(num / multiple) * multiple;
}
