'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';

export interface FieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | undefined;
  defaultValue?: any;
}

interface FormProps {
  fields: FieldConfig[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  className?: string;
}

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  submitting: boolean;
  submitError?: string;
  submitSuccess: boolean;
}

/**
 * 高级表单组件
 * 支持动态字段、验证、错误处理等功能
 */
export function AdvancedForm({
  fields,
  onSubmit,
  submitText = '提交',
  cancelText = '取消',
  onCancel,
  className = '',
}: FormProps) {
  const [form, setForm] = useState<FormState>({
    values: fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {}),
    errors: {},
    touched: {},
    submitting: false,
    submitSuccess: false,
  });

  // 验证单个字段
  const validateField = useCallback(
    (name: string, value: any): string | undefined => {
      const field = fields.find((f) => f.name === name);
      if (!field) return undefined;

      // 必填验证
      if (field.required && !value) {
        return `${field.label}是必填项`;
      }

      // 类型验证
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return '请输入有效的邮箱地址';
        }
      }

      if (field.type === 'number' && value) {
        if (isNaN(Number(value))) {
          return '请输入有效的数字';
        }
      }

      // 自定义验证
      if (field.validation) {
        return field.validation(value);
      }

      return undefined;
    },
    [fields]
  );

  // 验证所有字段
  const validateAll = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field.name, form.values[field.name]);
      if (error) {
        errors[field.name] = error;
        isValid = false;
      }
    });

    setForm((prev) => ({ ...prev, errors }));
    return isValid;
  }, [fields, form.values, validateField]);

  // 更新字段值
  const handleChange = useCallback(
    (name: string, value: any) => {
      setForm((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
        touched: { ...prev.touched, [name]: true },
      }));

      // 实时验证
      const error = validateField(name, value);
      setForm((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: error || '' },
      }));
    },
    [validateField]
  );

  // 处理字段失焦
  const handleBlur = useCallback(
    (name: string) => {
      setForm((prev) => ({
        ...prev,
        touched: { ...prev.touched, [name]: true },
      }));

      const error = validateField(name, form.values[name]);
      setForm((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: error || '' },
      }));
    },
    [form.values, validateField]
  );

  // 提交表单
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // 验证所有字段
      if (!validateAll()) {
        return;
      }

      setForm((prev) => ({ ...prev, submitting: true, submitError: undefined }));

      try {
        await onSubmit(form.values);
        setForm((prev) => ({ ...prev, submitSuccess: true, submitting: false }));
      } catch (error) {
        setForm((prev) => ({
          ...prev,
          submitting: false,
          submitError: error instanceof Error ? error.message : '提交失败，请重试',
        }));
      }
    },
    [form.values, validateAll, onSubmit]
  );

  // 渲染字段
  const renderField = (field: FieldConfig) => {
    const error = form.touched[field.name] ? form.errors[field.name] : '';
    const value = form.values[field.name];

    const baseInputClasses =
      'w-full px-4 py-2 bg-cyber-darker border rounded-lg focus:outline-none transition-all text-white placeholder-gray-500';

    const inputClasses = `${baseInputClasses} ${
      error ? 'border-red-500 focus:border-red-500' : 'border-cyber-border focus:border-cyber-cyan'
    }`;

    return (
      <motion.div
        key={field.name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {field.label}
          {field.required && <span className="text-cyber-pink ml-1">*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            className={`${inputClasses} min-h-[100px] resize-y`}
            disabled={form.submitting}
          />
        ) : field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            className={inputClasses}
            disabled={form.submitting}
          >
            <option value="">{field.placeholder || '请选择'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              onBlur={() => handleBlur(field.name)}
              className="w-4 h-4 rounded border-cyber-border text-cyber-cyan focus:ring-cyber-cyan"
              disabled={form.submitting}
            />
            <span className="text-sm text-gray-400">{field.placeholder}</span>
          </label>
        ) : field.type === 'radio' ? (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  className="w-4 h-4 border-cyber-border text-cyber-cyan focus:ring-cyber-cyan"
                  disabled={form.submitting}
                />
                <span className="text-sm text-gray-400">{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            className={inputClasses}
            disabled={form.submitting}
          />
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 text-xs text-red-500 flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {fields.map(renderField)}

      {/* 提交成功消息 */}
      <AnimatePresence>
        {form.submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-500 text-sm"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            提交成功！
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提交错误消息 */}
      <AnimatePresence>
        {form.submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500 text-sm"
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {form.submitError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 按钮组 */}
      <div className="flex gap-3">
        <motion.button
          type="submit"
          disabled={form.submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 cyber-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              提交中...
            </>
          ) : (
            submitText
          )}
        </motion.button>

        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={form.submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 border border-cyber-border rounded-lg text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </motion.button>
        )}
      </div>
    </form>
  );
}

/**
 * 表单字段构建器
 */
export class FormBuilder {
  private fields: FieldConfig[] = [];

  addField(field: FieldConfig): FormBuilder {
    this.fields.push(field);
    return this;
  }

  addText(name: string, label: string, options?: Partial<FieldConfig>): FormBuilder {
    return this.addField({ name, type: 'text', label, ...options });
  }

  addEmail(name: string, label: string, options?: Partial<FieldConfig>): FormBuilder {
    return this.addField({ name, type: 'email', label, ...options });
  }

  addPassword(name: string, label: string, options?: Partial<FieldConfig>): FormBuilder {
    return this.addField({ name, type: 'password', label, ...options });
  }

  addTextarea(name: string, label: string, options?: Partial<FieldConfig>): FormBuilder {
    return this.addField({ name, type: 'textarea', label, ...options });
  }

  addSelect(name: string, label: string, options: FieldConfig['options'], config?: Partial<FieldConfig>): FormBuilder {
    return this.addField({ name, type: 'select', label, options, ...config });
  }

  addCheckbox(name: string, label: string, options?: Partial<FieldConfig>): FormBuilder {
    return this.addField({ name, type: 'checkbox', label, ...options });
  }

  build(): FieldConfig[] {
    return [...this.fields];
  }
}
