/**
 * useForm Hook
 * 简化的表单状态管理
 */

import { useState, useCallback } from 'react';

export type FormValue = string | number | boolean | string[];

export interface FormErrors {
  [key: string]: string | undefined;
}

interface FormOptions<T> {
  /**
   * 初始值
   */
  initialValues: T;

  /**
   * 验证函数
   */
  validate?: (values: T) => FormErrors;

  /**
   * 提交成功回调
   */
  onSubmit?: (values: T) => void | Promise<void>;
}

interface FormReturn<T> {
  /**
   * 表单值
   */
  values: T;

  /**
   * 表单错误
   */
  errors: FormErrors;

  /**
   * 是否正在提交
   */
  isSubmitting: boolean;

  /**
   * 获取输入框属性
   */
  getFieldProps: (name: keyof T) => {
    name: string;
    value: FormValue;
    onChange: (value: FormValue) => void;
    error?: string;
  };

  /**
   * 设置值
   */
  setValue: (name: keyof T, value: FormValue) => void;

  /**
   * 设置多个值
   */
  setValues: (values: Partial<T>) => void;

  /**
   * 重置表单
   */
  reset: () => void;

  /**
   * 提交表单
   */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;

  /**
   * 验证表单
   */
  validate: () => boolean;
}

export function useForm<T extends Record<string, FormValue>>(
  options: FormOptions<T>
): FormReturn<T> {
  const { initialValues, validate, onSubmit } = options;
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 设置单个值
  const setValue = useCallback((name: keyof T, value: FormValue) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // 清除该字段的错误
    setErrors((prev) => ({ ...prev, [name as string]: undefined }));
  }, []);

  // 设置多个值
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  // 获取字段属性
  const getFieldProps = useCallback(
    (name: keyof T) => ({
      name: name as string,
      value: values[name],
      onChange: (value: FormValue) => setValue(name, value),
      error: errors[name as string],
    }),
    [values, errors, setValue]
  );

  // 验证表单
  const validateForm = useCallback(() => {
    if (!validate) return true;

    const newErrors = validate(values);
    setErrors(newErrors);

    return Object.keys(newErrors).every((key) => !newErrors[key]);
  }, [validate, values]);

  // 重置表单
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // 提交表单
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  return {
    values,
    errors,
    isSubmitting,
    getFieldProps,
    setValue,
    setValues: setMultipleValues,
    reset,
    handleSubmit,
    validate: validateForm,
  };
}
