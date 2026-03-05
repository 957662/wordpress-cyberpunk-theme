/**
 * 集合操作工具库
 * CyberPress Platform
 *
 * 提供常用的数组、对象、Map、Set等集合操作工具函数
 */

/**
 * 数组工具
 */
export const ArrayUtils = {
  /**
   * 数组去重
   */
  unique: <T>(arr: T[]): T[] => {
    return Array.from(new Set(arr));
  },

  /**
   * 根据指定字段去重对象数组
   */
  uniqueBy: <T>(arr: T[], key: keyof T): T[] => {
    const seen = new Set();
    return arr.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  /**
   * 数组分组
   */
  groupBy: <T>(arr: T[], key: keyof T): Record<string, T[]> => {
    return arr.reduce((result, item) => {
      const value = String(item[key]);
      if (!result[value]) {
        result[value] = [];
      }
      result[value].push(item);
      return result;
    }, {} as Record<string, T[]>);
  },

  /**
   * 数组分块
   */
  chunk: <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  /**
   * 数组打乱
   */
  shuffle: <T>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  /**
   * 数组排序(支持多字段)
   */
  sortBy: <T>(arr: T[], ...keys: (keyof T)[]): T[] => {
    return [...arr].sort((a, b) => {
      for (const key of keys) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
      }
      return 0;
    });
  },

  /**
   * 数组求和
   */
  sum: (arr: number[]): number => {
    return arr.reduce((sum, num) => sum + num, 0);
  },

  /**
   * 数组求平均值
   */
  average: (arr: number[]): number => {
    if (arr.length === 0) return 0;
    return ArrayUtils.sum(arr) / arr.length;
  },

  /**
   * 数组最大值
   */
  max: (arr: number[]): number => {
    return Math.max(...arr);
  },

  /**
   * 数组最小值
   */
  min: (arr: number[]): number => {
    return Math.min(...arr);
  },

  /**
   * 数差集
   */
  difference: <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter((item) => !arr2.includes(item));
  },

  /**
   * 数组交集
   */
  intersection: <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter((item) => arr2.includes(item));
  },

  /**
   * 数组并集
   */
  union: <T>(arr1: T[], arr2: T[]): T[] => {
    return ArrayUtils.unique([...arr1, ...arr2]);
  },

  /**
   * 数组分页
   */
  paginate: <T>(arr: T[], page: number, pageSize: number): T[] => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return arr.slice(start, end);
  },

  /**
   * 数组扁平化
   */
  flatten: <T>(arr: any[]): T[] => {
    return arr.reduce<T[]>((flat, item) => {
      return flat.concat(Array.isArray(item) ? ArrayUtils.flatten(item) : item);
    }, []);
  },

  /**
   * 数组分组求和
   */
  sumBy: <T>(arr: T[], key: keyof T): number => {
    return arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  },

  /**
   * 数组计数
   */
  countBy: <T>(arr: T[], key: keyof T): Record<string, number> => {
    return arr.reduce((result, item) => {
      const value = String(item[key]);
      result[value] = (result[value] || 0) + 1;
      return result;
    }, {} as Record<string, number>);
  },
};

/**
 * 对象工具
 */
export const ObjectUtils = {
  /**
   * 深拷贝
   */
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) return obj.map((item) => ObjectUtils.deepClone(item)) as any;
    if (typeof obj === 'object') {
      const copy = {} as any;
      Object.keys(obj).forEach((key) => {
        copy[key] = ObjectUtils.deepClone((obj as any)[key]);
      });
      return copy;
    }
    return obj;
  },

  /**
   * 深度合并
   */
  deepMerge: <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
    const result = { ...target };
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof T];
      const targetValue = result[key as keyof T];

      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key as keyof T] = ObjectUtils.deepMerge(
          targetValue,
          sourceValue
        ) as T[keyof T];
      } else {
        result[key as keyof T] = sourceValue as T[keyof T];
      }
    });
    return result;
  },

  /**
   * 对象键值转换
   */
  mapKeys: <T extends Record<string, any>, R extends Record<string, any>>(
    obj: T,
    mapper: (key: string, value: T[keyof T]) => string
  ): R => {
    return Object.keys(obj).reduce((result, key) => {
      const newKey = mapper(key, obj[key as keyof T]);
      result[newKey as keyof R] = obj[key as keyof T] as any;
      return result;
    }, {} as R);
  },

  /**
   * 对象值转换
   */
  mapValues: <T extends Record<string, any>, R>(
    obj: T,
    mapper: (value: T[keyof T], key: string) => R
  ): Record<keyof T, R> => {
    return Object.keys(obj).reduce((result, key) => {
      result[key as keyof T] = mapper(obj[key as keyof T], key);
      return result;
    }, {} as Record<keyof T, R>);
  },

  /**
   * 对象过滤
   */
  filter: <T extends Record<string, any>>(
    obj: T,
    predicate: (value: T[keyof T], key: string) => boolean
  ): Partial<T> => {
    return Object.keys(obj).reduce((result, key) => {
      if (predicate(obj[key as keyof T], key)) {
        result[key as keyof T] = obj[key as keyof T];
      }
      return result;
    }, {} as Partial<T>);
  },

  /**
   * 对象挑选
   */
  pick: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    return keys.reduce((result, key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
      return result;
    }, {} as Pick<T, K>);
  },

  /**
   * 对象排除
   */
  omit: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  },

  /**
   * 获取嵌套值
   */
  get: <T>(obj: any, path: string, defaultValue?: T): T => {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result == null) {
        return defaultValue as T;
      }
      result = result[key];
    }
    return result ?? (defaultValue as T);
  },

  /**
   * 设置嵌套值
   */
  set: <T>(obj: any, path: string, value: T): void => {
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
  },

  /**
   * 判断是否为空对象
   */
  isEmpty: (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
  },

  /**
   * 对象转键值对数组
   */
  toPairs: <T extends Record<string, any>>(
    obj: T
  ): [keyof T, T[keyof T]][] => {
    return Object.keys(obj).map((key) => [key as keyof T, obj[key as keyof T]]);
  },

  /**
   * 键值对数组转对象
   */
  fromPairs: <T extends Record<string, any>>(
    pairs: [keyof T, T[keyof T]][]
  ): T => {
    return pairs.reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as T);
  },
};

/**
 * Map 工具
 */
export const MapUtils = {
  /**
   * Map 转 Object
   */
  toObject: <K extends string | number, V>(map: Map<K, V>): Record<K, V> => {
    return Array.from(map.entries()).reduce(
      (obj, [key, value]) => {
        obj[key] = value;
        return obj;
      },
      {} as Record<K, V>
    );
  },

  /**
   * Object 转 Map
   */
  fromObject: <K extends string | number, V>(obj: Record<K, V>): Map<K, V> => {
    return new Map(Object.entries(obj) as [K, V][]);
  },

  /**
   * Map 键数组
   */
  keys: <K, V>(map: Map<K, V>): K[] => {
    return Array.from(map.keys());
  },

  /**
   * Map 值数组
   */
  values: <K, V>(map: Map<K, V>): V[] => {
    return Array.from(map.values());
  },

  /**
   * Map 键值对数组
   */
  entries: <K, V>(map: Map<K, V>): [K, V][] => {
    return Array.from(map.entries());
  },

  /**
   * Map 过滤
   */
  filter: <K, V>(map: Map<K, V>, predicate: (value: V, key: K) => boolean): Map<K, V> => {
    return new Map(Array.from(map.entries()).filter(([key, value]) => predicate(value, key)));
  },

  /**
   * Map 映射
   */
  map: <K, V, R>(map: Map<K, V>, mapper: (value: V, key: K) => R): Map<K, R> => {
    return new Map(Array.from(map.entries()).map(([key, value]) => [key, mapper(value, key)]));
  },
};

/**
 * Set 工具
 */
export const SetUtils = {
  /**
   * Set 转 数组
   */
  toArray: <T>(set: Set<T>): T[] => {
    return Array.from(set);
  },

  /**
   * 数组转 Set
   */
  fromArray: <T>(arr: T[]): Set<T> => {
    return new Set(arr);
  },

  /**
   * Set 并集
   */
  union: <T>(set1: Set<T>, set2: Set<T>): Set<T> => {
    return new Set([...set1, ...set2]);
  },

  /**
   * Set 交集
   */
  intersection: <T>(set1: Set<T>, set2: Set<T>): Set<T> => {
    return new Set([...set1].filter((item) => set2.has(item)));
  },

  /**
   * Set 差集
   */
  difference: <T>(set1: Set<T>, set2: Set<T>): Set<T> => {
    return new Set([...set1].filter((item) => !set2.has(item)));
  },

  /**
   * Set 对称差集
   */
  symmetricDifference: <T>(set1: Set<T>, set2: Set<T>): Set<T> => {
    return new Set([
      ...[...set1].filter((item) => !set2.has(item)),
      ...[...set2].filter((item) => !set1.has(item)),
    ]);
  },
};

/**
 * 树形结构工具
 */
export const TreeUtils = {
  /**
   * 列表转树形结构
   */
  listToTree: <T extends { id: string | number; parentId?: string | number | null }>(
    list: T[],
    options: {
      idKey?: keyof T;
      parentIdKey?: keyof T;
      childrenKey?: string;
    } = {}
  ): T[] => {
    const {
      idKey = 'id' as keyof T,
      parentIdKey = 'parentId' as keyof T,
      childrenKey = 'children',
    } = options;

    const map = new Map();
    const roots: T[] = [];

    // 创建映射
    list.forEach((item) => {
      map.set(item[idKey], { ...item, [childrenKey]: [] });
    });

    // 构建树
    list.forEach((item) => {
      const node = map.get(item[idKey]);
      const parentId = item[parentIdKey];

      if (parentId && map.has(parentId)) {
        const parent = map.get(parentId);
        parent[childrenKey].push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  },

  /**
   * 树形结构转列表
   */
  treeToList: <T extends { children?: T[] }>(
    tree: T[],
    options: {
      childrenKey?: string;
    } = {}
  ): T[] => {
    const { childrenKey = 'children' } = options;
    const result: T[] = [];

    const traverse = (nodes: T[]) => {
      nodes.forEach((node) => {
        const { [childrenKey]: children, ...rest } = node as any;
        result.push(rest);
        if (children && children.length > 0) {
          traverse(children);
        }
      });
    };

    traverse(tree);
    return result;
  },

  /**
   * 查找节点
   */
  findNode: <T extends { children?: T[] }>(
    tree: T[],
    predicate: (node: T) => boolean,
    options: {
      childrenKey?: string;
    } = {}
  ): T | null => {
    const { childrenKey = 'children' } = options;

    for (const node of tree) {
      if (predicate(node)) {
        return node;
      }
      if (node[childrenKey as keyof T] && Array.isArray(node[childrenKey as keyof T])) {
        const found = TreeUtils.findNode(
          node[childrenKey as keyof T] as unknown as T[],
          predicate,
          options
        );
        if (found) return found;
      }
    }

    return null;
  },

  /**
   * 遍历树
   */
  traverse: <T extends { children?: T[] }>(
    tree: T[],
    callback: (node: T, depth: number) => void,
    options: {
      childrenKey?: string;
      depth?: number;
    } = {}
  ): void => {
    const { childrenKey = 'children', depth = 0 } = options;

    tree.forEach((node) => {
      callback(node, depth);
      if (node[childrenKey as keyof T] && Array.isArray(node[childrenKey as keyof T])) {
        TreeUtils.traverse(
          node[childrenKey as keyof T] as unknown as T[],
          callback,
          { ...options, depth: depth + 1 }
        );
      }
    });
  },
};

// 默认导出所有工具
export default {
  Array: ArrayUtils,
  Object: ObjectUtils,
  Map: MapUtils,
  Set: SetUtils,
  Tree: TreeUtils,
};
