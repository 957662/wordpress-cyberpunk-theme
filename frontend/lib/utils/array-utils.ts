/**
 * Array utilities for CyberPress Platform
 * Enhanced array manipulation and transformation utilities
 */

/**
 * Remove duplicate values from array
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Remove duplicate objects by key
 */
export function uniqueBy<T extends Record<string, any>>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Group array items by key
 */
export function groupBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T
): Record<string, T[]> {
  return arr.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array
 */
export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 */
export function random<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random items from array
 */
export function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Flatten nested array
 */
export function flatten<T>(arr: any[]): T[] {
  return arr.reduce<T[]>((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}

/**
 * Flatten array by one level
 */
export function flattenOne<T>(arr: any[]): T[] {
  return arr.reduce<T[]>((acc, val) => acc.concat(val), []);
}

/**
 * Sort array by key
 */
export function sortBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Sort array by multiple keys
 */
export function sortByMultiple<T extends Record<string, any>>(
  arr: T[],
  keys: Array<{ key: keyof T; order: 'asc' | 'desc' }>
): T[] {
  return [...arr].sort((a, b) => {
    for (const { key, order } of keys) {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Filter array by multiple conditions
 */
export function filterBy<T extends Record<string, any>>(
  arr: T[],
  conditions: Partial<Record<keyof T, any>>
): T[] {
  return arr.filter((item) => {
    return Object.entries(conditions).every(([key, value]) => item[key as keyof T] === value);
  });
}

/**
 * Find item by condition
 */
export function findBy<T extends Record<string, any>>(
  arr: T[],
  conditions: Partial<Record<keyof T, any>>
): T | undefined {
  return arr.find((item) => {
    return Object.entries(conditions).every(([key, value]) => item[key as keyof T] === value);
  });
}

/**
 * Partition array into two arrays based on condition
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return arr.reduce(
    ([pass, fail], item) => {
      return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []] as [T[], T[]]
  );
}

/**
 * Get difference between two arrays
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => !arr2.includes(item));
}

/**
 * Get intersection of two arrays
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => arr2.includes(item));
}

/**
 * Get union of two arrays
 */
export function union<T>(arr1: T[], arr2: T[]): T[] {
  return unique([...arr1, ...arr2]);
}

/**
 * Remove item from array
 */
export function remove<T>(arr: T[], item: T): T[] {
  const index = arr.indexOf(item);
  if (index > -1) {
    const result = [...arr];
    result.splice(index, 1);
    return result;
  }
  return arr;
}

/**
 * Remove items from array by index
 */
export function removeAt<T>(arr: T[], index: number): T[] {
  if (index >= 0 && index < arr.length) {
    const result = [...arr];
    result.splice(index, 1);
    return result;
  }
  return arr;
}

/**
 * Insert item at index
 */
export function insertAt<T>(arr: T[], index: number, item: T): T[] {
  if (index >= 0 && index <= arr.length) {
    const result = [...arr];
    result.splice(index, 0, item);
    return result;
  }
  return arr;
}

/**
 * Update item at index
 */
export function updateAt<T>(arr: T[], index: number, item: T): T[] {
  if (index >= 0 && index < arr.length) {
    const result = [...arr];
    result[index] = item;
    return result;
  }
  return arr;
}

/**
 * Move item from one index to another
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
    return arr;
  }

  const result = [...arr];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);

  return result;
}

/**
 * Swap items at two indices
 */
export function swap<T>(arr: T[], index1: number, index2: number): T[] {
  if (index1 < 0 || index1 >= arr.length || index2 < 0 || index2 >= arr.length) {
    return arr;
  }

  const result = [...arr];
  [result[index1], result[index2]] = [result[index2], result[index1]];

  return result;
}

/**
 * Get first N items
 */
export function first<T>(arr: T[], n: number = 1): T[] {
  return arr.slice(0, n);
}

/**
 * Get last N items
 */
export function last<T>(arr: T[], n: number = 1): T[] {
  return arr.slice(-n);
}

/**
 * Get array without first N items
 */
export function dropFirst<T>(arr: T[], n: number = 1): T[] {
  return arr.slice(n);
}

/**
 * Get array without last N items
 */
export function dropLast<T>(arr: T[], n: number = 1): T[] {
  return arr.slice(0, -n);
}

/**
 * Sum array of numbers
 */
export function sum(arr: number[]): number {
  return arr.reduce((total, num) => total + num, 0);
}

/**
 * Get average of array of numbers
 */
export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/**
 * Get max value in array
 */
export function max(arr: number[]): number {
  return Math.max(...arr);
}

/**
 * Get min value in array
 */
export function min(arr: number[]): number {
  return Math.min(...arr);
}

/**
 * Get array range
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Zip multiple arrays
 */
export function zip<T extends any[]>(...arrays: T[]): T[][] {
  const minLength = Math.min(...arrays.map((arr) => arr.length));
  return Array.from({ length: minLength }, (_, i) => arrays.map((arr) => arr[i]));
}

/**
 * Unzip array of tuples
 */
export function unzip<T extends any[]>(arr: T[][]): T[][] {
  return arr[0].map((_, i) => arr.map((tuple) => tuple[i]));
}

/**
 * Check if array is empty
 */
export function isEmpty<T>(arr: T[]): boolean {
  return arr.length === 0;
}

/**
 * Check if arrays are equal
 */
export function isEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * Count occurrences of value in array
 */
export function countOccurrences<T>(arr: T[], value: T): number {
  return arr.filter((item) => item === value).length;
}

/**
 * Get frequency map of array values
 */
export function frequency<T>(arr: T[]): Map<T, number> {
  return arr.reduce((map, item) => {
    map.set(item, (map.get(item) || 0) + 1);
    return map;
  }, new Map<T, number>());
}

/**
 * Sort array naturally (for strings with numbers)
 */
export function naturalSort(arr: string[]): string[] {
  return [...arr].sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

/**
 * Paginate array
 */
export function paginate<T>(arr: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return arr.slice(start, start + pageSize);
}

/**
 * Create array with N elements
 */
export function createArray<T>(length: number, value: T | ((index: number) => T)): T[] {
  return Array.from({ length }, (_, i) => (typeof value === 'function' ? (value as any)(i) : value));
}

/**
 * Sample array randomly
 */
export function sample<T>(arr: T[], size: number): T[] {
  return randomItems(arr, Math.min(size, arr.length));
}

/**
 * Check if array is sorted
 */
export function isSorted<T>(arr: T[], order: 'asc' | 'desc' = 'asc'): boolean {
  if (arr.length <= 1) return true;

  for (let i = 0; i < arr.length - 1; i++) {
    const comparison = arr[i] < arr[i + 1];
    if (order === 'asc' && !comparison) return false;
    if (order === 'desc' && comparison) return false;
  }

  return true;
}

/**
 * Rotate array
 */
export function rotate<T>(arr: T[], positions: number): T[] {
  const index = positions % arr.length;
  return [...arr.slice(index), ...arr.slice(0, index)];
}

/**
 * Find index of item by condition
 */
export function findIndexBy<T extends Record<string, any>>(
  arr: T[],
  conditions: Partial<Record<keyof T, any>>
): number {
  return arr.findIndex((item) => {
    return Object.entries(conditions).every(([key, value]) => item[key as keyof T] === value);
  });
}

/**
 * Update item by condition
 */
export function updateBy<T extends Record<string, any>>(
  arr: T[],
  conditions: Partial<Record<keyof T, any>>,
  updates: Partial<T>
): T[] {
  return arr.map((item) => {
    const matches = Object.entries(conditions).every(([key, value]) => item[key as keyof T] === value);
    return matches ? { ...item, ...updates } : item;
  });
}

/**
 * Remove items by condition
 */
export function removeBy<T extends Record<string, any>>(
  arr: T[],
  conditions: Partial<Record<keyof T, any>>
): T[] {
  return arr.filter((item) => {
    return !Object.entries(conditions).every(([key, value]) => item[key as keyof T] === value);
  });
}
