/**
 * 数组工具函数
 */

/**
 * 数组去重
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * 根据指定键去重对象数组
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set<any>();
  return array.filter((item) => {
    const k = item[key];
    if (seen.has(k)) {
      return false;
    }
    seen.add(k);
    return true;
  });
}

/**
 * 数分组
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
 * 数组打乱
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
 * 数组排序
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const comparison = aVal > bVal ? 1 : -1;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * 数组求和
 */
export function sum(array: number[]): number {
  return array.reduce((total, num) => total + num, 0);
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
export function max(array: number[]): number {
  return Math.max(...array);
}

/**
 * 数组求最小值
 */
export function min(array: number[]): number {
  return Math.min(...array);
}

/**
 * 数组差异 (a - b)
 */
export function difference<T>(a: T[], b: T[]): T[] {
  return a.filter((x) => !b.includes(x));
}

/**
 * 数组交集
 */
export function intersection<T>(a: T[], b: T[]): T[] {
  return a.filter((x) => b.includes(x));
}

/**
 * 数组并集
 */
export function union<T>(a: T[], b: T[]): T[] {
  return unique([...a, ...b]);
}

/**
 * 数组分隔
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return array.reduce(
    ([pass, fail], item) => {
      return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []] as [T[], T[]]
  );
}

/**
 * 数组展平
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/**
 * 数组映射并展平
 */
export function flatMap<T, U>(array: T[], mapper: (item: T) => U[]): U[] {
  return flatten(array.map(mapper));
}
