/**
 * Array Utilities
 * 数组处理工具函数
 */

/**
 * 数组去重
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 根据键值去重对象数组
 */
export function uniqueBy<T extends Record<string, any>>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter((item) => {
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
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * 打乱数组
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
 * 数组求和
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}

/**
 * 数组求平均值
 */
export function average(arr: number[]): number {
  return arr.length > 0 ? sum(arr) / arr.length : 0;
}

/**
 * 数组求最大值
 */
export function max(arr: number[]): number {
  return Math.max(...arr);
}

/**
 * 数组求最小值
 */
export function min(arr: number[]): number {
  return Math.min(...arr);
}

/**
 * 数组排序
 */
export function sort<T>(arr: T[], compareFn?: (a: T, b: T) => number): T[] {
  return [...arr].sort(compareFn);
}

/**
 * 数组升序排序
 */
export function sortBy<T>(arr: T[], key: keyof T): T[] {
  return [...arr].sort((a, b) => (a[key] > b[key] ? 1 : -1));
}

/**
 * 数组降序排序
 */
export function sortByDesc<T>(arr: T[], key: keyof T): T[] {
  return [...arr].sort((a, b) => (a[key] < b[key] ? 1 : -1));
}

/**
 * 数组过滤
 */
export function filter<T>(arr: T[], predicate: (item: T, index: number) => boolean): T[] {
  return arr.filter(predicate);
}

/**
 * 数组映射
 */
export function map<T, U>(arr: T[], mapper: (item: T, index: number) => U): U[] {
  return arr.map(mapper);
}

/**
 * 数组扁平化
 */
export function flatten<T>(arr: T[][]): T[] {
  return arr.flat();
}

/**
 * 数组深度扁平化
 */
export function flattenDeep<T>(arr: any[]): T[] {
  return arr.flat(Infinity);
}

/**
 * 数组分隔
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return [arr.filter(predicate), arr.filter((item) => !predicate(item))];
}

/**
 * 数组分组
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key]);
    if (!acc[k]) {
      acc[k] = [];
    }
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * 数组合并
 */
export function merge<T>(...arrays: T[][]): T[] {
  return arrays.flat();
}

/**
 * 数组交集
 */
export function intersection<T>(...arrays: T[][]): T[] {
  return arrays.reduce((acc, arr) => acc.filter((item) => arr.includes(item)));
}

/**
 * 数组差集
 */
export function difference<T>(arr: T[], ...arrays: T[][]): T[] {
  const exclude = new Set(arrays.flat());
  return arr.filter((item) => !exclude.has(item));
}

/**
 * 数组并集
 */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

/**
 * 数组第一个元素
 */
export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

/**
 * 数组最后一个元素
 */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

/**
 * 数组第 n 个元素
 */
export function nth<T>(arr: T[], n: number): T | undefined {
  if (n < 0) {
    return arr[arr.length + n];
  }
  return arr[n];
}

/**
 * 数组切片
 */
export function slice<T>(arr: T[], start?: number, end?: number): T[] {
  return arr.slice(start, end);
}

/**
 * 数组删除元素
 */
export function remove<T>(arr: T[], item: T): T[] {
  return arr.filter((i) => i !== item);
}

/**
 * 数组删除指定索引元素
 */
export function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

/**
 * 数组插入元素
 */
export function insert<T>(arr: T[], index: number, item: T): T[] {
  return [...arr.slice(0, index), item, ...arr.slice(index)];
}

/**
 * 数组替换元素
 */
export function replace<T>(arr: T[], index: number, item: T): T[] {
  return [...arr.slice(0, index), item, ...arr.slice(index + 1)];
}

/**
 * 数组移动元素
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  const item = arr[from];
  const newArr = [...arr];
  newArr.splice(from, 1);
  newArr.splice(to, 0, item);
  return newArr;
}

/**
 * 数组交换元素
 */
export function swap<T>(arr: T[], i: number, j: number): T[] {
  const newArr = [...arr];
  [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  return newArr;
}

/**
 * 数组反转
 */
export function reverse<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

/**
 * 数组是否为空
 */
export function isEmpty<T>(arr: T[]): boolean {
  return arr.length === 0;
}

/**
 * 数组计数
 */
export function count<T>(arr: T[], predicate: (item: T) => boolean): number {
  return arr.filter(predicate).length;
}

/**
 * 数组查找
 */
export function find<T>(arr: T[], predicate: (item: T, index: number) => boolean): T | undefined {
  return arr.find(predicate);
}

/**
 * 数组查找索引
 */
export function findIndex<T>(arr: T[], predicate: (item: T, index: number) => boolean): number {
  return arr.findIndex(predicate);
}

/**
 * 数组查找所有匹配项
 */
export function findAll<T>(arr: T[], predicate: (item: T, index: number) => boolean): T[] {
  return arr.filter(predicate);
}

/**
 * 数组包含
 */
export function includes<T>(arr: T[], item: T): boolean {
  return arr.includes(item);
}

/**
 * 数组范围
 */
export function range(start: number, end?: number, step: number = 1): number[] {
  const result: number[] = [];
  if (end === undefined) {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * 数组填充
 */
export function fill<T>(arr: T[], value: T, start?: number, end?: number): T[] {
  return [...arr].fill(value, start, end);
}

/**
 * 数组reduce（从左到右）
 */
export function reduce<T, U>(arr: T[], reducer: (acc: U, item: T, index: number) => U, initial: U): U {
  return arr.reduce(reducer, initial);
}

/**
 * 数组reduceRight（从右到左）
 */
export function reduceRight<T, U>(arr: T[], reducer: (acc: U, item: T, index: number) => U, initial: U): U {
  return arr.reduceRight(reducer, initial);
}

/**
 * 数组每个元素都满足条件
 */
export function every<T>(arr: T[], predicate: (item: T) => boolean): boolean {
  return arr.every(predicate);
}

/**
 * 数组至少一个元素满足条件
 */
export function some<T>(arr: T[], predicate: (item: T) => boolean): boolean {
  return arr.some(predicate);
}

/**
 * 数组连接
 */
export function concat<T>(...arrays: T[][]): T[] {
  return arrays.flat();
}

/**
 * 数组切片创建
 */
export function of<T>(...items: T[]): T[] {
  return items;
}

/**
 * 数组转对象
 */
export function toObject<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T> {
  return arr.reduce((acc, item) => {
    acc[String(item[key])] = item;
    return acc;
  }, {} as Record<string, T>);
}

/**
 * 对象转数组
 */
export function fromObject<T>(obj: Record<string, T>): T[] {
  return Object.values(obj);
}

/**
 * 数组分页
 */
export function paginate<T>(arr: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return arr.slice(start, start + pageSize);
}

/**
 * 数组随机取 n 个元素
 */
export function sample<T>(arr: T[], n: number): T[] {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, n);
}

/**
 * 数组随机取一个元素
 */
export function sampleOne<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 数组压缩（移除假值）
 */
export function compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[] {
  return arr.filter(Boolean) as T[];
}

/**
 * 数组拉链（合并多个数组的对应元素）
 */
export function zip<T extends any[]>(...arrays: T[][]): T[][] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  return Array.from({ length: maxLength }, (_, i) =>
    arrays.map((arr) => arr[i])
  );
}

/**
 * 数组对象拉链
 */
export function zipObject<K extends string | number, V>(keys: K[], values: V[]): Record<string, V> {
  return keys.reduce((acc, key, i) => {
    acc[String(key)] = values[i];
    return acc;
  }, {} as Record<string, V>);
}

/**
 * 数组配对
 */
export function pairs<T>(arr: T[]): [T, T][] {
  const result: [T, T][] = [];
  for (let i = 0; i < arr.length - 1; i += 2) {
    result.push([arr[i], arr[i + 1]]);
  }
  return result;
}

/**
 * 数组查找重复项
 */
export function findDuplicates<T>(arr: T[]): T[] {
  return arr.filter((item, index) => arr.indexOf(item) !== index);
}

/**
 * 数组是否已排序
 */
export function isSorted<T>(arr: T[], compareFn?: (a: T, b: T) => number): boolean {
  const sorted = [...arr].sort(compareFn);
  return JSON.stringify(arr) === JSON.stringify(sorted);
}

/**
 * 数组差异对比
 */
export function diff<T>(arr1: T[], arr2: T[]): {
  added: T[];
  removed: T[];
  unchanged: T[];
} {
  const added = arr2.filter((item) => !arr1.includes(item));
  const removed = arr1.filter((item) => !arr2.includes(item));
  const unchanged = arr1.filter((item) => arr2.includes(item));

  return { added, removed, unchanged };
}

/**
 * 数组合并去重
 */
export function mergeUnique<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}
