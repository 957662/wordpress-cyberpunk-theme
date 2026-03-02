/**
 * useForm Hook
 * 强大的表单管理 Hook
 */

'use client';

import { useState, useCallback, useEffect } from 'react';

export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormValidators<T = any> {
  [key: string]: (value: T, formData?: any) => string | undefined;
}

export interface FormOptions<T> {
  initialValues: T;
  validators?: FormValidators;
  onSubmit?: (values: T) => void | Promise<void>;
  onChange?: (values: T) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]?: string };
  touched: { [K in keyof T]?: boolean };
  dirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  validate: () => boolean;
  validateField: (field: keyof T) => boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validators = {},
  onSubmit,
  onChange,
  validateOnChange = true,
  validateOnBlur = true,
}: FormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dirty, setDirty] = useState(false);

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // 设置单个字段值
  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => {
        const newValues = { ...prev, [field]: value };
        if (onChange) {
          onChange(newValues);
        }
        return newValues;
      });
      setDirty(true);

      if (validateOnChange && touched[field]) {
        const error = validators[field]?.(value, values);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [validators, validateOnChange, touched, values, onChange]
  );

  // 批量设置值
  const setFormValues = useCallback(
    (newValues: Partial<T>) => {
      setValues((prev) => {
        const updated = { ...prev, ...newValues };
        if (onChange) {
          onChange(updated);
        }
        return updated;
      });
      setDirty(true);
    },
    [onChange]
  );

  // 设置错误
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // 清除错误
  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // 验证单个字段
  const validateField = useCallback(
    (field: keyof T): boolean => {
      if (!validators[field]) {
        return true;
      }

      const error = validators[field]!(values[field], values);
      if (error) {
        setError(field, error);
        return false;
      } else {
        clearError(field);
        return true;
      }
    },
    [validators, values, setError, clearError]
  );

  // 验证整个表单
  const validate = useCallback((): boolean => {
    let isValid = true;
    const newErrors: { [K in keyof T]?: string } = {};

    Object.keys(validators).forEach((key) => {
      const field = key as keyof T;
      const error = validators[field]!(values[field], values);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validators, values]);

  // 处理输入变化
  const handleChange = useCallback(
    (field: keyof T) => (value: any) => {
      setFieldValue(field, value);
    },
    [setFieldValue]
  );

  // 处理失焦
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (validateOnBlur) {
        validateField(field);
      }
    },
    [validateOnBlur, validateField]
  );

  // 处理提交
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // 标记所有字段为 touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // 验证
      const isValid = validate();
      if (!isValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  // 计算表单是否有效
  const isValid = Object.keys(validators).every((key) => {
    const field = key as keyof T;
    return !errors[field];
  });

  return {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues: setFormValues,
    setError,
    clearError,
    validate,
    validateField,
  };
}

/**
 * 使用示例:
 *
 * const form = useForm({
 *   initialValues: {
 *     email: '',
 *     password: '',
 *   },
 *   validators: {
 *     email: (value) => {
 *       if (!value) return '邮箱不能为空';
 *       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
 *         return '邮箱格式不正确';
 *       }
 *     },
 *     password: (value) => {
 *       if (!value) return '密码不能为空';
 *       if (value.length < 6) return '密码至少6位';
 *     },
 *   },
 *   onSubmit: async (values) => {
 *     await api.login(values);
 *   },
 * });
 */
