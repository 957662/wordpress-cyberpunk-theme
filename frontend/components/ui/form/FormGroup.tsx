/**
 * FormGroup Component
 * 表单组组件 - 提供表单字段的包装和验证
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * 验证错误接口
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * 表单字段配置接口
 */
export interface FieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ label: string; value: any }>;
  validate?: (value: any) => string | null;
  defaultValue?: any;
}

/**
 * 表单上下文
 */
interface FormContextType {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setValue: (name: string, value: any) => void;
  setTouched: (name: string, touched: boolean) => void;
  validate: () => boolean;
  reset: () => void;
}

const FormContext = createContext<FormContextType | null>(null);

/**
 * useForm Hook
 */
export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}

/**
 * FormProvider 组件
 */
export interface FormProviderProps {
  children: ReactNode;
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  validate?: (values: Record<string, any>) => Record<string, string> | null;
}

export function FormProvider({ children, initialValues = {}, onSubmit, validate }: FormProviderProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // 清除该字段的错误
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const setTouched = useCallback((name: string, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  const validateField = useCallback(
    (name: string, value: any): string | null => {
      // 这里可以添加默认验证逻辑
      return null;
    },
    []
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证每个字段
    Object.entries(values).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) {
        newErrors[name] = error;
      }
    });

    // 自定义验证
    if (validate) {
      const customErrors = validate(values);
      if (customErrors) {
        Object.assign(newErrors, customErrors);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validate, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const isValid = validateAll();

      if (isValid && onSubmit) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
    },
    [values, validateAll, onSubmit]
  );

  const contextValue: FormContextType = {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validate: validateAll,
    reset,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {children}
      </form>
    </FormContext.Provider>
  );
}

/**
 * FormGroup 组件
 */
export interface FormGroupProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  helpText?: string;
}

export function FormGroup({
  name,
  label,
  error,
  required = false,
  children,
  className,
  helpText,
}: FormGroupProps) {
  const { errors, touched } = useForm();
  const fieldError = error || errors[name];
  const hasError = Boolean(fieldError && touched[name]);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {children}

      {hasError && (
        <p className="text-sm text-destructive">{fieldError}</p>
      )}

      {helpText && !hasError && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

/**
 * FormInput 组件
 */
export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label?: string;
  error?: string;
  helpText?: string;
}

export function FormInput({
  name,
  label,
  error,
  helpText,
  className,
  ...props
}: FormInputProps) {
  const { values, setValue, setTouched, errors, touched } = useForm();
  const fieldError = error || errors[name];
  const hasError = Boolean(fieldError && touched[name]);

  return (
    <FormGroup name={name} label={label} error={fieldError} helpText={helpText}>
      <input
        name={name}
        value={values[name] || ''}
        onChange={(e) => setValue(name, e.target.value)}
        onBlur={() => setTouched(name, true)}
        className={cn(
          'w-full px-3 py-2 border rounded-md bg-background text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError && 'border-destructive focus:ring-destructive',
          className
        )}
        {...props}
      />
    </FormGroup>
  );
}

/**
 * FormTextarea 组件
 */
export interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: string;
  label?: string;
  error?: string;
  helpText?: string;
}

export function FormTextarea({
  name,
  label,
  error,
  helpText,
  className,
  ...props
}: FormTextareaProps) {
  const { values, setValue, setTouched, errors, touched } = useForm();
  const fieldError = error || errors[name];
  const hasError = Boolean(fieldError && touched[name]);

  return (
    <FormGroup name={name} label={label} error={fieldError} helpText={helpText}>
      <textarea
        name={name}
        value={values[name] || ''}
        onChange={(e) => setValue(name, e.target.value)}
        onBlur={() => setTouched(name, true)}
        rows={4}
        className={cn(
          'w-full px-3 py-2 border rounded-md bg-background text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError && 'border-destructive focus:ring-destructive',
          className
        )}
        {...props}
      />
    </FormGroup>
  );
}

/**
 * FormSelect 组件
 */
export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  name: string;
  label?: string;
  error?: string;
  helpText?: string;
  options: Array<{ label: string; value: any }>;
}

export function FormSelect({
  name,
  label,
  error,
  helpText,
  options,
  className,
  ...props
}: FormSelectProps) {
  const { values, setValue, setTouched, errors, touched } = useForm();
  const fieldError = error || errors[name];
  const hasError = Boolean(fieldError && touched[name]);

  return (
    <FormGroup name={name} label={label} error={fieldError} helpText={helpText}>
      <select
        name={name}
        value={values[name] || ''}
        onChange={(e) => setValue(name, e.target.value)}
        onBlur={() => setTouched(name, true)}
        className={cn(
          'w-full px-3 py-2 border rounded-md bg-background text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError && 'border-destructive focus:ring-destructive',
          className
        )}
        {...props}
      >
        <option value="">请选择...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );
}

/**
 * FormCheckbox 组件
 */
export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label?: string;
  error?: string;
}

export function FormCheckbox({
  name,
  label,
  error,
  className,
  ...props
}: FormCheckboxProps) {
  const { values, setValue, setTouched, errors, touched } = useForm();
  const fieldError = error || errors[name];
  const hasError = Boolean(fieldError && touched[name]);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <input
        type="checkbox"
        name={name}
        checked={values[name] || false}
        onChange={(e) => setValue(name, e.target.checked)}
        onBlur={() => setTouched(name, true)}
        className={cn(
          'w-4 h-4 border rounded bg-background text-primary focus:ring-2 focus:ring-primary',
          hasError && 'border-destructive focus:ring-destructive'
        )}
        {...props}
      />
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
    </div>
  );
}

/**
 * FormError 组件
 */
export interface FormErrorProps {
  className?: string;
}

export function FormError({ className }: FormErrorProps) {
  const { errors } = useForm();
  const errorMessages = Object.values(errors).filter(Boolean);

  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-destructive/10 border border-destructive rounded-md p-3', className)}>
      <ul className="space-y-1">
        {errorMessages.map((error, index) => (
          <li key={index} className="text-sm text-destructive">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * FormActions 组件
 */
export interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end space-x-2', className)}>
      {children}
    </div>
  );
}

/**
 * SubmitButton 组件
 */
export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function SubmitButton({ children, className, ...props }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        'px-4 py-2 bg-primary text-primary-foreground rounded-md',
        'hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * ResetButton 组件
 */
export interface ResetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ResetButton({ children, className, ...props }: ResetButtonProps) {
  const { reset } = useForm();

  return (
    <button
      type="button"
      onClick={reset}
      className={cn(
        'px-4 py-2 border border-input bg-background text-foreground rounded-md',
        'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 默认导出
export default {
  FormProvider,
  FormGroup,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormError,
  FormActions,
  SubmitButton,
  ResetButton,
};
