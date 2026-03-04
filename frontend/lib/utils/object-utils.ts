/**
 * Object utilities for CyberPress Platform
 * Enhanced object manipulation and transformation utilities
 */

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
export function deepMerge<T extends Record<string, any>>(...objects: T[]): T {
  const result = {} as T;

  for (const obj of objects) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          typeof obj[key] === 'object' &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          result[key] = deepMerge(result[key] || {}, obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }
  }

  return result;
}

/**
 * Pick properties from object
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
 * Omit properties from object
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
 * Get nested property value
 */
export function get<T = any>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue as T;
    }
    result = result[key];
  }

  return result !== undefined ? result : (defaultValue as T);
}

/**
 * Set nested property value
 */
export function set(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Check if value is plain object
 */
export function isPlainObject(value: any): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

/**
 * Get all keys of object (including nested)
 */
export function getAllKeys(obj: Record<string, any>, prefix: string = ''): string[] {
  let keys: string[] = [];

  for (const key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    keys.push(fullPath);

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullPath));
    }
  }

  return keys;
}

/**
 * Convert object to query string
 */
export function toQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    }
  }

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
 * Rename object keys
 */
export function renameKeys<T extends Record<string, any>>(
  obj: T,
  keyMap: Partial<Record<keyof T, string>>
): Record<string, any> {
  const result = {} as Record<string, any>;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = keyMap[key] || key;
      result[newKey] = obj[key];
    }
  }

  return result;
}

/**
 * Map object values
 */
export function mapValues<T extends Record<string, any>, R>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = mapper(obj[key], key);
    }
  }

  return result;
}

/**
 * Map object keys
 */
export function mapKeys<T extends Record<string, any>>(
  obj: T,
  mapper: (key: keyof T) => string
): Record<string, T[keyof T]> {
  const result = {} as Record<string, T[keyof T]>;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = mapper(key);
      result[newKey] = obj[key];
    }
  }

  return result;
}

/**
 * Filter object by condition
 */
export function filterObject<T extends Record<string, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result = {} as Partial<T>;

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Invert object (swap keys and values)
 */
export function invert<T extends Record<string, any>>(obj: T): Record<string, keyof T> {
  const result = {} as Record<string, keyof T>;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[String(obj[key])] = key;
    }
  }

  return result;
}

/**
 * Check if objects are shallow equal
 */
export function isShallowEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => obj1[key] === obj2[key]);
}

/**
 * Check if objects are deep equal
 */
export function isDeepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) return false;

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => isDeepEqual(obj1[key], obj2[key]));
}

/**
 * Freeze object recursively
 */
export function deepFreeze<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj;

  Object.freeze(obj);

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  }

  return obj;
}

/**
 * Seal object recursively
 */
export function deepSeal<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj;

  Object.seal(obj);

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && typeof obj[key] === 'object' && obj[key] !== null) {
      deepSeal(obj[key]);
    }
  }

  return obj;
}

/**
 * Get object size (number of own properties)
 */
export function size(obj: Record<string, any>): number {
  return Object.keys(obj).length;
}

/**
 * Check if object has property
 */
export function has(obj: Record<string, any>, path: string): boolean {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current == null || !(key in current)) {
      return false;
    }
    current = current[key];
  }

  return true;
}

/**
 * Delete nested property
 */
export function unset(obj: Record<string, any>, path: string): boolean {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
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
 * Flatten nested object
 */
export function flattenObject(
  obj: Record<string, any>,
  prefix: string = '',
  separator: string = '.'
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}${separator}${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], newKey, separator));
      } else {
        result[newKey] = obj[key];
      }
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
    if (obj.hasOwnProperty(key)) {
      const keys = key.split(separator);
      let current = result;

      for (let i = 0; i < keys.length - 1; i++) {
        const nestedKey = keys[i];
        if (!(nestedKey in current) || typeof current[nestedKey] !== 'object') {
          current[nestedKey] = {};
        }
        current = current[nestedKey];
      }

      current[keys[keys.length - 1]] = obj[key];
    }
  }

  return result;
}

/**
 * Convert object to array of key-value pairs
 */
export function toPairs<T extends Record<string, any>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Convert array of key-value pairs to object
 */
export function fromPairs<T extends Record<string, any>>(
  pairs: Array<[keyof T, T[keyof T]]>
): T {
  return Object.fromEntries(pairs) as T;
}

/**
 * Get object values
 */
export function values<T extends Record<string, any>>(obj: T): T[keyof T][] {
  return Object.values(obj);
}

/**
 * Get object keys
 */
export function keys<T extends Record<string, any>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Get object entries
 */
export function entries<T extends Record<string, any>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Create object from array with key function
 */
export function keyBy<T extends Record<string, any>, K extends keyof T>(
  arr: T[],
  key: K
): Record<string, T> {
  return arr.reduce((result, item) => {
    result[String(item[key])] = item;
    return result;
  }, {} as Record<string, T>);
}

/**
 * Group array items into object
 */
export function groupByObject<T extends Record<string, any>, K extends keyof T>(
  arr: T[],
  key: K
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
