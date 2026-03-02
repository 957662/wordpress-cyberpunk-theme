/**
 * Validation Utilities
 * 验证工具集 - 常用验证函数
 */

// ============================================
// 类型定义
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

// ============================================
// 验证函数
// ============================================

/**
 * 验证邮箱地址
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证 URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证用户名（字母、数字、下划线，3-20字符）
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * 验证密码强度（至少8位，包含大小写字母和数字）
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 验证手机号（中国大陆）
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证身份证号（中国大陆）
 */
export const validateIdCard = (idCard: string): boolean => {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
};

/**
 * 验证 IP 地址
 */
export const validateIpAddress = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

/**
 * 验证 MAC 地址
 */
export const validateMacAddress = (mac: string): boolean => {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
};

/**
 * 验证十六进制颜色
 */
export const validateHexColor = (color: string): boolean => {
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(color);
};

/**
 * 验证信用卡号（Luhn 算法）
 */
export const validateCreditCard = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

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
};

/**
 * 验证邮政编码（通用）
 */
export const validatePostalCode = (postalCode: string, countryCode: string = 'US'): boolean => {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
    CN: /^\d{6}$/,
    JP: /^\d{3}-\d{4}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
  };

  const pattern = patterns[countryCode] || patterns.US;
  return pattern.test(postalCode);
};

/**
 * 验证日期格式 (YYYY-MM-DD)
 */
export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * 验证时间格式 (HH:MM:SS)
 */
export const validateTime = (time: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return timeRegex.test(time);
};

/**
 * 验证年龄（18-120岁）
 */
export const validateAge = (birthDate: string): ValidationResult => {
  const errors: string[] = [];

  if (!validateDate(birthDate)) {
    errors.push('Invalid date format');
    return { isValid: false, errors };
  }

  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
    ? age - 1
    : age;

  if (actualAge < 18) {
    errors.push('You must be at least 18 years old');
  }

  if (actualAge > 120) {
    errors.push('Please enter a valid birth date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 验证文件类型
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some((type) => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type === type || file.type.startsWith(type + '/');
  });
};

/**
 * 验证文件大小
 */
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * 验证图像尺寸
 */
export const validateImageDimensions = (
  file: File,
  minWidth: number,
  minHeight: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      resolve(img.width >= minWidth && img.height >= minHeight);
    };
    img.onerror = () => resolve(false);

    img.src = URL.createObjectURL(file);
  });
};

/**
 * 验证字符串长度
 */
export const validateLength = (
  value: string,
  min?: number,
  max?: number
): ValidationResult => {
  const errors: string[] = [];

  if (min !== undefined && value.length < min) {
    errors.push(`Must be at least ${min} characters long`);
  }

  if (max !== undefined && value.length > max) {
    errors.push(`Must be no more than ${max} characters long`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 验证数字范围
 */
export const validateRange = (
  value: number,
  min?: number,
  max?: number
): ValidationResult => {
  const errors: string[] = [];

  if (min !== undefined && value < min) {
    errors.push(`Must be at least ${min}`);
  }

  if (max !== undefined && value > max) {
    errors.push(`Must be no more than ${max}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 验证 UUID
 */
export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * 验证车牌号（中国大陆）
 */
export const validateLicensePlate = (plate: string): boolean => {
  const plateRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{5,6}$/;
  return plateRegex.test(plate);
};

// ============================================
// 表单验证构建器
// ============================================

export class FormValidator {
  private rules: Map<string, ValidationRule[]> = new Map();

  addRule(fieldName: string, rule: ValidationRule): FormValidator {
    const existingRules = this.rules.get(fieldName) || [];
    existingRules.push(rule);
    this.rules.set(fieldName, existingRules);
    return this;
  }

  validate(fieldName: string, value: any): ValidationResult {
    const fieldRules = this.rules.get(fieldName) || [];
    const errors: string[] = [];

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateAll(data: Record<string, any>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};

    for (const [fieldName] of this.rules) {
      results[fieldName] = this.validate(fieldName, data[fieldName]);
    }

    return results;
  }

  isValid(data: Record<string, any>): boolean {
    const results = this.validateAll(data);
    return Object.values(results).every((result) => result.isValid);
  }
}

// ============================================
// 常用验证规则
// ============================================

export const commonRules = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    validate: (value: any) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== undefined && value !== '';
    },
    message,
  }),

  email: (message: string = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value: string) => !value || validateEmail(value),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value: string) => !value || value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value: string) => !value || value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value: string) => !value || regex.test(value),
    message,
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validate: (value: number) => value === null || value === undefined || value >= min,
    message: message || `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validate: (value: number) => value === null || value === undefined || value <= max,
    message: message || `Must be no more than ${max}`,
  }),
};

// ============================================
// 导出
// ============================================

export default {
  validateEmail,
  validateUrl,
  validateUsername,
  validatePassword,
  validatePhoneNumber,
  validateIdCard,
  validateIpAddress,
  validateMacAddress,
  validateHexColor,
  validateCreditCard,
  validatePostalCode,
  validateDate,
  validateTime,
  validateAge,
  validateFileType,
  validateFileSize,
  validateImageDimensions,
  validateLength,
  validateRange,
  validateUUID,
  validateLicensePlate,
  FormValidator,
  commonRules,
};
