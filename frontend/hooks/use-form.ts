/**
 * useForm Hook
 * 表单管理 Hook - 用于管理表单状态
 */

import { useState, useCallback } from 'react';

export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Record<keyof T, string>;
  onSubmit: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: () => Promise<void>;
  reset: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
  isValid: boolean;
  isDirty: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as any);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);

  const handleChange = useCallback(
    (field: keyof T) => (value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // 如果字段已被触摸，则重新验证
      if (touched[field] && validate) {
        const newErrors = validate({ ...values, [field]: value });
        setErrors(newErrors);
      }
    },
    [values, touched, validate]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);
      }
    },
    [values, validate]
  );

  const handleSubmit = async () => {
    // 验证所有字段
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);

      const hasErrors = Object.values(newErrors).some((error) => error);
      if (hasErrors) {
        return;
      }
    }

    await onSubmit(values);
  };

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as any);
    setTouched({} as any);
  }, [initialValues]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const isValid = Object.keys(errors).length === 0;
  const isDirty = Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    isValid,
    isDirty,
  };
}

// 使用示例:
// const form = useForm({
//   initialValues: { email: '', password: '' },
//   validate: (values) => {
//     const errors: any = {};
//     if (!values.email) errors.email = '邮箱必填';
//     return errors;
//   },
//   onSubmit: async (values) => { ... }
// });
