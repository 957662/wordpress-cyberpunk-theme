/**
 * 表单验证工具
 * 提供常用的表单验证函数
 */

export interface ValidationRule {
  validate: (value: any) => boolean | string;
  message?: string;
}

export interface ValidatorOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

/**
 * 邮箱验证
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * URL 验证
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
 * 用户名验证
 * - 3-20 个字符
 * - 只允许字母、数字、下划线、连字符
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * 密码强度验证
 * 返回强度等级: 0-4
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  return Math.min(strength, 4);
};

/**
 * 密码强度文本
 */
export const getPasswordStrengthText = (strength: number): string => {
  const texts = ['极弱', '弱', '中等', '强', '极强'];
  return texts[strength];
};

/**
 * 密码强度颜色
 */
export const getPasswordStrengthColor = (strength: number): string => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-cyan-500',
  ];
  return colors[strength];
};

/**
 * 手机号验证（中国大陆）
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 身份证号验证（中国大陆）
 */
export const validateIdCard = (idCard: string): boolean => {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
};

/**
 * 表单验证器类
 */
export class Validator {
  private rules: Map<string, ValidationRule[]> = new Map();
  private errors: Map<string, string> = new Map();

  /**
   * 添加验证规则
   */
  addRule(field: string, rule: ValidationRule): this {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);
    }
    this.rules.get(field)!.push(rule);
    return this;
  }

  /**
   * 必填验证
   */
  required(field: string, message?: string): this {
    return this.addRule(field, {
      validate: (value) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;
        return value != null;
      },
      message: message || '此字段为必填项',
    });
  }

  /**
   * 最小长度验证
   */
  minLength(field: string, min: number, message?: string): this {
    return this.addRule(field, {
      validate: (value) => {
        if (!value) return true;
        return String(value).length >= min;
      },
      message: message || `最少需要 ${min} 个字符`,
    });
  }

  /**
   * 最大长度验证
   */
  maxLength(field: string, max: number, message?: string): this {
    return this.addRule(field, {
      validate: (value) => {
        if (!value) return true;
        return String(value).length <= max;
      },
      message: message || `最多允许 ${max} 个字符`,
    });
  }

  /**
   * 正则表达式验证
   */
  pattern(field: string, regex: RegExp, message?: string): this {
    return this.addRule(field, {
      validate: (value) => {
        if (!value) return true;
        return regex.test(String(value));
      },
      message: message || '格式不正确',
    });
  }

  /**
   * 邮箱验证
   */
  email(field: string, message?: string): this {
    return this.addRule(field, {
      validate: (value) => {
        if (!value) return true;
        return validateEmail(String(value));
      },
      message: message || '请输入有效的邮箱地址',
    });
  }

  /**
   * URL 验证
   */
  url(field: string, message?: string): this {
    return this.addRule(field, {
      validate: (value) => {
        if (!value) return true;
        return validateUrl(String(value));
      },
      message: message || '请输入有效的 URL',
    });
  }

  /**
   * 自定义验证
   */
  custom(field: string, validator: (value: any) => boolean | string, message?: string): this {
    return this.addRule(field, {
      validate: validator,
      message,
    });
  }

  /**
   * 验证单个字段
   */
  validateField(field: string, value: any): boolean {
    const fieldRules = this.rules.get(field);
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      const result = rule.validate(value);
      if (result === false || typeof result === 'string') {
        this.errors.set(field, rule.message || result || '验证失败');
        return false;
      }
    }

    this.errors.delete(field);
    return true;
  }

  /**
   * 验证所有字段
   */
  validate(data: Record<string, any>): boolean {
    this.errors.clear();
    let isValid = true;

    for (const [field, rules] of this.rules.entries()) {
      const value = data[field];
      for (const rule of rules) {
        const result = rule.validate(value);
        if (result === false || typeof result === 'string') {
          this.errors.set(field, rule.message || result || '验证失败');
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  }

  /**
   * 获取所有错误
   */
  getErrors(): Record<string, string> {
    return Object.fromEntries(this.errors);
  }

  /**
   * 获取字段错误
   */
  getFieldError(field: string): string | undefined {
    return this.errors.get(field);
  }

  /**
   * 清除所有错误
   */
  clearErrors(): void {
    this.errors.clear();
  }

  /**
   * 清除字段错误
   */
  clearFieldError(field: string): void {
    this.errors.delete(field);
  }

  /**
   * 是否有错误
   */
  hasErrors(): boolean {
    return this.errors.size > 0;
  }
}

/**
 * 快捷创建验证器
 */
export const createValidator = () => new Validator();

/**
 * 预设的验证规则
 */
export const validationRules = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 8,
  },
  url: {
    pattern: /^https?:\/\/.+/,
  },
};

/**
 * 实时验证 Hook 辅助函数
 */
export const createFieldValidator = (
  rules: Array<(value: any) => boolean | string>
) => {
  return (value: any) => {
    for (const rule of rules) {
      const result = rule(value);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };
};

export default {
  validateEmail,
  validateUrl,
  validateUsername,
  validatePhone,
  validateIdCard,
  getPasswordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor,
  Validator,
  createValidator,
  validationRules,
  createFieldValidator,
};
