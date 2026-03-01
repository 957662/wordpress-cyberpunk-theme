/**
 * useForm Hook
 *
 * 表单管理 Hook
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * 表单字段验证规则
 */
export interface ValidationRule<T = any> {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: T) => string | undefined;
}

/**
 * 表单字段配置
 */
export interface FieldConfig<T = any> {
  initialValue: T;
  validation?: ValidationRule<T>;
  validateOnChange?: boolean;
}

/**
 * 表单状态
 */
export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Record<keyof T, string | undefined>;
  touched: Record<keyof T, boolean>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
}

/**
 * useForm Hook 返回值
 */
export interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: Record<keyof T, string | undefined>;
  touched: Record<keyof T, boolean>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => void;
  reset: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string | undefined) => void;
  validateField: (field: keyof T) => string | undefined;
  validateAll: () => boolean;
}

/**
 * 表单管理 Hook
 * @param fieldConfigs - 字段配置对象
 * @returns 表单状态和方法
 */
export function useForm<T extends Record<string, any>>(
  fieldConfigs: { [K in keyof T]: FieldConfig<T[K]> }
): UseFormReturn<T> {
  // 初始化表单值
  const initialValues = Object.keys(fieldConfigs).reduce((acc, key) => {
    acc[key as keyof T] = fieldConfigs[key as keyof T].initialValue;
    return acc;
  }, {} as T);

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | undefined>>({} as any);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = Object.keys(touched).some((key) => touched[key as keyof T]);
  const isValid = Object.values(errors).every((error) => !error);

  /**
   * 验证单个字段
   */
  const validateField = useCallback(
    (field: keyof T): string | undefined => {
      const config = fieldConfigs[field];
      const value = values[field];
      const rules = config?.validation;

      if (!rules) return undefined;

      // 必填验证
      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return '此字段为必填项';
      }

      // 字符串验证
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          return `最少需要 ${rules.minLength} 个字符`;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          return `最多允许 ${rules.maxLength} 个字符`;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          return '格式不正确';
        }
      }

      // 数字验证
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          return `不能小于 ${rules.min}`;
        }
        if (rules.max !== undefined && value > rules.max) {
          return `不能大于 ${rules.max}`;
        }
      }

      // 自定义验证
      if (rules.custom) {
        return rules.custom(value);
      }

      return undefined;
    },
    [values, fieldConfigs]
  );

  /**
   * 验证所有字段
   */
  const validateAll = useCallback((): boolean => {
    const newErrors: Record<keyof T, string | undefined> = {} as any;
    let isValid = true;

    Object.keys(fieldConfigs).forEach((key) => {
      const error = validateField(key as keyof T);
      newErrors[key as keyof T] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  }, [fieldConfigs, validateField]);

  /**
   * 处理字段值变化
   */
  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // 如果配置了实时验证
      if (fieldConfigs[field]?.validateOnChange) {
        const error = validateField(field);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [fieldConfigs, validateField]
  );

  /**
   * 处理字段失焦
   */
  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateField]
  );

  /**
   * 设置字段值
   */
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * 设置字段错误
   */
  const setFieldError = useCallback((field: keyof T, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  /**
   * 重置表单
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as any);
    setTouched({} as any);
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * 处理表单提交
   */
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      return async (e?: React.FormEvent) => {
        e?.preventDefault();

        // 验证所有字段
        const isValid = validateAll();
        if (!isValid) return;

        setIsSubmitting(true);

        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, validateAll]
  );

  return {
    values,
    errors,
    touched,
    isDirty,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validateField,
    validateAll,
  };
}
