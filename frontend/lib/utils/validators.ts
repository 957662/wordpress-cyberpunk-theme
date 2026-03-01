/**
 * 验证工具函数
 */

import { REGEX } from '../constants';

/**
 * 验证邮箱
 */
export function isValidEmail(email: string): boolean {
  return REGEX.email.test(email);
}

/**
 * 验证 URL
 */
export function isValidUrl(url: string): boolean {
  return REGEX.url.test(url);
}

/**
 * 验证 slug
 */
export function isValidSlug(slug: string): boolean {
  return REGEX.slug.test(slug);
}

/**
 * 验证手机号（中国）
 */
export function isValidPhone(phone: string): boolean {
  return REGEX.phone.test(phone);
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
 * 验证字符串长度
 */
export function isValidLength(
  value: string,
  min: number,
  max?: number
): boolean {
  const length = value.trim().length;
  if (max !== undefined) {
    return length >= min && length <= max;
  }
  return length >= min;
}

/**
 * 验证文件大小
 */
export function isValidFileSize(
  file: File,
  maxSizeInBytes: number
): boolean {
  return file.size <= maxSizeInBytes;
}

/**
 * 验证文件类型
 */
export function isValidFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * 验证密码强度
 */
export function getPasswordStrength(password: string): {
  score: number;
  text: string;
  color: string;
} {
  let score = 0;

  // 长度检查
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // 包含小写字母
  if (/[a-z]/.test(password)) score++;

  // 包含大写字母
  if (/[A-Z]/.test(password)) score++;

  // 包含数字
  if (/\d/.test(password)) score++;

  // 包含特殊字符
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score, text: '弱', color: 'text-cyber-pink' };
  } else if (score <= 4) {
    return { score, text: '中等', color: 'text-cyber-yellow' };
  } else {
    return { score, text: '强', color: 'text-cyber-green' };
  }
}

/**
 * 验证是否为中国身份证号
 */
export function isValidChineseId(id: string): boolean {
  // 18位身份证号正则
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!reg.test(id)) return false;

  // 验证校验码
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(id[i]) * factors[i];
  }
  const checkCode = checkCodes[sum % 11];

  return checkCode === id[17].toUpperCase();
}

/**
 * 验证是否为信用卡号
 */
export function isValidCreditCard(cardNumber: string): boolean {
  // Luhn 算法
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * 验证是否为有效的 JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证是否为有效的颜色值
 */
export function isValidColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}

/**
 * 验证是否为有效的日期
 */
export function isValidDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

/**
 * 验证是否为整数
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(Number(value));
}

/**
 * 验证是否为正数
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * 验证范围
 */
export function isInRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}

/**
 * 验证是否为有效的端口号
 */
export function isValidPort(port: number): boolean {
  return isInRange(port, 1, 65535);
}

/**
 * 验证是否为有效的 IP 地址
 */
export function isValidIp(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) return false;

  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every((part) => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });
  }

  return true;
}
