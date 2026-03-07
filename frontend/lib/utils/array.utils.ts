/**
 * 数组工具函数库
 */

/**
 * 数组去重
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * 根据键值去重对象数组
 */
export function uniqueBy<T extends Record<string, any>>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const k = item[key];
    if (seen.has(k)) {
      return false;
    }
    seen.add(k);
    return true;
  });
}

/**
 * 数组分组
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * 数组分块
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 数组洗牌（Fisher-Yates 算法）
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 数组求和
 */
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

/**
 * 数组求平均值
 */
export function average(array: number[]): number {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
}

/**
 * 数组求最大值
 */
export function max(array: number[]): number | undefined {
  return array.length === 0 ? undefined : Math.max(...array);
}

/**
 * 数组求最小值
 */
export function min(array: number[]): number | undefined {
  return array.length === 0 ? undefined : Math.min(...array);
}

/**
 * 数组排序（升序）
 */
export function sortBy<T>(array: T[], key: keyof T): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
}

/**
 * 数组排序（降序）
 */
export function sortByDesc<T>(array: T[], key: keyof T): T[] {
  return sortBy(array, key).reverse();
}

/**
 * 数组过滤
 */
export function filterBy<T>(array: T[], key: keyof T, value: any): T[] {
  return array.filter(item => item[key] === value);
}

/**
 * 数组查找
 */
export function findBy<T>(array: T[], key: keyof T, value: any): T | undefined {
  return array.find(item => item[key] === value);
}

/**
 * 数组扁平化
 */
export function flatten<T>(array: T[][]): T[] {
  return array.flat();
}

/**
 * 深度扁平化
 */
export function flattenDeep<T>(array: any[]): T[] {
  return array.flat(Infinity);
}

/**
 * 数组差集（a - b）
 */
export function difference<T>(a: T[], b: T[]): T[] {
  return a.filter(x => !b.includes(x));
}

/**
 * 数组交集
 */
export function intersection<T>(a: T[], b: T[]): T[] {
  return a.filter(x => b.includes(x));
}

/**
 * 数组并集
 */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

/**
 * 数组分页
 */
export function paginate<T>(array: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return array.slice(start, end);
}

/**
 * 数组随机取值
 */
export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 数组随机取多个
 */
export function sampleSize<T>(array: T[], n: number): T[] {
  if (array.length === 0) return [];
  if (n >= array.length) return [...array];
  return shuffle(array).slice(0, n);
}

/**
 * 数组移动元素
 */
export function move<T>(array: T[], from: number, to: number): T[] {
  const result = [...array];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

/**
 * 数组删除元素
 */
export function remove<T>(array: T[], index: number): T[] {
  const result = [...array];
  result.splice(index, 1);
  return result;
}

/**
 * 数组插入元素
 */
export function insert<T>(array: T[], index: number, item: T): T[] {
  const result = [...array];
  result.splice(index, 0, item);
  return result;
}

/**
 * 数组替换元素
 */
export function replace<T>(array: T[], index: number, item: T): T[] {
  const result = [...array];
  result[index] = item;
  return result;
}

/**
 * 数组范围生成
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * 数组压缩（移除 falsy 值）
 */
export function compact<T>(array: (T | null | undefined | false | '' | 0)[]): T[] {
  return array.filter(Boolean) as T[];
}
