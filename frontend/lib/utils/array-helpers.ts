/**
 * Array Helper Functions
 *
 * Utility functions for array manipulation and operations.
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
export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

/**
 * Group array items by key
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const val = String(item[key]);
    if (!acc[val]) acc[val] = [];
    acc[val].push(item);
    return acc;
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
 * Shuffle array randomly
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pick random items from array
 */
export function sample<T>(arr: T[], count: number): T[] {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Get random item from array
 */
export function sampleOne<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(arr: T[][]): T[] {
  return arr.flat();
}

/**
 * Deep flatten arrays
 */
export function deepFlatten<T>(arr: any[]): T[] {
  return arr.reduce<T[]>((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...deepFlatten(val));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

/**
 * Zip multiple arrays together
 */
export function zip<T>(...arrays: T[][]): T[][] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  return Array.from({ length: maxLength }, (_, i) =>
    arrays.map((arr) => arr[i])
  );
}

/**
 * Find intersection of arrays
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  return arrays[0].filter((item) =>
    arrays.every((arr) => arr.includes(item))
  );
}

/**
 * Find difference of arrays
 */
export function difference<T>(arr: T[], ...arrays: T[][]): T[] {
  const exclude = new Set(arrays.flat());
  return arr.filter((item) => !exclude.has(item));
}

/**
 * Union of arrays
 */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

/**
 * Partition array by predicate
 */
export function partition<T>(
  arr: T[],
  predicate: (item: T, index: number, arr: T[]) => boolean
): [T[], T[]] {
  return arr.reduce(
    (acc, item, index, arr) => {
      if (predicate(item, index, arr)) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }
      return acc;
    },
    [[], []] as [T[], T[]]
  );
}

/**
 * Check if arrays are equal
 */
export function areEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
}

/**
 * Move item in array
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

/**
 * Remove item from array
 */
export function remove<T>(arr: T[], index: number): T[] {
  const result = [...arr];
  result.splice(index, 1);
  return result;
}

/**
 * Insert item into array
 */
export function insert<T>(arr: T[], index: number, item: T): T[] {
  const result = [...arr];
  result.splice(index, 0, item);
  return result;
}

/**
 * Replace item in array
 */
export function replace<T>(arr: T[], index: number, item: T): T[] {
  const result = [...arr];
  result[index] = item;
  return result;
}

/**
 * Update array item that matches predicate
 */
export function update<T>(
  arr: T[],
  predicate: (item: T) => boolean,
  updater: (item: T) => T
): T[] {
  return arr.map((item) => (predicate(item) ? updater(item) : item));
}

/**
 * Toggle item in array (add if not exists, remove if exists)
 */
export function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

/**
 * Sum of numeric array
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}

/**
 * Average of numeric array
 */
export function average(arr: number[]): number {
  return arr.length > 0 ? sum(arr) / arr.length : 0;
}

/**
 * Max of array
 */
export function max<T>(arr: T[]): T | undefined {
  return arr.reduce((max, val) => (val > max ? val : max), arr[0]);
}

/**
 * Min of array
 */
export function min<T>(arr: T[]): T | undefined {
  return arr.reduce((min, val) => (val < min ? val : min), arr[0]);
}

/**
 * Range of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}
