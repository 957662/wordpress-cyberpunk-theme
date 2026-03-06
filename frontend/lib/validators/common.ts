/**
 * 通用验证器
 */

/**
 * 验证邮箱
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证 URL
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
 * 验证手机号（中国）
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证用户名
 */
export function isValidUsername(username: string): boolean {
  // 用户名: 3-20 个字符，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证密码强度
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';
  return 'strong';
}

/**
 * 验证密码
 */
export function isValidPassword(password: string): boolean {
  // 至少 6 个字符
  return password.length >= 6;
}

/**
 * 验证强密码
 */
export function isStrongPassword(password: string): boolean {
  // 至少 8 个字符，包含大小写字母和数字
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

/**
 * 验证身份证号（中国）
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
}

/**
 * 验证邮政编码（中国）
 */
export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[1-9]\d{5}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * 验证 IP 地址
 */
export function isValidIpAddress(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * 验证 MAC 地址
 */
export function isValidMacAddress(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

/**
 * 验证十六进制颜色
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(color);
}

/**
 * 验证日期
 */
export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * 验证年龄
 */
export function isValidAge(age: number): boolean {
  return age >= 0 && age <= 150;
}

/**
 * 验证数字范围
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证字符串长度
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * 验证是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证是否为数字
 */
export function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 验证是否为整数
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(value);
}

/**
 * 验证是否为正数
 */
export function isPositive(value: any): boolean {
  return isNumber(value) && value > 0;
}

/**
 * 验证是否为负数
 */
export function isNegative(value: any): boolean {
  return isNumber(value) && value < 0;
}

/**
 * 验证是否为数组
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * 验证是否为对象
 */
export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 验证是否为函数
 */
export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

/**
 * 验证是否为布尔值
 */
export function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

/**
 * 验证是否为字符串
 */
export function isString(value: any): boolean {
  return typeof value === 'string';
}

/**
 * 验证是否为日期对象
 */
export function isDate(value: any): boolean {
  return value instanceof Date;
}

/**
 * 验证是否为 Promise
 */
export function isPromise(value: any): boolean {
  return value instanceof Promise;
}

/**
 * 验证对象键
 */
export function hasKey(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 验证必填字段
 */
export function isRequired(value: any): boolean {
  return !isEmpty(value);
}

export default {
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  isValidUsername,
  getPasswordStrength,
  isValidPassword,
  isStrongPassword,
  isValidIdCard,
  isValidPostalCode,
  isValidIpAddress,
  isValidMacAddress,
  isValidHexColor,
  isValidDate,
  isValidAge,
  isInRange,
  isValidLength,
  isEmpty,
  isNumber,
  isInteger,
  isPositive,
  isNegative,
  isArray,
  isObject,
  isFunction,
  isBoolean,
  isString,
  isDate,
  isPromise,
  hasKey,
  isRequired,
};
