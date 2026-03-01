'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * FormBuilder - 动态表单构建器组件
 * 支持动态添加/删除字段、表单验证、自定义样式
 */

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
  | 'range';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string; // For file inputs
  multiple?: boolean; // For file select
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | undefined;
  };
  className?: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface FormConfig {
  fields: FormField[];
  title?: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  showSubmit?: boolean;
  submitDisabled?: boolean;
  className?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: 1 | 2 | 3;
}

export interface FormBuilderProps extends FormConfig {
  initialValues?: Record<string, any>;
  onChange?: (data: Record<string, any>, isValid: boolean) => void;
  realtimeValidation?: boolean;
}

// ==================== 表单字段组件 ====================

interface FormFieldComponentProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  field,
  value,
  error,
  onChange,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = cn(
    'w-full px-4 py-2 rounded-lg border',
    'bg-gray-900/50 text-white placeholder-gray-500',
    'focus:outline-none focus:border-cyan-500/60',
    'transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error && 'border-red-500/60',
    isFocused && !error && 'border-cyan-500/60 shadow-lg shadow-cyan-500/10',
    field.className
  );

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onFocus={() => setIsFocused(true)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            rows={4}
            className={cn(baseClasses, 'resize-none')}
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onFocus={() => setIsFocused(true)}
            disabled={field.disabled}
            required={field.required}
            className={baseClasses}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name={field.name}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              onFocus={() => setIsFocused(true)}
              disabled={field.disabled}
              required={field.required}
              className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
            />
            <span className="text-gray-300">{field.label}</span>
          </label>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  onFocus={() => setIsFocused(true)}
                  disabled={field.disabled}
                  required={field.required}
                  className="w-4 h-4 border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-6',
              'transition-all duration-200',
              isFocused ? 'border-cyan-500/60 bg-cyan-500/5' : 'border-gray-700 hover:border-gray-600'
            )}
          >
            <input
              type="file"
              name={field.name}
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  onChange(field.multiple ? Array.from(files) : files[0]);
                }
              }}
              onBlur={onBlur}
              onFocus={() => setIsFocused(true)}
              disabled={field.disabled}
              required={field.required}
              accept={field.accept}
              multiple={field.multiple}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-400">
                {field.placeholder || 'Click to upload or drag and drop'}
              </p>
            </div>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              name={field.name}
              value={value || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              onBlur={onBlur}
              onFocus={() => setIsFocused(true)}
              disabled={field.disabled}
              required={field.required}
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{field.min || 0}</span>
              <span className="text-cyan-400 font-medium">{value || 0}</span>
              <span>{field.max || 100}</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative">
            {field.icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {field.icon}
              </div>
            )}
            <input
              type={field.type}
              name={field.name}
              value={value || ''}
              onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
              onBlur={onBlur}
              onFocus={() => setIsFocused(true)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              required={field.required}
              min={field.min}
              max={field.max}
              step={field.step}
              className={cn(baseClasses, field.icon && 'pl-10')}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-1">
      {field.type !== 'checkbox' && field.type !== 'radio' && (
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          {field.label}
          {field.required && <span className="text-red-400">*</span>}
        </label>
      )}

      {renderField()}

      {field.description && (
        <p className="text-xs text-gray-500 mt-1">{field.description}</p>
      )}

      {error && (
        <motion.p
          className="text-xs text-red-400 mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ==================== 表单构建器主组件 ====================

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  title,
  description,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
  showSubmit = true,
  submitDisabled = false,
  initialValues = {},
  onChange,
  realtimeValidation = true,
  className,
  layout = 'vertical',
  columns = 1,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (field: FormField, value: any): string | undefined => {
      // Required validation
      if (field.required && !value) {
        return `${field.label} is required`;
      }

      // Type-specific validation
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
      }

      // Custom validation
      if (field.validation) {
        const { pattern, minLength, maxLength, min, max, custom } = field.validation;

        if (pattern && value && !pattern.test(value)) {
          return `${field.label} format is invalid`;
        }

        if (minLength && typeof value === 'string' && value.length < minLength) {
          return `${field.label} must be at least ${minLength} characters`;
        }

        if (maxLength && typeof value === 'string' && value.length > maxLength) {
          return `${field.label} must be no more than ${maxLength} characters`;
        }

        if (min !== undefined && typeof value === 'number' && value < min) {
          return `${field.label} must be at least ${min}`;
        }

        if (max !== undefined && typeof value === 'number' && value > max) {
          return `${field.label} must be no more than ${max}`;
        }

        if (custom) {
          return custom(value);
        }
      }

      return undefined;
    },
    []
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [fields, formData, validateField]);

  // Handle field change
  const handleFieldChange = (fieldName: string, value: any) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);

    if (realtimeValidation && touched[fieldName]) {
      const field = fields.find((f) => f.name === fieldName);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [fieldName]: error || '' }));
      }
    }

    // Check if form is valid
    const isValid = fields.every((field) => {
      if (field.required && !newFormData[field.name]) return false;
      const error = validateField(field, newFormData[field.name]);
      return !error;
    });

    onChange?.(newFormData, isValid);
  };

  // Handle field blur
  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    if (realtimeValidation) {
      const field = fields.find((f) => f.name === fieldName);
      if (field) {
        const error = validateField(field, formData[fieldName]);
        setErrors((prev) => ({ ...prev, [fieldName]: error || '' }));
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Layout classes
  const layoutClasses = {
    vertical: 'space-y-6',
    horizontal: 'space-y-6',
    grid: `grid grid-cols-1 md:grid-cols-${columns} gap-6`,
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center">
          {title && (
            <motion.h2
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      )}

      {/* Fields */}
      <div className={layoutClasses[layout]}>
        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <FormFieldComponent
                field={field}
                value={formData[field.name]}
                error={errors[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                onBlur={() => handleFieldBlur(field.name)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      {(showSubmit || onCancel) && (
        <motion.div
          className="flex items-center justify-end gap-3 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {cancelLabel}
            </motion.button>
          )}

          {showSubmit && (
            <motion.button
              type="submit"
              disabled={submitDisabled || isSubmitting}
              className="px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={submitDisabled || isSubmitting ? {} : { scale: 1.02 }}
              whileTap={submitDisabled || isSubmitting ? {} : { scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                submitLabel
              )}
            </motion.button>
          )}
        </motion.div>
      )}
    </form>
  );
};

// ==================== Hook: useFormBuilder ====================

export const useFormBuilder = (config: FormConfig) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const updateField = (name: string, value: any) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    return newData;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    config.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        valid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(valid);
    return valid;
  };

  const reset = () => {
    setFormData({});
    setErrors({});
    setIsValid(false);
  };

  return {
    formData,
    errors,
    isValid,
    updateField,
    validate,
    reset,
  };
};

export default FormBuilder;
