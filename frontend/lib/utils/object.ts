/**
 * 对象工具函数
 */

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as any;

  const clonedObj = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 获取对象嵌套属性
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue as T;
    }
    result = result[key];
  }

  return result !== undefined ? result : (defaultValue as T);
}

/**
 * 设置对象嵌套属性
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

/**
 * 删除对象嵌套属性
 */
export function unset(obj: any, path: string): boolean {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (!(key in current)) {
      return false;
    }
    current = current[key];
  }

  if (lastKey in current) {
    delete current[lastKey];
    return true;
  }

  return false;
}

/**
 * 获取对象所有路径
 */
export function paths(obj: any, prefix: string = ''): string[] {
  const result: string[] = [];

  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isObject(obj[key]) && obj[key] !== null && !Array.isArray(obj[key])) {
      result.push(...paths(obj[key], path));
    } else {
      result.push(path);
    }
  }

  return result;
}

/**
 * 对象键值对转换
 */
export function invert(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    result[obj[key]] = key;
  }
  return result;
}

/**
 * 对象键名转换
 */
export function mapKeys<T extends Record<string, any>>(
  obj: T,
  mapper: (key: string) => string
): Record<string, any> {
  return Object.keys(obj).reduce((result, key) => {
    result[mapper(key)] = obj[key];
    return result;
  }, {} as Record<string, any>);
}

/**
 * 对象值转换
 */
export function mapValues<T extends Record<string, any>>(
  obj: T,
  mapper: (value: any, key: string) => any
): Record<string, any> {
  return Object.keys(obj).reduce((result, key) => {
    result[key] = mapper(obj[key], key);
    return result;
  }, {} as Record<string, any>);
}

/**
 * 对象过滤
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * 对象排除
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
}

/**
 * 检查对象是否为空
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
}

/**
 * 检查对象是否相等
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }

  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }

  if (a.prototype !== b.prototype) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => isEqual(a[key], b[key]));
}
