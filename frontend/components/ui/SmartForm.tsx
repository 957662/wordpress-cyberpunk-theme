'use client';

/**
 * Smart Form Component
 * 智能表单组件 - 支持动态验证、自动保存、字段联动
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';

// 类型定义
type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';

type Validator = (value: any, formData?: Record<string, any>) => string | null;

interface FieldOption {
  label: string;
  value: any;
  disabled?: boolean;
}

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FieldOption[];
  validators?: Validator[];
  dependsOn?: string;
  defaultValue?: any;
  autoComplete?: string;
  accept?: string; // for file input
}

interface FormConfig {
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
  showSuccess?: boolean;
}

interface FormData {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
}

export function SmartForm({
  fields,
  initialValues = {},
  onSubmit,
  submitText = '提交',
  cancelText,
  onCancel,
  autoSave = false,
  autoSaveDelay = 1000,
  showSuccess = true,
}: FormConfig) {
  const [formData, setFormData] = useState<FormData>({
    values: { ...initialValues },
    errors: {},
    touched: {},
    dirty: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 验证单个字段
  const validateField = useCallback((field: FieldConfig, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label}是必填项`;
    }

    if (field.validators) {
      for (const validator of field.validators) {
        const error = validator(value, formData.values);
        if (error) return error;
      }
    }

    return null;
  }, [formData.values]);

  // 验证所有字段
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData.values[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setFormData(prev => ({ ...prev, errors: newErrors }));
    return isValid;
  }, [fields, formData.values, validateField]);

  // 更新字段值
  const updateField = useCallback((name: string, value: any) => {
    setFormData(prev => {
      const newValues = { ...prev.values, [name]: value };
      const field = fields.find(f => f.name === name);
      const error = field ? validateField(field, value) : null;

      return {
        ...prev,
        values: newValues,
        errors: { ...prev.errors, [name]: error || '' },
        touched: { ...prev.touched, [name]: true },
        dirty: { ...prev.dirty, [name]: prev.values[name] !== value },
      };
    });
  }, [fields, validateField]);

  // 处理字段变化
  const handleFieldChange = useCallback((name: string, value: any) => {
    updateField(name, value);

    // 检查依赖字段
    const field = fields.find(f => f.name === name);
    if (field?.dependsOn) {
      // 当依赖字段变化时，可能需要清除或重置其他字段
      const dependentFields = fields.filter(f => f.dependsOn === name);
      dependentFields.forEach(dependentField => {
        if (formData.values[dependentField.name]) {
          updateField(dependentField.name, dependentField.defaultValue || '');
        }
      });
    }
  }, [fields, updateField, formData.values]);

  // 处理提交
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await onSubmit(formData.values);
      setSubmitSuccess(true);

      // 重置表单
      if (showSuccess) {
        setTimeout(() => {
          setFormData({
            values: { ...initialValues },
            errors: {},
            touched: {},
            dirty: {},
          });
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('表单提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.values, validateForm, onSubmit, initialValues, showSuccess]);

  // 自动保存
  useEffect(() => {
    if (!autoSave) return;

    const hasDirtyFields = Object.values(formData.dirty).some(Boolean);
    if (!hasDirtyFields) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        // 这里应该调用自动保存的API
        console.log('自动保存:', formData.values);
        await new Promise(resolve => setTimeout(resolve, 500));
        setFormData(prev => ({ ...prev, dirty: {} }));
      } catch (error) {
        console.error('自动保存失败:', error);
      } finally {
        setIsSaving(false);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [formData.values, formData.dirty, autoSave, autoSaveDelay]);

  // 渲染字段
  const renderField = (field: FieldConfig) => {
    const error = formData.errors[field.name];
    const touched = formData.touched[field.name];
    const disabled = field.disabled || isSubmitting;
    const showError = touched && error;

    // 检查依赖条件
    if (field.dependsOn) {
      const dependentValue = formData.values[field.dependsOn];
      if (!dependentValue) return null;
    }

    const baseInputClasses = `
      w-full px-4 py-2 rounded-lg border transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      ${showError ? 'border-red-500' : 'border-gray-700'}
    `;

    return (
      <div key={field.name} className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            value={formData.values[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            rows={4}
            className={baseInputClasses}
          />
        ) : field.type === 'select' ? (
          <select
            value={formData.values[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            disabled={disabled}
            className={baseInputClasses}
          >
            <option value="">{field.placeholder || '请选择'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.values[field.name] || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded border-gray-700 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-400">{field.placeholder}</span>
          </div>
        ) : field.type === 'radio' ? (
          <div className="flex flex-col gap-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={formData.values[field.name] === option.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  disabled={disabled || option.disabled}
                  className="w-4 h-4 border-gray-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-400">{option.label}</span>
              </label>
            ))}
          </div>
        ) : field.type === 'file' ? (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFieldChange(field.name, file);
            }}
            disabled={disabled}
            accept={field.accept}
            className={baseInputClasses}
          />
        ) : (
          <input
            type={field.type}
            value={formData.values[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            autoComplete={field.autoComplete}
            className={baseInputClasses}
          />
        )}

        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1 text-red-500 text-xs"
            >
              <X size={12} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 自动保存指示器 */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            <Loader2 size={16} className="animate-spin" />
            <span>正在保存...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 表单字段 */}
      <div className="space-y-4">
        {fields.map(renderField)}
      </div>

      {/* 成功消息 */}
      <AnimatePresence>
        {submitSuccess && showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-green-500/20 border border-green-500 text-green-500"
          >
            <Check size={20} />
            <span>提交成功！</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 操作按钮 */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || isSaving}
          className="flex-1 px-6 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>提交中...</span>
            </>
          ) : (
            submitText
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
        )}
      </div>
    </form>
  );
}

// 常用验证器
export const Validators = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : '请输入有效的邮箱地址';
  },

  phone: (value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(value) ? null : '请输入有效的手机号码';
  },

  minLength: (min: number) => (value: string) => {
    return value.length >= min ? null : `至少需要 ${min} 个字符`;
  },

  maxLength: (max: number) => (value: string) => {
    return value.length <= max ? null : `最多只能 ${max} 个字符`;
  },

  pattern: (regex: RegExp, message: string) => (value: string) => {
    return regex.test(value) ? null : message;
  },

  match: (fieldName: string, formData?: Record<string, any>) => (value: string) => {
    if (!formData) return null;
    return value === formData[fieldName] ? null : `两次输入不一致`;
  },
};

export default SmartForm;
