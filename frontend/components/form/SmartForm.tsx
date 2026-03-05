'use client';

/**
 * 智能表单组件
 * CyberPress Platform
 *
 * 支持动态字段、验证、异步提交等功能
 */

import { useState, useCallback, FormEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'date'
  | 'datetime'
  | 'color'
  | 'range';

export interface FormField<
  T extends Record<string, any> = Record<string, any>
> {
  name: keyof T;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | undefined;
  };
  autoComplete?: string;
  accept?: string; // for file inputs
  multiple?: boolean;
  description?: string;
}

export interface FormConfig<T extends Record<string, any> = Record<string, any>> {
  fields: FormField<T>[];
  submitLabel?: string;
  cancelLabel?: string;
  initialValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onCancel?: () => void;
  onChange?: (data: Partial<T>) => void;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
}

interface FormError {
  field: string;
  message: string;
}

interface SmartFormProps<T extends Record<string, any> = Record<string, any>> {
  config: FormConfig<T>;
  className?: string;
}

export function SmartForm<T extends Record<string, any> = Record<string, any>>({
  config,
  className = '',
}: SmartFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(
    config.initialValues || {}
  );
  const [errors, setErrors] = useState<FormError[]>([]);
  const [touched, setTouched] = useState<Set<keyof T>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const validateField = useCallback(
    (field: FormField<T>, value: any): string | undefined => {
      if (field.required && !value) {
        return `${field.label}是必填项`;
      }

      if (field.validation) {
        const { pattern, minLength, maxLength, min, max, custom } = field.validation;

        if (pattern && value && !pattern.test(value)) {
          return `${field.label}格式不正确`;
        }

        if (minLength && value && value.length < minLength) {
          return `${field.label}至少需要${minLength}个字符`;
        }

        if (maxLength && value && value.length > maxLength) {
          return `${field.label}最多${maxLength}个字符`;
        }

        if (min !== undefined && value && Number(value) < min) {
          return `${field.label}不能小于${min}`;
        }

        if (max !== undefined && value && Number(value) > max) {
          return `${field.label}不能大于${max}`;
        }

        if (custom) {
          return custom(value);
        }
      }

      return undefined;
    },
    []
  );

  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      const updated = { ...formData, [name]: value };
      setFormData(updated);

      // 清除该字段的错误
      setErrors((prev) => prev.filter((e) => e.field !== String(name)));

      // 触发 onChange 回调
      if (config.onChange) {
        config.onChange(updated);
      }
    },
    [formData, config]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => new Set(prev).add(name));

      const field = config.fields.find((f) => f.name === name);
      if (field) {
        const error = validateField(field, formData[name]);
        if (error) {
          setErrors((prev) => [...prev, { field: String(name), message: error }]);
        }
      }
    },
    [formData, config.fields, validateField]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: FormError[] = [];

    config.fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors.push({ field: String(field.name), message: error });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [config.fields, formData, validateField]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setSubmitting(true);
    try {
      await config.onSubmit(formData as T);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
  };

  const renderField = (field: FormField<T>) => {
    const value = formData[field.name];
    const error = errors.find((e) => e.field === String(field.name));
    const isTouched = touched.has(field.name);

    const fieldError = isTouched ? error : undefined;

    const baseClasses =
      'w-full px-4 py-2 rounded-lg bg-cyber-dark/50 border-2 transition-all focus:outline-none focus:ring-2';
    const errorClasses = fieldError
      ? 'border-cyber-pink focus:ring-cyber-pink/50'
      : 'border-cyber-cyan/30 focus:border-cyber-cyan focus:ring-cyber-cyan/50';
    const disabledClasses = field.disabled
      ? 'opacity-50 cursor-not-allowed'
      : '';

    const renderInput = () => {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              name={String(field.name)}
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              required={field.required}
              rows={4}
              className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
            />
          );

        case 'select':
          return (
            <select
              name={String(field.name)}
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              disabled={field.disabled}
              required={field.required}
              className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
            >
              {field.placeholder && (
                <option value="">{field.placeholder}</option>
              )}
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'checkbox':
          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name={String(field.name)}
                checked={value || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                onBlur={() => handleBlur(field.name)}
                disabled={field.disabled}
                className="w-5 h-5 rounded border-2 border-cyber-cyan/30 text-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/50"
              />
              <span className="text-sm text-gray-400">{field.label}</span>
            </div>
          );

        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={String(field.name)}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    disabled={field.disabled}
                    className="w-5 h-5 border-2 border-cyber-cyan/30 text-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/50"
                  />
                  <span className="text-sm text-gray-400">{option.label}</span>
                </label>
              ))}
            </div>
          );

        case 'file':
          return (
            <input
              type="file"
              name={String(field.name)}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleChange(field.name, field.multiple ? Array.from(files) : files[0]);
                }
              }}
              onBlur={() => handleBlur(field.name)}
              disabled={field.disabled}
              required={field.required}
              accept={field.accept}
              multiple={field.multiple}
              className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
            />
          );

        default:
          return (
            <input
              type={field.type}
              name={String(field.name)}
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              required={field.required}
              autoComplete={field.autoComplete}
              accept={field.accept}
              min={field.validation?.min}
              max={field.validation?.max}
              step={field.type === 'range' ? 'any' : undefined}
              className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
            />
          );
      }
    };

    return (
      <motion.div
        key={String(field.name)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={field.type === 'checkbox' || field.type === 'radio' ? '' : 'space-y-2'}
      >
        {field.type !== 'checkbox' && field.type !== 'radio' && (
          <label className="block text-sm font-medium text-gray-300">
            {field.label}
            {field.required && <span className="text-cyber-pink ml-1">*</span>}
          </label>
        )}

        {renderInput()}

        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}

        {fieldError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-sm text-cyber-pink"
          >
            {fieldError.message}
          </motion.p>
        )}
      </motion.div>
    );
  };

  const getLayoutClasses = () => {
    switch (config.layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-6';
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-${config.columns || 2} gap-6`;
      case 'vertical':
      default:
        return 'space-y-6';
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className={getLayoutClasses()}>
        {config.fields.map(renderField)}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 rounded-lg bg-cyber-cyan text-black font-semibold hover:bg-cyber-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? '提交中...' : config.submitLabel || '提交'}
        </motion.button>

        {config.onCancel && (
          <motion.button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 rounded-lg border-2 border-gray-600 text-gray-300 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {config.cancelLabel || '取消'}
          </motion.button>
        )}
      </div>
    </form>
  );
}

export default SmartForm;
