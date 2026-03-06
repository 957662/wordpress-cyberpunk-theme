// ============================================
// CyberPress Platform - 表单验证工具
// ============================================
// 版本: 1.0.0
// 描述: 提供完整的表单验证功能
// ============================================

// ============================================
// 类型定义
// ============================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | boolean;
  message?: string;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [fieldName: string]: string };
}

export interface FormField {
  name: string;
  value: any;
  rules: ValidationRule;
}

// ============================================
// 验证器类
// ============================================

export class FormValidator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  /**
   * 验证单个字段
   */
  validateField(name: string, value: any): string | null {
    const rules = this.schema[name];
    if (!rules) return null;

    // 必填验证
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rules.message || `${name} 是必填项`;
    }

    // 如果值为空且非必填，跳过其他验证
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // 最小长度验证
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message || `${name} 最小长度为 ${rules.minLength}`;
    }

    // 最大长度验证
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `${name} 最大长度为 ${rules.maxLength}`;
    }

    // 正则表达式验证
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || `${name} 格式不正确`;
    }

    // 自定义验证
    if (rules.custom) {
      const result = rules.custom(value);
      if (typeof result === 'string') {
        return result;
      }
      if (result === false) {
        return rules.message || `${name} 验证失败`;
      }
    }

    return null;
  }

  /**
   * 验证整个表单
   */
  validate(formData: { [fieldName: string]: any }): ValidationResult {
    const errors: { [fieldName: string]: string } = {};
    let isValid = true;

    for (const fieldName in this.schema) {
      const error = this.validateField(fieldName, formData[fieldName]);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  /**
   * 更新验证规则
   */
  updateSchema(fieldName: string, rules: ValidationRule): void {
    this.schema[fieldName] = rules;
  }
}

// ============================================
// 常用验证规则
// ============================================

export const ValidationRules = {
  // 必填
  required: (message?: string): ValidationRule => ({
    required: true,
    message,
  }),

  // 邮箱
  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: message || '请输入有效的邮箱地址',
  }),

  // 用户名（字母开头，允许字母数字下划线，4-16位）
  username: (message?: string): ValidationRule => ({
    pattern: /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/,
    message: message || '用户名必须是4-16位字母、数字或下划线，且以字母开头',
  }),

  // 密码（至少8位，包含字母和数字）
  password: (message?: string): ValidationRule => ({
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    message: message || '密码至少8位，且包含字母和数字',
  }),

  // 手机号（中国大陆）
  phone: (message?: string): ValidationRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || '请输入有效的手机号',
  }),

  // URL
  url: (message?: string): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    message: message || '请输入有效的 URL',
  }),

  // 数字
  number: (message?: string): ValidationRule => ({
    pattern: /^\d+$/,
    message: message || '请输入有效的数字',
  }),

  // 最小长度
  minLength: (min: number, message?: string): ValidationRule => ({
    minLength: min,
    message: message || `最小长度为 ${min}`,
  }),

  // 最大长度
  maxLength: (max: number, message?: string): ValidationRule => ({
    maxLength: max,
    message: message || `最大长度为 ${max}`,
  }),

  // 自定义正则
  pattern: (regex: RegExp, message?: string): ValidationRule => ({
    pattern: regex,
    message,
  }),

  // 自定义验证函数
  custom: (fn: (value: any) => string | boolean, message?: string): ValidationRule => ({
    custom: fn,
    message,
  }),
};

// ============================================
// 预定义的验证方案
// ============================================

export const CommonSchemas = {
  // 登录表单
  login: {
    username: {
      required: true,
      message: '请输入用户名',
    },
    password: {
      required: true,
      message: '请输入密码',
    },
  },

  // 注册表单
  register: {
    username: {
      required: true,
      ...ValidationRules.username(),
    },
    email: {
      required: true,
      ...ValidationRules.email(),
    },
    password: {
      required: true,
      ...ValidationRules.password(),
    },
    confirmPassword: {
      required: true,
      custom: (value, formData) => {
        return value === formData?.password || '两次密码输入不一致';
      },
    },
  },

  // 文章表单
  post: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: '标题长度必须在5-200之间',
    },
    content: {
      required: true,
      minLength: 10,
      message: '内容至少10个字符',
    },
    excerpt: {
      maxLength: 500,
      message: '摘要最多500个字符',
    },
    categoryId: {
      required: true,
      message: '请选择分类',
    },
  },

  // 评论表单
  comment: {
    content: {
      required: true,
      minLength: 1,
      maxLength: 1000,
      message: '评论长度必须在1-1000之间',
    },
  },

  // 个人资料表单
  profile: {
    fullName: {
      maxLength: 100,
      message: '姓名最多100个字符',
    },
    bio: {
      maxLength: 500,
      message: '简介最多500个字符',
    },
    website: {
      ...ValidationRules.url(),
    },
    email: {
      ...ValidationRules.email(),
    },
  },

  // 联系表单
  contact: {
    name: {
      required: true,
      message: '请输入您的姓名',
    },
    email: {
      required: true,
      ...ValidationRules.email(),
    },
    subject: {
      required: true,
      message: '请输入主题',
    },
    message: {
      required: true,
      minLength: 10,
      message: '消息至少10个字符',
    },
  },
};

// ============================================
// React Hook 集成
// ============================================

import { useState, useCallback, useEffect } from 'react';

export interface UseFormReturn {
  values: { [fieldName: string]: any };
  errors: { [fieldName: string]: string };
  touched: { [fieldName: string]: boolean };
  isValid: boolean;
  handleChange: (name: string, value: any) => void;
  handleBlur: (name: string) => void;
  handleSubmit: (onSubmit: (values: any) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  clearErrors: () => void;
}

export const useForm = (
  schema: ValidationSchema,
  initialValues: { [fieldName: string]: any } = {}
): UseFormReturn => {
  const validator = new FormValidator(schema);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ [fieldName: string]: string }>({});
  const [touched, setTouched] = useState<{ [fieldName: string]: boolean }>({});

  // 验证所有字段
  const validateForm = useCallback(() => {
    const result = validator.validate(values);
    setErrors(result.errors);
    return result.isValid;
  }, [values, validator]);

  // 验证单个字段
  const validateField = useCallback(
    (name: string) => {
      const error = validator.validateField(name, values[name]);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [values, validator]
  );

  // 处理字段变化
  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // 如果字段已经被触碰过，实时验证
      if (touched[name]) {
        const error = validator.validateField(name, value);
        if (error) {
          setErrors((prev) => ({ ...prev, [name]: error }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    },
    [touched, validator]
  );

  // 处理字段失焦
  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name);
    },
    [validateField]
  );

  // 处理表单提交
  const handleSubmit = useCallback(
    (onSubmit: (values: any) => void | Promise<void>) => async (e?: React.FormEvent) => {
      e?.preventDefault();

      // 标记所有字段为已触碰
      const allTouched = Object.keys(schema).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // 验证表单
      if (validateForm()) {
        await onSubmit(values);
      }
    },
    [values, schema, validateForm]
  );

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // 手动设置字段值
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 手动设置错误
  const setError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  // 清除所有错误
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // 计算表单是否有效
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setError,
    clearErrors,
  };
};

// ============================================
// 辅助函数
// ============================================

/**
 * 获取字段错误消息
 */
export const getFieldError = (
  errors: { [fieldName: string]: string },
  fieldName: string,
  touched: { [fieldName: string]: boolean }
): string | null => {
  if (!touched[fieldName]) return null;
  return errors[fieldName] || null;
};

/**
 * 检查字段是否有错误
 */
export const hasFieldError = (
  errors: { [fieldName: string]: string },
  fieldName: string,
  touched: { [fieldName: string]: boolean }
): boolean => {
  return touched[fieldName] && !!errors[fieldName];
};

export default FormValidator;
