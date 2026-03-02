/**
 * Array utility functions for CyberPress Platform
 */

// Chunk array into smaller arrays
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Remove duplicates from array
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// Remove duplicates based on key function
export function uniqueBy<T>(array: T[], keyFn: (item: T) => any): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Group array by key
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// Shuffle array
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Sample random items from array
export function sample<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

// Get random item from array
export function sampleOne<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

// Sort array by key
export function sortBy<T>(array: T[], keyFn: (item: T) => any, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = keyFn(a);
    const bValue = keyFn(b);

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// Find intersection of two arrays
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];

  return arrays[0].filter((item) =>
    arrays.every((array) => array.includes(item))
  );
}

// Find difference of two arrays
export function difference<T>(array: T[], ...arrays: T[][]): T[] {
  const exclude = new Set(arrays.flat());
  return array.filter((item) => !exclude.has(item));
}

// Find union of arrays
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

// Partition array by predicate
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return array.reduce(
    (result, item) => {
      result[predicate(item) ? 0 : 1].push(item);
      return result;
    },
    [[], []] as [T[], T[]]
  );
}

// Flatten nested arrays
export function flatten<T>(array: any[], depth: number = Infinity): T[] {
  if (depth === 0) return array as T[];
  return array.reduce<T[]>(
    (acc, item) => [
      ...acc,
      ...(Array.isArray(item) ? flatten(item, depth - 1) : [item]),
    ],
    []
  );
}

// Compact array (remove falsy values)
export function compact<T>(array: (T | null | undefined | false | '' | 0)[]): T[] {
  return array.filter(Boolean) as T[];
}

// Take first n items
export function take<T>(array: T[], count: number): T[] {
  return array.slice(0, count);
}

// Take last n items
export function takeRight<T>(array: T[], count: number): T[] {
  return array.slice(-count);
}

// Drop first n items
export function drop<T>(array: T[], count: number): T[] {
  return array.slice(count);
}

// Drop last n items
export function dropRight<T>(array: T[], count: number): T[] {
  return array.slice(0, -count);
}

// Get first item
export function first<T>(array: T[]): T | undefined {
  return array[0];
}

// Get last item
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

// Get nth item (supports negative indices)
export function nth<T>(array: T[], index: number): T | undefined {
  if (index < 0) {
    return array[array.length + index];
  }
  return array[index];
}

// Find item index
export function indexOf<T>(array: T[], item: T, fromIndex: number = 0): number {
  return array.indexOf(item, fromIndex);
}

// Find last item index
export function lastIndexOf<T>(array: T[], item: T, fromIndex?: number): number {
  return array.lastIndexOf(item, fromIndex);
}

// Check if array includes item
export function includes<T>(array: T[], item: T): boolean {
  return array.includes(item);
}

// Array to object
export function toArrayObject<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T> {
  return array.reduce((result, item) => {
    result[keyFn(item)] = item;
    return result;
  }, {} as Record<K, T>);
}

// Object to array
export function fromArrayObject<T>(obj: Record<string, T>): T[] {
  return Object.values(obj);
}

// Zip arrays together
export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
  const length = Math.min(array1.length, array2.length);
  return Array.from({ length }, (_, i) => [array1[i], array2[i]]);
}

// Unzip array of pairs
export function unzip<T, U>(array: [T, U][]): [T[], U[]] {
  return array.reduce(
    ([result1, result2], [item1, item2]) => {
      result1.push(item1);
      result2.push(item2);
      return [result1, result2];
    },
    [[], []] as [T[], U[]]
  );
}

// Create array range
export function range(start: number, end?: number, step: number = 1): number[] {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

// Move item in array
export function move<T>(array: T[], from: number, to: number): T[] {
  const result = [...array];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

// Remove item from array
export function remove<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item);
  if (index > -1) {
    const result = [...array];
    result.splice(index, 1);
    return result;
  }
  return array;
}

// Remove item by index
export function removeAt<T>(array: T[], index: number): T[] {
  if (index >= 0 && index < array.length) {
    const result = [...array];
    result.splice(index, 1);
    return result;
  }
  return array;
}

// Insert item at index
export function insertAt<T>(array: T[], index: number, item: T): T[] {
  const result = [...array];
  result.splice(index, 0, item);
  return result;
}

// Replace item at index
export function replaceAt<T>(array: T[], index: number, item: T): T[] {
  if (index >= 0 && index < array.length) {
    const result = [...array];
    result[index] = item;
    return result;
  }
  return array;
}

// Update item in array
export function update<T>(array: T[], predicate: (item: T) => boolean, updater: (item: T) => T): T[] {
  return array.map((item) => (predicate(item) ? updater(item) : item));
}

// Toggle item in array
export function toggle<T>(array: T[], item: T): T[] {
  return array.includes(item) ? remove(array, item) : [...array, item];
}

// Merge arrays without duplicates
export function merge<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

// Paginate array
export function paginate<T>(array: T[], page: number, pageSize: number): {
  data: T[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalPages = Math.ceil(array.length / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const data = array.slice(start, end);

  return {
    data,
    totalPages,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// Binary search (requires sorted array)
export function binarySearch<T>(array: T[], value: T, compareFn?: (a: T, b: T) => number): number {
  let low = 0;
  let high = array.length - 1;

  const compare = compareFn || ((a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0));

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const comparison = compare(array[mid], value);

    if (comparison === 0) {
      return mid;
    } else if (comparison < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}

// Rotate array
export function rotate<T>(array: T[], times: number): T[] {
  const offset = ((times % array.length) + array.length) % array.length;
  return [...array.slice(offset), ...array.slice(0, offset)];
}

// Split array at index
export function splitAt<T>(array: T[], index: number): [T[], T[]] {
  return [array.slice(0, index), array.slice(index)];
}

// Batches array for async processing
export async function batch<T, R>(
  array: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const batches = chunk(array, batchSize);
  const results = await Promise.all(batches.map(processor));
  return results.flat();
}

// Find min and max
export function minMax<T>(array: T[], valueFn?: (item: T) => number): { min: T; max: T } | undefined {
  if (array.length === 0) return undefined;

  const getValue = valueFn || ((item: T) => item as unknown as number);

  let min = array[0];
  let max = array[0];

  for (const item of array) {
    const value = getValue(item);
    const minValue = getValue(min);
    const maxValue = getValue(max);

    if (value < minValue) min = item;
    if (value > maxValue) max = item;
  }

  return { min, max };
}
