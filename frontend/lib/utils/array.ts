/**
 * Array Utilities
 * 数组工具函数
 */

/**
 * 数组去重
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 根据键去重对象数组
 */
export function uniqueBy<T extends Record<string, any>>(arr: T[], key: string): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * 数组分组
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
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
 * 数组分块
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * 数组乱序
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
 * 数组采样（随机获取 n 个元素）
 */
export function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/**
 * 数组求和
 */
export function arraySum(arr: number[]): number {
  return arr.reduce((sum, num) => sum + num, 0);
}

/**
 * 数组平均值
 */
export function arrayAvg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arraySum(arr) / arr.length;
}

/**
 * 数组最大值
 */
export function arrayMax(arr: number[]): number {
  return Math.max(...arr);
}

/**
 * 数组最小值
 */
export function arrayMin(arr: number[]): number {
  return Math.min(...arr);
}

/**
 * 数组差集（arr1 中有但 arr2 中没有的）
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => !arr2.includes(item));
}

/**
 * 数组交集
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => arr2.includes(item));
}

/**
 * 数组并集
 */
export function union<T>(...arrs: T[][]): T[] {
  return unique(arrs.flat());
}

/**
 * 数组排序（按键）
 */
export function sortBy<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * 数组翻转
 */
export function reverse<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

/**
 * 数组扁平化
 */
export function flatten<T>(arr: any[]): T[] {
  return arr.reduce<T[]>((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}

/**
 * 数组深度扁平化
 */
export function deepFlatten<T>(arr: any[]): T[] {
  return flatten(arr);
}

/**
 * 压缩数组（移除假值）
 */
export function compact<T>(arr: (T | null | undefined | false | '' | 0)[]): T[] {
  return arr.filter(Boolean) as T[];
}

/**
 * 数组分割（根据条件）
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
 * 数组分组（根据条件）
 */
export function arrayGroup<T>(arr: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    groups.push(arr.slice(i, i + size));
  }
  return groups;
}

/**
 * 查找数组索引
 */
export function findIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  return arr.findIndex(predicate);
}

/**
 * 查找并移除
 */
export function pull<T>(arr: T[], ...items: T[]): T[] {
  return arr.filter((item) => !items.includes(item));
}

/**
 * 填充数组
 */
export function fill<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

/**
 * 范围数组
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * 数组移动（将元素从 from 移到 to）
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

/**
 * 数组交换
 */
export function swap<T>(arr: T[], i: number, j: number): T[] {
  const result = [...arr];
  [result[i], result[j]] = [result[j], result[i]];
  return result;
}

/**
 * 判断数组是否相等
 */
export function arrayEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * 获取数组最后一个元素
 */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

/**
 * 获取数组第一个元素
 */
export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
