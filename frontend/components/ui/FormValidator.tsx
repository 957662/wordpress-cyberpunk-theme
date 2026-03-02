/**
 * 表单验证器组件
 * 提供实时表单验证、错误提示、验证规则
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 验证规则类型
export type ValidationRule =
  | 'required'
  | 'email'
  | 'url'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'confirm'
  | 'custom';

export interface FieldValidation {
  rule: ValidationRule;
  value?: any;
  message?: string;
  customValidator?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormValidatorProps {
  children: React.ReactNode;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  initialValues?: Record<string, any>;
  validationRules?: Record<string, FieldValidation[]>;
  className?: string;
}

interface FormFieldContextType {
  name: string;
  value: any;
  error: string | null;
  touched: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
  setError: (error: string | null) => void;
}

const FormContext = React.createContext<{
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  registerField: (name: string) => void;
  unregisterField: (name: string) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  setFieldError: (name: string, error: string | null) => void;
  validateField: (name: string) => boolean;
  validateAll: () => boolean;
  isSubmitting: boolean;
  submitForm: () => Promise<void>;
} | null>(null);

// 表单验证器主组件
export function FormValidator({
  children,
  onSubmit,
  initialValues = {},
  validationRules = {},
  className,
}: FormValidatorProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerField = useCallback((name: string) => {
    if (!(name in values)) {
      setValues(prev => ({ ...prev, [name]: initialValues[name] || '' }));
    }
  }, []);

  const unregisterField = useCallback((name: string) => {
    setValues(prev => {
      const newValues = { ...prev };
      delete newValues[name];
      return newValues;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    setTouched(prev => {
      const newTouched = { ...prev };
      delete newTouched[name];
      return newTouched;
    });
  }, []);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldTouched = useCallback((name: string, fieldTouched: boolean) => {
    setTouched(prev => ({ ...prev, [name]: fieldTouched }));
  }, []);

  const setFieldError = useCallback((name: string, error: string | null) => {
    setErrors(prev => {
      if (error) {
        return { ...prev, [name]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
    });
  }, []);

  // 验证单个字段
  const validateField = useCallback(
    (name: string): boolean => {
      const rules = validationRules[name];
      if (!rules || rules.length === 0) return true;

      const value = values[name];
      for (const rule of rules) {
        const error = validateValue(value, rule);
        if (error) {
          setFieldError(name, error);
          return false;
        }
      }

      setFieldError(name, null);
      return true;
    },
    [values, validationRules]
  );

  // 验证所有字段
  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const fieldNames = Object.keys(validationRules);

    for (const name of fieldNames) {
      if (!validateField(name)) {
        isValid = false;
      }
    }

    return isValid;
  }, [validationRules]);

  // 提交表单
  const submitForm = useCallback(async () => {
    const isValid = validateAll();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, validateAll]);

  const contextValue = {
    values,
    errors,
    touched,
    registerField,
    unregisterField,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateAll,
    isSubmitting,
    submitForm,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form className={className} onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// 验证值
function validateValue(value: any, rule: FieldValidation): string | null {
  const { rule: ruleType, value: ruleValue, message, customValidator } = rule;

  switch (ruleType) {
    case 'required':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return message || '此字段为必填项';
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return message || '请输入有效的邮箱地址';
      }
      break;

    case 'url':
      try {
        if (value) new URL(value);
      } catch {
        return message || '请输入有效的 URL';
      }
      break;

    case 'minLength':
      if (value && value.length < ruleValue) {
        return message || `至少需要 ${ruleValue} 个字符`;
      }
      break;

    case 'maxLength':
      if (value && value.length > ruleValue) {
        return message || `最多 ${ruleValue} 个字符`;
      }
      break;

    case 'pattern':
      if (value && !ruleValue.test(value)) {
        return message || '格式不正确';
      }
      break;

    case 'confirm':
      if (value !== ruleValue) {
        return message || '两次输入不一致';
      }
      break;

    case 'custom':
      if (customValidator) {
        const result = customValidator(value);
        if (result !== true) {
          return typeof result === 'string' ? result : message || '验证失败';
        }
      }
      break;
  }

  return null;
}

// 表单字段组件
export function FormField({
  name,
  children,
}: {
  name: string;
  children: (context: FormFieldContextType) => React.ReactNode;
}) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('FormField must be used within FormValidator');

  const { values, errors, touched, setFieldValue, setFieldTouched, setFieldError, validateField } =
    context;

  useEffect(() => {
    context.registerField(name);
    return () => context.unregisterField(name);
  }, [name]);

  const fieldContext: FormFieldContextType = {
    name,
    value: values[name] || '',
    error: errors[name] || null,
    touched: touched[name] || false,
    onChange: (value) => {
      setFieldValue(name, value);
      if (touched[name]) {
        validateField(name);
      }
    },
    onBlur: () => {
      setFieldTouched(name, true);
      validateField(name);
    },
    setError: (error) => setFieldError(name, error),
  };

  return <>{children(fieldContext)}</>;
}

// 错误消息组件
export function FieldError({ error }: { error: string | null }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1 text-sm text-cyber-pink"
        >
          {error}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 提交按钮组件
export function SubmitButton({
  children,
  className,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('SubmitButton must be used within FormValidator');

  const { isSubmitting, validateAll } = context;

  const handleClick = () => {
    const isValid = validateAll();
    if (isValid && !isSubmitting) {
      context.submitForm();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled || isSubmitting}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-6 py-2.5 bg-cyber-cyan text-cyber-dark font-medium rounded-md',
        'hover:bg-cyber-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        className
      )}
    >
      {isSubmitting ? '提交中...' : children}
    </motion.button>
  );
}

// 预设验证规则
export const rules = {
  required: (message?: string): FieldValidation => ({
    rule: 'required',
    message,
  }),

  email: (message?: string): FieldValidation => ({
    rule: 'email',
    message,
  }),

  url: (message?: string): FieldValidation => ({
    rule: 'url',
    message,
  }),

  minLength: (length: number, message?: string): FieldValidation => ({
    rule: 'minLength',
    value: length,
    message: message || `至少需要 ${length} 个字符`,
  }),

  maxLength: (length: number, message?: string): FieldValidation => ({
    rule: 'maxLength',
    value: length,
    message: message || `最多 ${length} 个字符`,
  }),

  pattern: (regex: RegExp, message?: string): FieldValidation => ({
    rule: 'pattern',
    value: regex,
    message,
  }),

  confirm: (confirmValue: any, message?: string): FieldValidation => ({
    rule: 'confirm',
    value: confirmValue,
    message: message || '两次输入不一致',
  }),

  custom: (validator: (value: any) => boolean | string, message?: string): FieldValidation => ({
    rule: 'custom',
    customValidator: validator,
    message,
  }),
};
