/**
 * CyberPress Platform - Validation Utilities
 * 验证工具函数
 */

/**
 * 验证邮箱地址
 * 
 * @param email - 邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证 URL
 * 
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
 * 验证用户名
 * 
 * @param username - 用户名
 * @returns 是否有效
 */
export function isValidUsername(username: string): boolean {
  // 用户名：3-20个字符，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证密码强度
 * 
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
 * 验证密码强度是否满足要求
 * 
 * @param password - 密码
 * @param minLength - 最小长度（默认8）
 * @returns 是否有效
 */
export function isValidPassword(password: string, minLength: number = 8): boolean {
  if (password.length < minLength) return false;
  
  // 至少包含字母和数字
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasLetter && hasNumber;
}

/**
 * 验证手机号（中国大陆）
 * 
 * @param phone - 手机号
 * @returns 是否有效
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证身份证号（中国大陆）
 * 
 * @param idCard - 身份证号
 * @returns 是否有效
 */
export function isValidIdCard(idCard: string): boolean {
  // 18位身份证号
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!idCardRegex.test(idCard)) return false;
  
  // 验证校验位
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i];
  }
  
  const checkCode = checkCodes[sum % 11];
  return checkCode === idCard[17].toUpperCase();
}

/**
 * 验证 IP 地址
 * 
 * @param ip - IP 地址
 * @returns 是否有效
 */
export function isValidIP(ip: string): boolean {
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * 验证 IPv6 地址
 * 
 * @param ipv6 - IPv6 地址
 * @returns 是否有效
 */
export function isValidIPv6(ipv6: string): boolean {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::)$/i;
  return ipv6Regex.test(ipv6);
}

/**
 * 验证 MAC 地址
 * 
 * @param mac - MAC 地址
 * @returns 是否有效
 */
export function isValidMAC(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

/**
 * 验证十六进制颜色
 * 
 * @param color - 颜色值
 * @returns 是否有效
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * 验证信用卡号
 * 
 * @param cardNumber - 信用卡号
 * @returns 是否有效
 */
export function isValidCreditCard(cardNumber: string): boolean {
  // 移除空格和横线
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // 检查长度和格式
  if (!/^\d{13,19}$/.test(cleaned)) return false;
  
  // Luhn 算法验证
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * 验证邮编（中国）
 * 
 * @param zip - 邮编
 * @returns 是否有效
 */
export function isValidZipCode(zip: string): boolean {
  const zipRegex = /^[1-9]\d{5}$/;
  return zipRegex.test(zip);
}

/**
 * 验证是否为数字
 * 
 * @param value - 值
 * @returns 是否为数字
 */
export function isNumber(value: unknown): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 验证是否为整数
 * 
 * @param value - 值
 * @returns 是否为整数
 */
export function isInteger(value: unknown): boolean {
  return Number.isInteger(value);
}

/**
 * 验证是否为正数
 * 
 * @param value - 值
 * @returns 是否为正数
 */
export function isPositive(value: number): boolean {
  return isNumber(value) && value > 0;
}

/**
 * 验证是否在指定范围内
 * 
 * @param value - 值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 是否在范围内
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证是否为空
 * 
 * @param value - 值
 * @returns 是否为空
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证对象是否包含必需字段
 * 
 * @param obj - 对象
 * @param requiredFields - 必需字段数组
 * @returns 是否包含所有必需字段
 */
export function hasRequiredFields<T extends Record<string, unknown>>(
  obj: T,
  requiredFields: (keyof T)[]
): boolean {
  return requiredFields.every((field) => {
    const value = obj[field];
    return value !== undefined && value !== null && value !== '';
  });
}
