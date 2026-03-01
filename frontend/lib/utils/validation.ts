/**
 * Validation Utilities
 * 验证工具函数
 */

/**
 * 验证邮箱地址
 * @param email - 邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证 URL
 * @param url - URL 字符串
 * @returns 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证手机号（中国大陆）
 * @param phone - 手机号
 * @returns 是否有效
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证身份证号（中国大陆）
 * @param idCard - 身份证号
 * @returns 是否有效
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
}

/**
 * 验证密码强度
 * @param password - 密码
 * @returns 强度等级 (0-4)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * 验证用户名
 * @param username - 用户名
 * @returns 是否有效
 */
export function isValidUsername(username: string): boolean {
  // 用户名规则：4-20个字符，只允许字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证 Slug（URL 友好字符串）
 * @param slug - Slug 字符串
 * @returns 是否有效
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * 验证十六进制颜色
 * @param color - 颜色值
 * @returns 是否有效
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * 验证 IP 地址
 * @param ip - IP 地址
 * @returns 是否有效
 */
export function isValidIP(ip: string): boolean {
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * 验证是否为数字
 * @param value - 值
 * @returns 是否为数字
 */
export function isNumber(value: any): boolean {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * 验证是否为整数
 * @param value - 值
 * @returns 是否为整数
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(Number(value));
}

/**
 * 验证范围
 * @param value - 值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 是否在范围内
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证字符串长度
 * @param str - 字符串
 * @param minLength - 最小长度
 * @param maxLength - 最大长度
 * @returns 是否在范围内
 */
export function isValidLength(str: string, minLength: number, maxLength: number): boolean {
  return str.length >= minLength && str.length <= maxLength;
}

/**
 * 验证是否为空
 * @param value - 值
 * @returns 是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证是否包含（不区分大小写）
 * @param str - 字符串
 * @param search - 搜索内容
 * @returns 是否包含
 */
export function containsIgnoreCase(str: string, search: string): boolean {
  return str.toLowerCase().includes(search.toLowerCase());
}

/**
 * 验证是否以指定字符串开头
 * @param str - 字符串
 * @param prefix - 前缀
 * @returns 是否以指定字符串开头
 */
export function startsWith(str: string, prefix: string): boolean {
  return str.startsWith(prefix);
}

/**
 * 验证是否以指定字符串结尾
 * @param str - 字符串
 * @param suffix - 后缀
 * @returns 是否以指定字符串结尾
 */
export function endsWith(str: string, suffix: string): boolean {
  return str.endsWith(suffix);
}

/**
 * 验证文件类型
 * @param filename - 文件名
 * @param allowedTypes - 允许的类型列表
 * @returns 是否为允许的类型
 */
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
}

/**
 * 验证文件大小
 * @param size - 文件大小（字节）
 * @param maxSize - 最大大小（字节）
 * @returns 是否在限制内
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @returns 格式化后的字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 验证 JSON 字符串
 * @param str - JSON 字符串
 * @returns 是否为有效的 JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证日期格式
 * @param dateStr - 日期字符串
 * @param format - 日期格式
 * @returns 是否有效
 */
export function isValidDateFormat(dateStr: string, format: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' = 'YYYY-MM-DD'): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * 验证是否为未来日期
 * @param date - 日期
 * @returns 是否为未来日期
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * 验证是否为过去日期
 * @param date - 日期
 * @returns 是否为过去日期
 */
export function isPastDate(date: Date): boolean {
  return date < new Date();
}

/**
 * 验证年龄
 * @param birthDate - 出生日期
 * @param minAge - 最小年龄
 * @param maxAge - 最大年龄
 * @returns 是否符合年龄要求
 */
export function isValidAge(birthDate: Date, minAge: number = 0, maxAge: number = 150): boolean {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge;
  }

  return age >= minAge && age <= maxAge;
}
