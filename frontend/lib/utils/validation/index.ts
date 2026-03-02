/**
 * 验证工具函数
 */

/**
 * 验证邮箱地址
 */
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * 验证 URL
 */
export function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证手机号（中国大陆）
 */
export function isPhoneNumber(value: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(value);
}

/**
 * 验证身份证号（中国大陆）
 */
export function isIdCard(value: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(value);
}

/**
 * 验证密码强度
 */
export interface PasswordStrength {
  score: number; // 0-4
  level: 'weak' | 'fair' | 'good' | 'strong';
  suggestions: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score++;
  else suggestions.push('密码长度至少为8位');

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else suggestions.push('包含大小写字母');

  if (/\d/.test(password)) score++;
  else suggestions.push('包含数字');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else suggestions.push('包含特殊字符');

  const levels: PasswordStrength['level'][] = ['weak', 'fair', 'good', 'strong'];
  const level = levels[Math.min(score, 3)] || 'weak';

  return { score, level, suggestions };
}

/**
 * 验证用户名
 */
export function isUsername(value: string): boolean {
  // 3-20位，字母开头，只包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
  return usernameRegex.test(value);
}

/**
 * 验证 IP 地址
 */
export function isIP(value: string): boolean {
  const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv4Regex.test(value) || ipv6Regex.test(value);
}

/**
 * 验证十六进制颜色
 */
export function isHexColor(value: string): boolean {
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(value);
}

/**
 * 验证日期格式
 */
export function isValidDate(value: string, format: 'ISO' | 'CN' | 'US' = 'ISO'): boolean {
  const date = new Date(value);

  if (isNaN(date.getTime())) return false;

  if (format === 'ISO') {
    return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/.test(value);
  }

  return true;
}

/**
 * 验证范围
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证长度
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * 验证是否为空
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证是否相等
 */
export function isEqual(value1: unknown, value2: unknown): boolean {
  if (value1 === value2) return true;
  if (typeof value1 !== typeof value2) return false;
  if (typeof value1 === 'object') {
    return JSON.stringify(value1) === JSON.stringify(value2);
  }
  return false;
}

/**
 * 验证规则接口
 */
export interface ValidationRule {
  validate: (value: any) => boolean | string;
  message?: string;
}

/**
 * 验证器类
 */
export class Validator {
  private rules: ValidationRule[] = [];

  /**
   * 添加验证规则
   */
  add(rule: ValidationRule): this {
    this.rules.push(rule);
    return this;
  }

  /**
   * 添加必填规则
   */
  required(message = '此字段为必填项'): this {
    return this.add({
      validate: (value) => !isEmpty(value),
      message,
    });
  }

  /**
   * 添加邮箱规则
   */
  email(message = '请输入有效的邮箱地址'): this {
    return this.add({
      validate: (value) => !value || isEmail(value),
      message,
    });
  }

  /**
   * 添加最小长度规则
   */
  minLength(min: number, message?: string): this {
    return this.add({
      validate: (value) => !value || value.length >= min,
      message: message || `长度不能小于${min}位`,
    });
  }

  /**
   * 添加最大长度规则
   */
  maxLength(max: number, message?: string): this {
    return this.add({
      validate: (value) => !value || value.length <= max,
      message: message || `长度不能大于${max}位`,
    });
  }

  /**
   * 添加范围规则
   */
  range(min: number, max: number, message?: string): this {
    return this.add({
      validate: (value) => !value || isInRange(Number(value), min, max),
      message: message || `值必须在${min}到${max}之间`,
    });
  }

  /**
   * 添加自定义规则
   */
  custom(validate: (value: any) => boolean | string, message?: string): this {
    return this.add({ validate, message });
  }

  /**
   * 验证值
   */
  validate(value: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(value);
      if (result === false || typeof result === 'string') {
        errors.push(result === false ? rule.message || '验证失败' : result);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 清除所有规则
   */
  clear(): this {
    this.rules = [];
    return this;
  }
}

/**
 * 创建验证器
 */
export function createValidator(): Validator {
  return new Validator();
}
