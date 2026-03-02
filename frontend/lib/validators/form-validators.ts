/**
 * 表单验证器
 */

export interface ValidatorRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidatorResult {
  valid: boolean;
  error?: string;
}

/**
 * 邮箱验证
 */
export function validateEmail(email: string): ValidatorResult {
  if (!email) {
    return { valid: false, error: '邮箱不能为空' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: '请输入有效的邮箱地址' };
  }

  return { valid: true };
}

/**
 * 手机号验证
 */
export function validatePhone(phone: string): ValidatorResult {
  if (!phone) {
    return { valid: false, error: '手机号不能为空' };
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: '请输入有效的手机号' };
  }

  return { valid: true };
}

/**
 * 密码验证
 */
export function validatePassword(password: string, options: {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
} = {}): ValidatorResult {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = true,
  } = options;

  if (!password) {
    return { valid: false, error: '密码不能为空' };
  }

  if (password.length < minLength) {
    return { valid: false, error: `密码长度至少 ${minLength} 位` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: '密码必须包含大写字母' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, error: '密码必须包含小写字母' };
  }

  if (requireNumber && !/\d/.test(password)) {
    return { valid: false, error: '密码必须包含数字' };
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: '密码必须包含特殊字符' };
  }

  return { valid: true };
}

/**
 * 用户名验证
 */
export function validateUsername(username: string): ValidatorResult {
  if (!username) {
    return { valid: false, error: '用户名不能为空' };
  }

  if (username.length < 3) {
    return { valid: false, error: '用户名至少 3 个字符' };
  }

  if (username.length > 20) {
    return { valid: false, error: '用户名最多 20 个字符' };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: '用户名只能包含字母、数字、下划线和连字符' };
  }

  return { valid: true };
}

/**
 * URL 验证
 */
export function validateUrl(url: string): ValidatorResult {
  if (!url) {
    return { valid: false, error: 'URL不能为空' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: '请输入有效的URL' };
  }
}

/**
 * 通用验证函数
 */
export function validate(value: any, rules: ValidatorRule): ValidatorResult {
  // 必填验证
  if (rules.required && !value) {
    return { valid: false, error: '此字段为必填项' };
  }

  if (!value) {
    return { valid: true };
  }

  // 最小长度验证
  if (rules.minLength && String(value).length < rules.minLength) {
    return {
      valid: false,
      error: `最少需要 ${rules.minLength} 个字符`,
    };
  }

  // 最大长度验证
  if (rules.maxLength && String(value).length > rules.maxLength) {
    return {
      valid: false,
      error: `最多允许 ${rules.maxLength} 个字符`,
    };
  }

  // 正则验证
  if (rules.pattern && !rules.pattern.test(String(value))) {
    return { valid: false, error: '格式不正确' };
  }

  // 自定义验证
  if (rules.custom) {
    const result = rules.custom(value);
    if (result === false) {
      return { valid: false, error: '验证失败' };
    }
    if (typeof result === 'string') {
      return { valid: false, error: result };
    }
  }

  return { valid: true };
}

/**
 * 表单验证器
 */
export class FormValidator {
  private rules: Record<string, ValidatorRule> = {};
  private values: Record<string, any> = {};

  setRules(rules: Record<string, ValidatorRule>): void {
    this.rules = rules;
  }

  setValues(values: Record<string, any>): void {
    this.values = values;
  }

  validateField(field: string): ValidatorResult {
    const rules = this.rules[field];
    if (!rules) {
      return { valid: true };
    }

    return validate(this.values[field], rules);
  }

  validateAll(): Record<string, ValidatorResult> {
    const results: Record<string, ValidatorResult> = {};

    for (const field in this.rules) {
      results[field] = this.validateField(field);
    }

    return results;
  }

  isValid(): boolean {
    const results = this.validateAll();
    return Object.values(results).every((result) => result.valid);
  }
}
