/**
 * ID Generator Utility
 * 唯一标识符生成工具
 * CyberPress Platform
 */

/**
 * 生成UUID v4
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 生成短ID
 */
export function generateShortId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成_nanoid (简化版)
 */
export function generateNanoId(size: number = 21): string {
  const chars = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZI';
  let id = '';
  let bytes = new Uint8Array(size);

  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < size; i++) {
      bytes[i] = Math.random() * 256;
    }
  }

  for (let i = 0; i < size; i++) {
    id += chars[bytes[i] & 63];
  }

  return id;
}

/**
 * 生成有序ID (时间戳 + 随机数)
 */
export function generateSequentialId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

/**
 * 生成雪花ID (简化版)
 */
export class SnowflakeIdGenerator {
  private epoch: number;
  private workerId: number;
  private datacenterId: number;
  private sequence: number;
  private lastTimestamp: number;

  constructor(workerId: number = 1, datacenterId: number = 1, epoch: number = 1609459200000) {
    this.epoch = epoch;
    this.workerId = workerId;
    this.datacenterId = datacenterId;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  generate(): string {
    let timestamp = Date.now();

    // 时钟回拨处理
    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards');
    }

    // 同一毫秒内
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & 0xfff;
      if (this.sequence === 0) {
        // 等待下一毫秒
        timestamp = this.waitNextMillis(timestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const id =
      ((timestamp - this.epoch) << 22) |
      (this.datacenterId << 17) |
      (this.workerId << 12) |
      this.sequence;

    return id.toString(10);
  }

  private waitNextMillis(timestamp: number): number {
    let temp = Date.now();
    while (temp <= timestamp) {
      temp = Date.now();
    }
    return temp;
  }
}

/**
 * 生成ULID (通用唯一排序标识符)
 */
export function generateULID(): string {
  const time = Date.now();
  const timeStr = time.toString(36).padStart(12, '0');

  let randomStr = '';
  const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

  if (typeof crypto !== 'undefined') {
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 10; i++) {
      randomStr += chars[bytes[i] & 31];
    }
  } else {
    for (let i = 0; i < 10; i++) {
      randomStr += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return timeStr + randomStr;
}

/**
 * 生成CUID (简化的碰撞-resistant ID)
 */
export function generateCUID(): string {
  const timestamp = Date.now().toString(36);
  const counter = Math.floor(Math.random() * 4294967296).toString(36);
  const random = generateShortId(8);

  return `c${timestamp}${counter}${random}`;
}

/**
 * 生成Slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // 替换空格为-
    .replace(/[^\w\-]+/g, '') // 移除非单词字符
    .replace(/\-\-+/g, '-') // 替换多个-为单个-
    .replace(/^-+/, '') // 移除开头的-
    .replace(/-+$/, ''); // 移除结尾的-
}

/**
 * 生成连续的数字ID
 */
export class SequentialNumberGenerator {
  private counter: number;
  private prefix: string;

  constructor(prefix: string = 'ID', startFrom: number = 1) {
    this.prefix = prefix;
    this.counter = startFrom;
  }

  next(): string {
    const id = `${this.prefix}${this.counter.toString().padStart(6, '0')}`;
    this.counter++;
    return id;
  }

  reset(): void {
    this.counter = 1;
  }

  setCurrent(value: number): void {
    this.counter = value;
  }
}

/**
 * 生成哈希ID (简单的字符串哈希)
 */
export function generateHashId(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * 创建默认的雪花ID生成器
 */
export const snowflakeGenerator = new SnowflakeIdGenerator();

/**
 * 创建默认的数字ID生成器
 */
export const numberGenerator = new SequentialNumberGenerator();

/**
 * 快速生成唯一ID (使用ULID)
 */
export function uid(): string {
  return generateULID();
}
