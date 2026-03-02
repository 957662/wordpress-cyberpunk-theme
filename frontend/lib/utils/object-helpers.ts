/**
 * Object Helper Functions
 *
 * Utility functions for object manipulation and operations.
 */

/**
 * Check if value is a plain object
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  if (obj instanceof Object) {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
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

/**
 * Pick keys from object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit keys from object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * Get nested object value by path
 */
export function get(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

/**
 * Set nested object value by path
 */
export function set(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Get all object keys (including nested)
 */
export function getDeepKeys(obj: Record<string, any>, prefix: string = ''): string[] {
  const keys: string[] = [];

  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;
    keys.push(path);

    if (isObject(obj[key])) {
      keys.push(...getDeepKeys(obj[key], path));
    }
  }

  return keys;
}

/**
 * Transform object keys
 */
export function mapKeys<T extends Record<string, any>>(
  obj: T,
  mapper: (key: keyof T) => string
): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    acc[mapper(key as keyof T)] = obj[key];
    return acc;
  }, {} as Record<string, any>);
}

/**
 * Transform object values
 */
export function mapValues<T extends Record<string, any>, V>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T) => V
): Record<keyof T, V> {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key as keyof T] = mapper(obj[key as keyof T], key as keyof T);
    return acc;
  }, {} as Record<keyof T, V>);
}

/**
 * Filter object by predicate
 */
export function filterObject<T extends Record<string, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  return Object.keys(obj).reduce((acc, key) => {
    if (predicate(obj[key as keyof T], key as keyof T)) {
      acc[key as keyof T] = obj[key as keyof T];
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Invert object (swap keys and values)
 */
export function invert<T extends Record<string, any>>(obj: T): Record<any, keyof T> {
  return Object.keys(obj).reduce((acc, key) => {
    acc[obj[key]] = key;
    return acc;
  }, {} as Record<any, keyof T>);
}

/**
 * Convert object to query string
 */
export function toQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return params.toString();
}

/**
 * Convert query string to object
 */
export function fromQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, string> = {};

  params.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}

/**
 * Get object length
 */
export function size(obj: Record<string, any>): number {
  return Object.keys(obj).length;
}

/**
 * Check if object has key
 */
export function hasKey(obj: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Rename object key
 */
export function renameKey<T extends Record<string, any>>(
  obj: T,
  oldKey: keyof T,
  newKey: string
): Record<string, any> {
  const result = { ...obj };
  if (oldKey in result) {
    result[newKey] = result[oldKey];
    delete result[oldKey];
  }
  return result;
}

/**
 * Flatten nested object
 */
export function flattenObject(
  obj: Record<string, any>,
  prefix: string = '',
  separator: string = '.'
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;

    if (isObject(obj[key]) && !isEmpty(obj[key])) {
      Object.assign(result, flattenObject(obj[key], newKey, separator));
    } else {
      result[newKey] = obj[key];
    }
  }

  return result;
}

/**
 * Unflatten object
 */
export function unflattenObject(
  obj: Record<string, any>,
  separator: string = '.'
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const keys = key.split(separator);
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current) || !isObject(current[keys[i]])) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = obj[key];
  }

  return result;
}

/**
 * Compare two objects
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  if (a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isEqual(a[key], b[key])) return false;
  }

  return true;
}

/**
 * Freeze object recursively
 */
export function deepFreeze<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj;

  Object.freeze(obj);

  for (const key in obj) {
    if (isObject(obj[key]) || Array.isArray(obj[key])) {
      deepFreeze(obj[key]);
    }
  }

  return obj;
}
