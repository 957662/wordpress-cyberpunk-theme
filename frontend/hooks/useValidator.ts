import { useState, useCallback, useMemo } from 'react';
import type { ValidationResult } from '@/lib/validator';

/**
 * 验证器 Hook
 */
export function useValidator<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  /**
   * 更新字段值
   */
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: [] }));
  }, []);

  /**
   * 标记字段为已触摸
   */
  const setTouchedField = useCallback(<K extends keyof T>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  /**
   * 设置字段错误
   */
  const setFieldErrors = useCallback(<K extends keyof T>(field: K, fieldErrors: string[]) => {
    setErrors((prev) => ({ ...prev, [field]: fieldErrors }));
  }, []);

  /**
   * 验证单个字段
   */
  const validateField = useCallback(<K extends keyof T>(
    field: K,
    validator: (value: T[K]) => ValidationResult
  ): boolean => {
    const result = validator(values[field]);
    setFieldErrors(field, result.errors);
    return result.valid;
  }, [values, setFieldErrors]);

  /**
   * 验证所有字段
   */
  const validateAll = useCallback((
    validators: Partial<Record<keyof T, (value: any) => ValidationResult>>
  ): boolean => {
    let isValid = true;

    Object.entries(validators).forEach(([field, validator]) => {
      if (validator) {
        const result = validator(values[field as keyof T]);
        setFieldErrors(field as keyof T, result.errors);
        if (!result.valid) {
          isValid = false;
        }
      }
    });

    return isValid;
  }, [values, setFieldErrors]);

  /**
   * 重置表单
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string[]>);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  /**
   * 检查是否有错误
   */
  const hasErrors = useMemo(() => {
    return Object.values(errors).some((fieldErrors) => fieldErrors.length > 0);
  }, [errors]);

  /**
   * 检查是否有效
   */
  const isValid = useMemo(() => !hasErrors, [hasErrors]);

  /**
   * 获取字段错误消息
   */
  const getFieldError = useCallback(<K extends keyof T>(field: K): string[] => {
    return errors[field] || [];
  }, [errors]);

  /**
   * 检查字段是否有错误
   */
  const fieldHasError = useCallback(<K extends keyof T>(field: K): boolean => {
    return (errors[field]?.length || 0) > 0;
  }, [errors]);

  /**
   * 检查字段是否已触摸
   */
  const fieldIsTouched = useCallback(<K extends keyof T>(field: K): boolean => {
    return !!touched[field];
  }, [touched]);

  return {
    values,
    setValues,
    setValue,
    errors,
    touched,
    setTouchedField,
    setFieldErrors,
    validateField,
    validateAll,
    reset,
    hasErrors,
    isValid,
    getFieldError,
    fieldHasError,
    fieldIsTouched,
  };
}

/**
 * 快速表单验证 Hook
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, (value: any) => ValidationResult>>
) {
  const validator = useValidator(initialValues);

  /**
   * 处理字段变化
   */
  const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    validator.setValue(field, value);

    // 如果字段已触摸，立即验证
    if (validator.fieldIsTouched(field) && validationRules[field]) {
      validator.validateField(field, validationRules[field]!);
    }
  }, [validator]);

  /**
   * 处理字段失焦
   */
  const handleBlur = useCallback(<K extends keyof T>(field: K) => {
    validator.setTouchedField(field);

    if (validationRules[field]) {
      validator.validateField(field, validationRules[field]!);
    }
  }, [validator]);

  /**
   * 提交表单
   */
  const handleSubmit = useCallback((
    onSubmit: (values: T) => void | Promise<void>
  ) => {
    return async (e?: React.FormEvent) => {
      e?.preventDefault();

      // 验证所有字段
      const isValid = validator.validateAll(validationRules);

      if (isValid) {
        try {
          await onSubmit(validator.values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }
    };
  }, [validator]);

  return {
    ...validator,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
