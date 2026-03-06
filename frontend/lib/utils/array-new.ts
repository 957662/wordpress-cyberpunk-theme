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
 * 根据属性去重
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * 数组分组
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const value = String(item[key]);
    if (!result[value]) {
      result[value] = [];
    }
    result[value].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * 数组分块
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
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
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
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
 * 数组最大值
 */
export function max(array: number[]): number {
  return Math.max(...array);
}

/**
 * 数组最小值
 */
export function min(array: number[]): number {
  return Math.min(...array);
}

/**
 * 数组扁平化
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce((flat: T[], item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/**
 * 数组差集
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => !array2.includes(item));
}

/**
 * 数组交集
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => array2.includes(item));
}

/**
 * 数组并集
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2]);
}

/**
 * 删除数组元素
 */
export function remove<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

/**
 * 数组随机取一个
 */
export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 数组随机取多个
 */
export function sampleSize<T>(array: T[], n: number): T[] {
  return shuffle(array).slice(0, n);
}

/**
 * 数组分组成对象
 */
export function keyBy<T>(array: T[], key: keyof T): Record<string, T> {
  return array.reduce((result, item) => {
    result[String(item[key])] = item;
    return result;
  }, {} as Record<string, T>);
}

/**
 * 数组计数
 */
export function countBy<T>(array: T[], key: keyof T): Record<string, number> {
  return array.reduce((result, item) => {
    const value = String(item[key]);
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {} as Record<string, number>);
}

/**
 * 数组切片
 */
export function slice<T>(array: T[], start: number, end?: number): T[] {
  return array.slice(start, end);
}

/**
 * 数组查找元素
 */
export function find<T>(array: T[], predicate: (item: T, index: number) => boolean): T | undefined {
  return array.find(predicate);
}

/**
 * 数组过滤
 */
export function filter<T>(array: T[], predicate: (item: T, index: number) => boolean): T[] {
  return array.filter(predicate);
}

/**
 * 数组映射
 */
export function map<T, U>(array: T[], mapper: (item: T, index: number) => U): U[] {
  return array.map(mapper);
}

/**
 * 数组归约
 */
export function reduce<T, U>(
  array: T[],
  reducer: (accumulator: U, item: T, index: number) => U,
  initialValue: U
): U {
  return array.reduce(reducer, initialValue);
}
