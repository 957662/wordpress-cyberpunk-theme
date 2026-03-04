/**
 * 验证器工具函数
 */

/**
 * 邮箱验证
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 手机号验证 (中国大陆)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
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
 * IP 地址验证
 */
export function isValidIP(ip: string): boolean {
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * 密码强度验证
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
} {
  const issues: string[] = [];

  if (password.length < 8) {
    issues.push('密码长度至少8位');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('至少包含一个小写字母');
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('至少包含一个大写字母');
  }

  if (!/\d/.test(password)) {
    issues.push('至少包含一个数字');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('至少包含一个特殊字符');
  }

  const strength = password.length < 8 ? 'weak' : password.length < 12 ? 'medium' : 'strong';

  return {
    isValid: issues.length === 0,
    strength,
    issues,
  };
}

/**
 * 用户名验证
 */
export function isValidUsername(username: string): boolean {
  // 用户名: 4-20位，字母开头，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
  return usernameRegex.test(username);
}

/**
 * 身份证号验证 (中国大陆)
 */
export function isValidIDCard(idCard: string): boolean {
  // 18位身份证号码正则
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
}

/**
 * 银行卡号验证
 */
export function isValidBankCard(cardNumber: string): boolean {
  // 去除空格
  const cleaned = cardNumber.replace(/\s/g, '');
  // 12-19位数字
  const cardRegex = /^\d{12,19}$/;
  return cardRegex.test(cleaned);
}

/**
 * 邮编验证 (中国大陆)
 */
export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[1-9]\d{5}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * 日期验证
 */
export function isValidDate(date: string, format: 'YYYY-MM-DD' | 'YYYY/MM/DD' | 'DD-MM-YYYY' | 'DD/MM/YYYY' = 'YYYY-MM-DD'): boolean {
  const separators = {
    'YYYY-MM-DD': '-',
    'YYYY/MM/DD': '/',
    'DD-MM-YYYY': '-',
    'DD/MM/YYYY': '/',
  };

  const separator = separators[format];
  const parts = date.split(separator);

  if (parts.length !== 3) return false;

  let year: string, month: string, day: string;

  if (format.startsWith('YYYY')) {
    [year, month, day] = parts;
  } else {
    [day, month, year] = parts;
  }

  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);

  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
    return false;
  }

  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  if (dayNum < 1 || dayNum > 31) {
    return false;
  }

  const dateObj = new Date(yearNum, monthNum - 1, dayNum);
  return (
    dateObj.getFullYear() === yearNum &&
    dateObj.getMonth() === monthNum - 1 &&
    dateObj.getDate() === dayNum
  );
}

/**
 * 年龄验证
 */
export function isValidAge(age: number, min: number = 0, max: number = 150): boolean {
  return age >= min && age <= max;
}

/**
 * 文件大小验证
 */
export function isValidFileSize(file: File, maxSize: number = 10 * 1024 * 1024): boolean {
  return file.size <= maxSize;
}

/**
 * 文件类型验证
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  const fileType = file.type;
  const fileName = file.name;
  const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

  return allowedTypes.some((type) => {
    if (type.startsWith('.')) {
      return fileExt === type.toLowerCase();
    }
    return fileType === type || fileType.startsWith(type);
  });
}

/**
 * 图片尺寸验证
 */
export function validateImageDimensions(file: File, minWidth: number, minHeight: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img.width >= minWidth && img.height >= minHeight);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * 字符串长度验证
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * 数字范围验证
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

/**
 * 必填验证
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

/**
 * 表单验证器类
 */
export class FormValidator {
  private errors: Map<string, string[]> = new Map();

  /**
   * 添加错误
   */
  addError(field: string, message: string): void {
    if (!this.errors.has(field)) {
      this.errors.set(field, []);
    }
    this.errors.get(field)!.push(message);
  }

  /**
   * 获取字段错误
   */
  getErrors(field: string): string[] {
    return this.errors.get(field) || [];
  }

  /**
   * 获取所有错误
   */
  getAllErrors(): Map<string, string[]> {
    return this.errors;
  }

  /**
   * 检查是否有错误
   */
  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  /**
   * 清除错误
   */
  clearErrors(field?: string): void {
    if (field) {
      this.errors.delete(field);
    } else {
      this.errors.clear();
    }
  }

  /**
   * 验证字段
   */
  validateField(
    field: string,
    value: any,
    rules: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      custom?: (value: any) => string | null;
    }
  ): boolean {
    let isValid = true;

    if (rules.required && !isRequired(value)) {
      this.addError(field, '此字段为必填项');
      isValid = false;
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      this.addError(field, `最少需要 ${rules.minLength} 个字符`);
      isValid = false;
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      this.addError(field, `最多允许 ${rules.maxLength} 个字符`);
      isValid = false;
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      this.addError(field, '格式不正确');
      isValid = false;
    }

    if (rules.custom) {
      const error = rules.custom(value);
      if (error) {
        this.addError(field, error);
        isValid = false;
      }
    }

    return isValid;
  }
}
