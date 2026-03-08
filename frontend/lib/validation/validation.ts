/**
 * CyberPress Validation Utilities
 * 表单验证工具函数
 */

/**
 * 邮箱验证
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URL 验证
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
 * 手机号验证（中国大陆）
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 用户名验证
 * 4-20位，字母、数字、下划线
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  return usernameRegex.test(username);
}

/**
 * 密码强度验证
 * 至少8位，包含大小写字母、数字
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
} {
  const issues: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    issues.push('密码长度至少8位');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('密码必须包含小写字母');
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('密码必须包含大写字母');
  }

  if (!/\d/.test(password)) {
    issues.push('密码必须包含数字');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('建议包含特殊字符');
  }

  const score = password.length + (/[a-z]/.test(password) ? 1 : 0) + (/[A-Z]/.test(password) ? 1 : 0) + (/\d/.test(password) ? 1 : 0) + (/[^a-zA-Z0-9]/.test(password) ? 2 : 0);

  if (score >= 10) strength = 'strong';
  else if (score >= 7) strength = 'medium';

  return {
    isValid: issues.length === 0 || issues.length === 1, // 允许缺少特殊字符
    strength,
    issues,
  };
}

/**
 * 验证两次密码是否一致
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
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
 * 验证是否为数字
 */
export function isNumber(value: any): boolean {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * 验证是否为整数
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(Number(value));
}

/**
 * 验证数字范围
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证是否为中国身份证号
 */
export function isValidChineseId(id: string): boolean {
  const idRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!idRegex.test(id)) return false;

  // 验证校验位
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(id[i]) * weights[i];
  }

  const checkCode = checkCodes[sum % 11];
  return checkCode === id[17].toUpperCase();
}

/**
 * 验证是否为 IPv4 地址
 */
export function isValidIPv4(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}

/**
 * 验证是否为十六进制颜色
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
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
export function isValidImageDimensions(
  file: File,
  minWidth: number,
  minHeight: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width >= minWidth && img.height >= minHeight);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 表单验证器类
 */
export class FormValidator {
  private rules: Map<string, ((value: any) => boolean | string)[]> = new Map();

  /**
   * 添加验证规则
   */
  addRule(fieldName: string, validator: (value: any) => boolean | string): FormValidator {
    if (!this.rules.has(fieldName)) {
      this.rules.set(fieldName, []);
    }
    this.rules.get(fieldName)!.push(validator);
    return this;
  }

  /**
   * 批量添加验证规则
   */
  addRules(fieldName: string, validators: ((value: any) => boolean | string)[]): FormValidator {
    validators.forEach((validator) => this.addRule(fieldName, validator));
    return this;
  }

  /**
   * 验证单个字段
   */
  validateField(fieldName: string, value: any): { isValid: boolean; errors: string[] } {
    const fieldRules = this.rules.get(fieldName);
    if (!fieldRules) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];
    for (const rule of fieldRules) {
      const result = rule(value);
      if (result === false) {
        errors.push(`${fieldName} 验证失败`);
      } else if (typeof result === 'string') {
        errors.push(result);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 验证整个表单
   */
  validateForm(data: Record<string, any>): {
    isValid: boolean;
    errors: Record<string, string[]>;
  } {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    for (const [fieldName, validators] of this.rules.entries()) {
      const value = data[fieldName];
      const result = this.validateField(fieldName, value);

      if (!result.isValid) {
        errors[fieldName] = result.errors;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  /**
   * 清除所有规则
   */
  clearRules(): FormValidator {
    this.rules.clear();
    return this;
  }
}

/**
 * 常用验证规则集合
 */
export const validationRules = {
  required: (message?: string) => (value: any) => {
    if (isEmpty(value)) {
      return message || '此字段为必填项';
    }
    return true;
  },

  email: (message?: string) => (value: string) => {
    if (!isValidEmail(value)) {
      return message || '请输入有效的邮箱地址';
    }
    return true;
  },

  phone: (message?: string) => (value: string) => {
    if (!isValidPhone(value)) {
      return message || '请输入有效的手机号';
    }
    return true;
  },

  minLength: (min: number, message?: string) => (value: string) => {
    if (value.length < min) {
      return message || `长度不能少于 ${min} 位`;
    }
    return true;
  },

  maxLength: (max: number, message?: string) => (value: string) => {
    if (value.length > max) {
      return message || `长度不能超过 ${max} 位`;
    }
    return true;
  },

  min: (min: number, message?: string) => (value: number) => {
    if (value < min) {
      return message || `不能小于 ${min}`;
    }
    return true;
  },

  max: (max: number, message?: string) => (value: number) => {
    if (value > max) {
      return message || `不能大于 ${max}`;
    }
    return true;
  },

  pattern: (regex: RegExp, message?: string) => (value: string) => {
    if (!regex.test(value)) {
      return message || '格式不正确';
    }
    return true;
  },

  url: (message?: string) => (value: string) => {
    if (!isValidUrl(value)) {
      return message || '请输入有效的 URL';
    }
    return true;
  },
};

/**
 * 实时验证 Hook 的辅助函数
 */
export function createValidationSchema<T extends Record<string, any>>(
  schema: {
    [K in keyof T]: ((value: T[K]) => boolean | string)[];
  }
): (data: T) => { isValid: boolean; errors: Record<string, string[]> } {
  return (data: T) => {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    for (const [fieldName, validators] of Object.entries(schema)) {
      const value = data[fieldName as keyof T];
      const fieldErrors: string[] = [];

      for (const validator of validators) {
        const result = validator(value);
        if (result === false) {
          fieldErrors.push(`${fieldName} 验证失败`);
        } else if (typeof result === 'string') {
          fieldErrors.push(result);
        }
      }

      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    }

    return { isValid, errors };
  };
}
