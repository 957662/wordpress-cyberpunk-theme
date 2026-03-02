/**
 * 表单验证系统
 * 提供完整的表单验证功能，支持多种验证规则和自定义验证器
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
  custom?: (value: any) => boolean | string;
  message?: string;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule;
}

/**
 * 表单验证器类
 */
export class FormValidator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  /**
   * 验证整个表单
   */
  validate(formData: Record<string, any>): ValidationResult {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    Object.keys(this.schema).forEach((fieldName) => {
      const fieldErrors = this.validateField(fieldName, formData[fieldName], formData);
      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  /**
   * 验证单个字段
   */
  validateField(
    fieldName: string,
    value: any,
    formData?: Record<string, any>
  ): string[] {
    const errors: string[] = [];
    const rule = this.schema[fieldName];

    if (!rule) return errors;

    // Required validation
    if (rule.required && this.isEmpty(value)) {
      errors.push(rule.message || `${fieldName} is required`);
      return errors;
    }

    // Skip other validations if value is empty and not required
    if (this.isEmpty(value)) return errors;

    // Min/Max length validation for strings
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      errors.push(
        rule.message || `${fieldName} must be at least ${rule.minLength} characters`
      );
    }

    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      errors.push(
        rule.message || `${fieldName} must not exceed ${rule.maxLength} characters`
      );
    }

    // Min/Max value validation for numbers
    if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
      errors.push(rule.message || `${fieldName} must be at least ${rule.min}`);
    }

    if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
      errors.push(rule.message || `${fieldName} must not exceed ${rule.max}`);
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(rule.message || `${fieldName} format is invalid`);
    }

    // Email validation
    if (rule.email && typeof value === 'string' && !this.isValidEmail(value)) {
      errors.push(rule.message || `${fieldName} must be a valid email address`);
    }

    // URL validation
    if (rule.url && typeof value === 'string' && !this.isValidUrl(value)) {
      errors.push(rule.message || `${fieldName} must be a valid URL`);
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (customResult !== true) {
        errors.push(typeof customResult === 'string' ? customResult : `${fieldName} is invalid`);
      }
    }

    return errors;
  }

  /**
   * 检查值是否为空
   */
  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  }

  /**
   * 验证邮箱格式
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证 URL 格式
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 更新验证规则
   */
  updateSchema(schema: ValidationSchema): void {
    this.schema = { ...this.schema, ...schema };
  }
}

/**
 * 常用验证规则预设
 */
export const ValidationRules = {
  // 必填
  required: (message?: string): ValidationRule => ({
    required: true,
    message,
  }),

  // 邮箱
  email: (message?: string): ValidationRule => ({
    email: true,
    message,
  }),

  // URL
  url: (message?: string): ValidationRule => ({
    url: true,
    message,
  }),

  // 最小长度
  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Must be at least ${length} characters`,
  }),

  // 最大长度
  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Must not exceed ${length} characters`,
  }),

  // 密码
  password: (message?: string): ValidationRule => ({
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: message || 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers',
  }),

  // 用户名
  username: (message?: string): ValidationRule => ({
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: message || 'Username must be 3-20 characters, containing only letters, numbers, and underscores',
  }),

  // 手机号（中国）
  phone: (message?: string): ValidationRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || 'Please enter a valid phone number',
  }),

  // 身份证号（中国）
  idCard: (message?: string): ValidationRule => ({
    pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    message: message || 'Please enter a valid ID card number',
  }),

  // 数字范围
  range: (min: number, max: number, message?: string): ValidationRule => ({
    min,
    max,
    message: message || `Must be between ${min} and ${max}`,
  }),

  // 自定义正则
  pattern: (regex: RegExp, message?: string): ValidationRule => ({
    pattern: regex,
    message,
  }),

  // 自定义验证器
  custom: (validator: (value: any) => boolean | string, message?: string): ValidationRule => ({
    custom: validator,
    message,
  }),
};

/**
 * 实时验证 Hook (用于 React)
 */
export function useValidation(schema: ValidationSchema) {
  const validator = new FormValidator(schema);

  const validate = (formData: Record<string, any>) => {
    return validator.validate(formData);
  };

  const validateField = (fieldName: string, value: any, formData?: Record<string, any>) => {
    return validator.validateField(fieldName, value, formData);
  };

  return { validate, validateField, validator };
}

/**
 * 常用表单验证场景预设
 */
export const FormSchemas = {
  // 登录表单
  login: {
    email: ValidationRules.email('Please enter a valid email'),
    password: ValidationRules.required('Password is required'),
  },

  // 注册表单
  register: {
    username: ValidationRules.username(),
    email: ValidationRules.email(),
    password: ValidationRules.password(),
    confirmPassword: {
      required: true,
      custom: (value, formData) => {
        return value === formData?.password || 'Passwords do not match';
      },
    },
  },

  // 评论表单
  comment: {
    author: ValidationRules.required('Name is required'),
    email: ValidationRules.email(),
    content: {
      required: true,
      minLength: 10,
      message: 'Comment must be at least 10 characters',
    },
  },

  // 联系表单
  contact: {
    name: ValidationRules.required('Name is required'),
    email: ValidationRules.email(),
    phone: ValidationRules.phone(),
    subject: ValidationRules.required('Subject is required'),
    message: {
      required: true,
      minLength: 20,
      message: 'Message must be at least 20 characters',
    },
  },

  // 文章表单
  post: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: 'Title must be between 5 and 200 characters',
    },
    slug: {
      pattern: /^[a-z0-9-]+$/,
      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
    },
    excerpt: {
      maxLength: 500,
      message: 'Excerpt must not exceed 500 characters',
    },
    content: ValidationRules.required('Content is required'),
  },

  // 用户资料表单
  profile: {
    displayName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    bio: {
      maxLength: 500,
    },
    website: ValidationRules.url(),
    location: {
      maxLength: 100,
    },
  },
};

/**
 * 防抖验证
 */
export function createDebouncedValidator(
  validator: FormValidator,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (
    fieldName: string,
    value: any,
    formData: Record<string, any>,
    callback: (errors: string[]) => void
  ) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const errors = validator.validateField(fieldName, value, formData);
      callback(errors);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 条件验证规则
 */
export function conditionalRule(
  condition: (formData: Record<string, any>) => boolean,
  rule: ValidationRule
): ValidationRule {
  return {
    custom: (value: any, formData?: Record<string, any>) => {
      if (!condition(formData || {})) {
        return true; // 条件不满足时跳过验证
      }
      // 条件满足时执行原规则
      const validator = new FormValidator({ temp: rule });
      const errors = validator.validateField('temp', value, formData);
      return errors.length === 0 || errors[0];
    },
  };
}

/**
 * 跨字段验证
 */
export function crossFieldValidation(
  fieldName: string,
  otherField: string,
  compare: (value: any, otherValue: any) => boolean,
  message?: string
): ValidationRule {
  return {
    custom: (value: any, formData?: Record<string, any>) => {
      if (!formData) return true;
      const otherValue = formData[otherField];
      return compare(value, otherValue) || message || `${fieldName} must match ${otherField}`;
    },
  };
}
