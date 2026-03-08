/**
 * 验证工具
 * 提供常用的表单验证函数
 */

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface ValidationRule {
  validate: (value: any) => ValidationResult;
  required?: boolean;
}

/**
 * 必填验证
 */
export function required(message: string = '此项为必填项'): ValidationRule {
  return {
    required: true,
    validate: (value: any) => {
      if (value === null || value === undefined || value === '') {
        return { valid: false, message };
      }
      return { valid: true };
    },
  };
}

/**
 * 邮箱验证
 */
export function email(message: string = '请输入有效的邮箱地址'): ValidationRule {
  return {
    validate: (value: any) => {
      if (!value) return { valid: true }; // 空值由 required 规则处理

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { valid: false, message };
      }
      return { valid: true };
    },
  };
}

/**
 * 手机号验证（中国大陆）
 */
export function phone(message: string = '请输入有效的手机号'): ValidationRule {
  return {
    validate: (value: any) => {
      if (!value) return { valid: true };

      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        return { valid: false, message };
      }
      return { valid: true };
    },
  };
}

/**
 * URL 验证
 */
export function url(message: string = '请输入有效的 URL'): ValidationRule {
  return {
    validate: (value: any) => {
      if (!value) return { valid: true };

      try {
        new URL(value);
        return { valid: true };
      } catch {
        return { valid: false, message };
      }
    },
  };
}

/**
 * 最小长度验证
 */
export function minLength(min: number, message?: string): ValidationRule {
  return {
    validate: (value: any) => {
      if (!value) return { valid: true };

      if (value.length < min) {
        return {
          valid: false,
          message: message || `长度不能少于 ${min} 个字符`,
        };
      }
      return { valid: true };
    },
  };
}

/**
 * 最大长度验证
 */
export function maxLength(max: number, message?: string): ValidationRule {
  return {
    validate: (value: any) => {
      if (!value) return { valid: true };

      if (value.length > max) {
        return {
          valid: false,
          message: message || `长度不能超过 ${max} 个字符`,
        };
      }
      return { valid: true };
    },
  };
}

/**
 * 长度范围验证
 */
export function lengthRange(min: number, max: number, message?: string): ValidationRule {
  return {
    validate: (value: any) => {
      if (!value) return { valid: true };

      if (value.length < min || value.length > max) {
        return {
          valid: false,
          message: message || `长度必须在 ${min} 到 ${max} 个字符之间`,
        };
      }
      return { valid: true };
    },
  };
}

/**
 * 最小值验证（数字）
 */
export function min(min: number, message?: string): ValidationRule {
  return {
    validate: (value: any) => {
      if (value === null || value === undefined || value === '') {
        return { valid: true };
      }

      const num = Number(value);
      if (isNaN(num) || num < min) {
        return {
          valid: false,
          message: message || `不能小于 ${min}`,
        };
      }
      return { valid: true };
    },
  };
}

/**
 * 最大值验证（数字）
 */
export function max(max: number, message?: string): ValidationRule {
  return {
    validate: (value: any) => {
      if (value === null || value === undefined || value === '') {
        return { valid: true };
      }

      const num = Number(value);
      if (isNaN(num) || num > max) {
        return {
          valid: false,
          message: message || `不能大于 ${max}`,
        };
      }
      return { valid: true };
    },
  };
}

/**
 * 数值范围验证
 */
export function range(min: number, max: number, message?: string): ValidationRule {
  return {
    validate: (value: any) => {
      if (value === null || value === undefined || value === '') {
        return { valid: true };
      }

      const num = Number(value);
      if (isNaN(num) || num < min || num > max) {
        return {
          valid: false,
          message: message || `必须在 ${min} 到 ${max} 之间`,
        };
      }
      return { valid: true };
    },
  };
}

/**
 * 正则表达式验证
 */
export function pattern(regex: RegExp, message: string = '格式不正确'): ValidationRule {
  return {
    validate: (value: any) => {
      if (!value) return { valid: true };

      if (!regex.test(value)) {
        return { valid: false, message };
      }
      return { valid: true };
    },
  };
}

/**
 * 密码强度验证
 */
export function passwordStrength(message: string = '密码强度不足'): ValidationRule {
  return {
    validate: (value: any) => {
      if (!value) return { valid: true };

      // 至少8位，包含大小写字母和数字
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(value)) {
        return {
          valid: false,
          message: '密码必须至少8位，包含大小写字母和数字',
        };
      }
      return { valid: true };
    },
  };
}

/**
 * 确认密码验证
 */
export function confirmPassword(passwordField: string, message: string = '两次密码不一致'): ValidationRule {
  return {
    validate: (value: any, formData?: Record<string, any>) => {
      if (!value) return { valid: true };

      if (!formData || formData[passwordField] !== value) {
        return { valid: false, message };
      }
      return { valid: true };
    },
  };
}

/**
 * 自定义验证
 */
export function custom(
  validator: (value: any) => boolean,
  message: string = '验证失败'
): ValidationRule {
  return {
    validate: (value: any) => {
      if (!validator(value)) {
        return { valid: false, message };
      }
      return { valid: true };
    },
  };
}

/**
 * 组合多个验证规则
 */
export function compose(...rules: ValidationRule[]): ValidationRule {
  return {
    validate: (value: any, formData?: Record<string, any>) => {
      for (const rule of rules) {
        const result = rule.validate(value, formData);
        if (!result.valid) {
          return result;
        }
      }
      return { valid: true };
    },
  };
}

/**
 * 验证表单对象
 */
export function validateForm(
  formData: Record<string, any>,
  rules: Record<string, ValidationRule[]>
): Record<string, ValidationResult> {
  const errors: Record<string, ValidationResult> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = formData[field];

    for (const rule of fieldRules) {
      const result = rule.validate(value, formData);
      if (!result.valid) {
        errors[field] = result;
        break; // 遇到第一个错误就停止
      }
    }
  }

  return errors;
}

/**
 * 检查表单是否有错误
 */
export function hasErrors(errors: Record<string, ValidationResult>): boolean {
  return Object.values(errors).some((error) => !error.valid);
}

/**
 * 获取第一个错误消息
 */
export function getFirstErrorMessage(errors: Record<string, ValidationResult>): string | undefined {
  for (const error of Object.values(errors)) {
    if (!error.valid && error.message) {
      return error.message;
    }
  }
  return undefined;
}

// 预定义的常用验证规则组合
export const commonRules = {
  username: compose(required('用户名不能为空'), minLength(3), maxLength(20)),
  email: compose(required('邮箱不能为空'), email()),
  password: compose(required('密码不能为空'), minLength(8), passwordStrength()),
  phone: compose(required('手机号不能为空'), phone()),
  url: url(),
};

export default {
  required,
  email,
  phone,
  url,
  minLength,
  maxLength,
  lengthRange,
  min,
  max,
  range,
  pattern,
  passwordStrength,
  confirmPassword,
  custom,
  compose,
  validateForm,
  hasErrors,
  getFirstErrorMessage,
  commonRules,
};
