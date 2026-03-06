/**
 * 数据验证工具
 * 提供各种数据验证功能
 */

// =====================================================
// 基础验证函数
// =====================================================

/**
 * 验证邮箱地址
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
 * 验证身份证号（中国）
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!idCardRegex.test(idCard)) return false;

  // 验证校验码
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
 * 验证密码强度
 */
export interface PasswordStrength {
  valid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  errors: string[];
}

export function validatePassword(password: string): PasswordStrength {
  const errors: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length < 8) {
    errors.push('密码长度至少8位');
  } else {
    score += 1;
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('密码必须包含小写字母');
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('密码必须包含大写字母');
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 1;
  } else {
    errors.push('密码必须包含数字');
  }

  // 包含特殊字符
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    errors.push('密码必须包含特殊字符');
  }

  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    valid: score >= 3 && password.length >= 8,
    strength,
    score,
    errors,
  };
}

/**
 * 验证用户名
 */
export function isValidUsername(username: string): boolean {
  // 用户名: 4-20位,只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证 IPv4 地址
 */
export function isValidIPv4(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}

/**
 * 验证 IPv6 地址
 */
export function isValidIPv6(ip: string): boolean {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip);
}

/**
 * 验证 MAC 地址
 */
export function isValidMACAddress(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

/**
 * 验证十六进制颜色
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(color);
}

/**
 * 验证日期格式 (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
}

/**
 * 验证时间格式 (HH:MM:SS)
 */
export function isValidTime(time: string): boolean {
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
  return timeRegex.test(time);
}

/**
 * 验证日期时间格式 (YYYY-MM-DD HH:MM:SS)
 */
export function isValidDateTime(dateTime: string): boolean {
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!dateTimeRegex.test(dateTime)) return false;

  const parsedDateTime = new Date(dateTime);
  return parsedDateTime instanceof Date && !isNaN(parsedDateTime.getTime());
}

/**
 * 验证邮政编码（中国）
 */
export function isValidPostalCode(code: string): boolean {
  const postalCodeRegex = /^\d{6}$/;
  return postalCodeRegex.test(code);
}

/**
 * 验证金额
 */
export function isValidAmount(amount: string): boolean {
  const amountRegex = /^(?!0\d)\d+(\.\d{1,2})?$/;
  return amountRegex.test(amount);
}

/**
 * 验证 JSON 字符串
 */
export function isValidJSON(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证 Base64 字符串
 */
export function isValidBase64(str: string): boolean {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(str);
}

/**
 * 验证 UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 验证 credit card (Luhn 算法)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

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
 * 验证数字范围
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证字符串长度
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
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
 * 验证数组
 */
export function isValidArray<T>(value: any, itemValidator?: (item: T) => boolean): boolean {
  if (!Array.isArray(value)) return false;
  if (itemValidator) {
    return value.every(itemValidator);
  }
  return true;
}

/**
 * 验证对象
 */
export function isValidObject(value: any, requiredKeys: string[] = []): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return requiredKeys.every(key => key in value);
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.startsWith(type);
  });
}

/**
 * 验证文件大小
 */
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * 验证图片尺寸
 */
export function validateImageDimensions(
  file: File,
  minWidth: number,
  minHeight: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const validWidth = img.width >= minWidth && (!maxWidth || img.width <= maxWidth);
      const validHeight = img.height >= minHeight && (!maxHeight || img.height <= maxHeight);
      resolve(validWidth && validHeight);
    };

    img.onerror = () => resolve(false);

    img.src = URL.createObjectURL(file);
  });
}

// =====================================================
// 表单验证器
// =====================================================

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}

export interface ValidationRules {
  [field: string]: (value: any) => boolean | string;
}

/**
 * 验证表单数据
 */
export function validateForm(
  data: Record<string, any>,
  rules: ValidationRules
): ValidationResult {
  const errors: Record<string, string[]> = {};

  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field]);

    if (result !== true) {
      errors[field] = errors[field] || [];
      errors[field].push(typeof result === 'string' ? result : `${field} 验证失败`);
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 创建表单验证器
 */
export function createValidator<T extends Record<string, any>>(
  rules: ValidationRules
) {
  return (data: T): ValidationResult => {
    return validateForm(data, rules);
  };
}

// =====================================================
// 常用验证规则集
// =====================================================

export const commonValidationRules = {
  required: (value: any) => !isEmpty(value) || '此字段为必填项',
  email: (value: string) => isValidEmail(value) || '邮箱格式不正确',
  url: (value: string) => isValidUrl(value) || 'URL格式不正确',
  phone: (value: string) => isValidPhoneNumber(value) || '手机号格式不正确',
  minLength: (min: number) => (value: string) =>
    value.length >= min || `长度不能小于${min}位`,
  maxLength: (max: number) => (value: string) =>
    value.length <= max || `长度不能大于${max}位`,
  range: (min: number, max: number) => (value: number) =>
    isInRange(value, min, max) || `必须在${min}-${max}之间`,
  pattern: (regex: RegExp, message?: string) => (value: string) =>
    regex.test(value) || message || '格式不正确',
  oneOf: (options: any[]) => (value: any) =>
    options.includes(value) || `必须是以下值之一: ${options.join(', ')}`,
};

// =====================================================
// 默认导出
// =====================================================

export default {
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  isValidIdCard,
  validatePassword,
  isValidUsername,
  isValidIPv4,
  isValidIPv6,
  isValidMACAddress,
  isValidHexColor,
  isValidDate,
  isValidTime,
  isValidDateTime,
  isValidPostalCode,
  isValidAmount,
  isValidJSON,
  isValidBase64,
  isValidUUID,
  isValidCreditCard,
  isInRange,
  isValidLength,
  isEmpty,
  isValidArray,
  isValidObject,
  isValidFileType,
  isValidFileSize,
  validateImageDimensions,
  validateForm,
  createValidator,
  commonValidationRules,
};
