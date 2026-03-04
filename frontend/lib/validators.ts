/**
 * 通用验证器
 * 提供常用的表单验证函数
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * 验证单个字段
 */
export function validateField(
  value: any,
  rules: ValidationRule,
  fieldName: string = 'Field'
): string | undefined {
  // 必填验证
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return `${fieldName} is required`;
  }

  // 如果值为空且非必填，跳过其他验证
  if (!value) {
    return undefined;
  }

  // 最小长度验证
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  // 最大长度验证
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `${fieldName} must not exceed ${rules.maxLength} characters`;
  }

  // 正则验证
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return `${fieldName} format is invalid`;
  }

  // 自定义验证
  if (rules.custom) {
    return rules.custom(value);
  }

  return undefined;
}

/**
 * 验证整个表单
 */
export function validateForm(
  data: Record<string, any>,
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach((field) => {
    const error = validateField(data[field], rules[field], field);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

/**
 * 预定义的验证规则
 */
export const validationRules = {
  // 邮箱验证
  email: {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },

  // 用户名验证
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },

  // 密码验证（至少8位，包含大小写字母和数字）
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },

  // URL 验证
  url: {
    pattern: /^https?:\/\/.+/,
  },

  // 手机号验证（中国）
  phone: {
    pattern: /^1[3-9]\d{9}$/,
  },

  // 身份证验证（中国）
  idCard: {
    pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  },
};

/**
 * 常用的自定义验证器
 */
export const customValidators = {
  // 确认密码匹配
  passwordMatch: (password: string) => (value: string) => {
    return value === password ? undefined : 'Passwords do not match';
  },

  // 最小值验证
  min: (min: number) => (value: number) => {
    return value >= min ? undefined : `Must be at least ${min}`;
  },

  // 最大值验证
  max: (max: number) => (value: number) => {
    return value <= max ? undefined : `Must be at most ${max}`;
  },

  // 范围验证
  range: (min: number, max: number) => (value: number) => {
    return value >= min && value <= max ? undefined : `Must be between ${min} and ${max}`;
  },

  // 文件大小验证（字节）
  maxSize: (maxSize: number) => (file: File) => {
    return file.size <= maxSize ? undefined : `File size must not exceed ${maxSize} bytes`;
  },

  // 文件类型验证
  fileType: (allowedTypes: string[]) => (file: File) => {
    return allowedTypes.includes(file.type)
      ? undefined
      : `File type must be one of: ${allowedTypes.join(', ')}`;
  },
};

/**
 * Zod schema 转换为验证规则
 */
export function zodToValidationRules(schema: any): ValidationRules {
  const rules: ValidationRules = {};

  // 这里可以根据实际的 Zod schema 结构进行转换
  // 这只是一个示例框架

  return rules;
}
