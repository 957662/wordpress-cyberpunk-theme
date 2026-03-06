/**
 * useFormField Hook
 * 表单字段管理 Hook
 */
'use client';

import { useState, useCallback, ChangeEvent } from 'react';

interface UseFormFieldOptions<T> {
  /** 初始值 */
  initialValue: T;
  /** 验证函数 */
  validate?: (value: T) => string | undefined;
  /** 是否必填 */
  required?: boolean;
  /** 值变化回调 */
  onChange?: (value: T) => void;
}

interface UseFormFieldReturn<T> {
  /** 当前值 */
  value: T;
  /** 是否被修改过 */
  isDirty: boolean;
  /** 是否被触摸过 */
  isTouched: boolean;
  /** 错误信息 */
  error: string | undefined;
  /** 是否有错误 */
  hasError: boolean;
  /** 设置值 */
  setValue: (value: T) => void;
  /** 设置错误 */
  setError: (error: string | undefined) => void;
  /** 重置字段 */
  reset: () => void;
  /** 处理变化 */
  handleChange: (value: T) => void;
  /** 处理失焦 */
  handleBlur: () => void;
  /** 清除错误 */
  clearError: () => void;
}

/**
 * 表单字段管理 Hook
 *
 * @example
 * ```tsx
 * const username = useFormField({
 *   initialValue: '',
 *   validate: (value) => {
 *     if (!value) return '用户名不能为空';
 *     if (value.length < 3) return '用户名至少3个字符';
 *   }
 * });
 *
 * <input
 *   value={username.value}
 *   onChange={(e) => username.handleChange(e.target.value)}
 *   onBlur={username.handleBlur}
 * />
 * {username.hasError && <span>{username.error}</span>}
 * ```
 */
export function useFormField<T = string>({
  initialValue,
  validate,
  required = false,
  onChange,
}: UseFormFieldOptions<T>): UseFormFieldReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [isDirty, setIsDirty] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);
    setIsDirty(true);
    onChange?.(newValue);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setIsTouched(true);

    // 验证
    if (required && !value) {
      setError('此字段为必填项');
    } else if (validate) {
      const validationError = validate(value);
      setError(validationError);
    }
  }, [value, required, validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setIsDirty(false);
    setIsTouched(false);
    setError(undefined);
  }, [initialValue]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const hasError = isTouched && !!error;

  return {
    value,
    isDirty,
    isTouched,
    error,
    hasError,
    setValue,
    setError,
    reset,
    handleChange,
    handleBlur,
    clearError,
  };
}

/**
 * 文本输入字段 Hook
 */
export function useTextField(options: Omit<UseFormFieldOptions<string>, 'initialValue'> & {
  initialValue?: string;
}) {
  return useFormField<string>({
    initialValue: options.initialValue || '',
    validate: options.validate,
    required: options.required,
    onChange: options.onChange,
  });
}

/**
 * 数字输入字段 Hook
 */
export function useNumberField(options: Omit<UseFormFieldOptions<number>, 'initialValue'> & {
  initialValue?: number;
}) {
  return useFormField<number>({
    initialValue: options.initialValue || 0,
    validate: options.validate,
    required: options.required,
    onChange: options.onChange,
  });
}

/**
 * 布尔字段 Hook (Checkbox)
 */
export function useBooleanField(options: Omit<UseFormFieldOptions<boolean>, 'initialValue'> & {
  initialValue?: boolean;
}) {
  return useFormField<boolean>({
    initialValue: options.initialValue || false,
    validate: options.validate,
    required: options.required,
    onChange: options.onChange,
  });
}

/**
 * 选择字段 Hook (Select)
 */
export function useSelectField(options: Omit<UseFormFieldOptions<string>, 'initialValue'> & {
  initialValue?: string;
}) {
  return useFormField<string>({
    initialValue: options.initialValue || '',
    validate: options.validate,
    required: options.required,
    onChange: options.onChange,
  });
}

/**
 * 文件上传字段 Hook
 */
export function useFileField(options: Omit<UseFormFieldOptions<File | null>, 'initialValue'> & {
  initialValue?: File | null;
}) {
  return useFormField<File | null>({
    initialValue: options.initialValue || null,
    validate: options.validate,
    required: options.required,
    onChange: options.onChange,
  });
}

/**
 * 多选字段 Hook (Checkbox Group)
 */
export function useMultiSelectField(options: Omit<UseFormFieldOptions<string[]>, 'initialValue'> & {
  initialValue?: string[];
}) {
  return useFormField<string[]>({
    initialValue: options.initialValue || [],
    validate: options.validate,
    required: options.required,
    onChange: options.onChange,
  });
}

/**
 * 表单集合 Hook - 管理多个表单字段
 *
 * @example
 * ```tsx
 * const form = useFormFields({
 *   username: useTextField({ initialValue: '', required: true }),
 *   email: useTextField({ initialValue: '', required: true }),
 *   age: useNumberField({ initialValue: 0 })
 * });
 *
 * const handleSubmit = () => {
 *   if (form.isValid) {
 *     console.log(form.values);
 *   }
 * };
 *
 * <form onSubmit={handleSubmit}>
 *   <input {...form.username} />
 *   <input {...form.email} />
 *   <input {...form.age} type="number" />
 *   <button disabled={!form.isValid}>提交</button>
 * </form>
 * ```
 */
export function useFormFields<T extends Record<string, UseFormFieldReturn<any>>>(fields: T) {
  const values = Object.entries(fields).reduce((acc, [key, field]) => {
    acc[key] = field.value;
    return acc;
  }, {} as Record<keyof T, any>);

  const errors = Object.entries(fields).reduce((acc, [key, field]) => {
    if (field.hasError) {
      acc[key] = field.error;
    }
    return acc;
  }, {} as Record<string, string>);

  const isDirty = Object.values(fields).some(field => field.isDirty);
  const isTouched = Object.values(fields).some(field => field.isTouched);
  const hasError = Object.values(fields).some(field => field.hasError);
  const isValid = !hasError;

  const reset = () => {
    Object.values(fields).forEach(field => field.reset());
  };

  const clearErrors = () => {
    Object.values(fields).forEach(field => field.clearError());
  };

  return {
    values,
    errors,
    isDirty,
    isTouched,
    hasError,
    isValid,
    reset,
    clearErrors,
    fields,
  };
}

export default useFormField;
