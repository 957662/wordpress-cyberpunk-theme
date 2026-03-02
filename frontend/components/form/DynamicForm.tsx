'use client';

/**
 * DynamicForm Component - 动态表单组件
 * 支持动态字段、验证、多步表单、条件显示
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

// 字段类型
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

// 验证规则
export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validate?: (value: any) => boolean | Promise<boolean>;
}

// 字段配置
export interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  validation?: ValidationRule[];
  disabled?: boolean;
  className?: string;
  conditional?: {
    field: string;
    value: any;
  };
  hint?: string;
  attributes?: Record<string, any>;
}

// 步骤配置
export interface StepConfig {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

// 表单Props
export interface DynamicFormProps {
  /** 字段配置（单步表单） */
  fields?: FieldConfig[];
  /** 步骤配置（多步表单） */
  steps?: StepConfig[];
  /** 提交回调 */
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  /** 初始值 */
  initialValues?: Record<string, any>;
  /** 是否多步表单 */
  multiStep?: boolean;
  /** 提交按钮文本 */
  submitText?: string;
  /** 取消回调 */
  onCancel?: () => void;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 字段值变化回调 */
  onFieldChange?: (name: string, value: any) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 是否显示进度条 */
  showProgress?: boolean;
}

export function DynamicForm({
  fields: singleStepFields,
  steps,
  onSubmit,
  initialValues = {},
  multiStep = false,
  submitText = '提交',
  onCancel,
  cancelText = '取消',
  onFieldChange,
  className = '',
  showProgress = true,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取当前步骤的字段
  const getCurrentFields = useCallback((): FieldConfig[] => {
    if (multiStep && steps) {
      return steps[currentStep]?.fields || [];
    }
    return singleStepFields || [];
  }, [multiStep, steps, currentStep, singleStepFields]);

  // 验证单个字段
  const validateField = useCallback((field: FieldConfig, value: any): string | null => {
    if (!field.validation) return null;

    for (const rule of field.validation) {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && !value.trim())) {
            return rule.message;
          }
          break;

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return rule.message;
          }
          break;

        case 'min':
          if (typeof value === 'string' && value.length < rule.value) {
            return rule.message;
          }
          if (typeof value === 'number' && value < rule.value) {
            return rule.message;
          }
          break;

        case 'max':
          if (typeof value === 'string' && value.length > rule.value) {
            return rule.message;
          }
          if (typeof value === 'number' && value > rule.value) {
            return rule.message;
          }
          break;

        case 'pattern':
          if (value && !new RegExp(rule.value).test(value)) {
            return rule.message;
          }
          break;

        case 'custom':
          if (rule.validate) {
            const isValid = rule.validate(value);
            if (typeof isValid === 'boolean' ? !isValid : !(isValid as Promise<boolean>)) {
              return rule.message;
            }
          }
          break;
      }
    }

    return null;
  }, []);

  // 验证当前步骤
  const validateCurrentStep = useCallback((): boolean => {
    const currentFields = getCurrentFields();
    const newErrors: Record<string, string> = {};

    for (const field of currentFields) {
      // 检查条件显示
      if (field.conditional) {
        const { field: conditionalField, value: conditionalValue } = field.conditional;
        if (formData[conditionalField] !== conditionalValue) {
          continue;
        }
      }

      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [getCurrentFields, formData, validateField]);

  // 处理字段变化
  const handleFieldChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // 清除该字段的错误
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    onFieldChange?.(name, value);
  }, [onFieldChange]);

  // 处理字段失焦
  const handleFieldBlur = useCallback((field: FieldConfig) => {
    setTouched((prev) => ({ ...prev, [field.name]: true }));

    const error = validateField(field, formData[field.name]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field.name]: error }));
    }
  }, [formData, validateField]);

  // 检查字段是否应该显示
  const isFieldVisible = useCallback((field: FieldConfig): boolean => {
    if (!field.conditional) return true;
    return formData[field.conditional.field] === field.conditional.value;
  }, [formData]);

  // 渲染字段
  const renderField = (field: FieldConfig) => {
    if (!isFieldVisible(field)) return null;

    const value = formData[field.name] ?? field.defaultValue ?? '';
    const error = touched[field.name] ? errors[field.name] : undefined;
    const hasError = !!error;

    const fieldClassName = `
      cyber-input
      ${hasError ? 'border-red-500 focus:border-red-500' : ''}
      ${field.className || ''}
    `;

    return (
      <motion.div
        key={field.name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        {field.label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {field.label}
            {field.validation?.some((v) => v.type === 'required') && (
              <span className="text-red-400 ml-1">*</span>
            )}
          </label>
        )}

        {field.type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={fieldClassName}
            rows={4}
            {...field.attributes}
          />
        ) : field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            disabled={field.disabled}
            className={fieldClassName}
            {...field.attributes}
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
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              onBlur={() => handleFieldBlur(field)}
              disabled={field.disabled}
              className="w-5 h-5 rounded border-cyber-border text-cyber-cyan focus:ring-cyber-cyan"
              {...field.attributes}
            />
            <span className="text-sm text-gray-300">{field.placeholder}</span>
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
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  disabled={field.disabled}
                  className="w-5 h-5 text-cyber-cyan focus:ring-cyber-cyan"
                  {...field.attributes}
                />
                <span className="text-sm text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={fieldClassName}
            {...field.attributes}
          />
        )}

        {field.hint && !hasError && (
          <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
        )}

        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  };

  // 下一步
  const handleNext = async () => {
    const isValid = validateCurrentStep();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, (steps?.length || 1) - 1));
    }
  };

  // 上一步
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateCurrentStep();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentFields = getCurrentFields();
  const totalSteps = steps?.length || 1;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* 进度条 */}
      {multiStep && showProgress && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps?.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${index <= currentStep
                      ? 'bg-cyber-cyan text-cyber-dark'
                      : 'bg-cyber-card text-gray-400'
                    }
                  `}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${index < currentStep ? 'bg-cyber-cyan' : 'bg-cyber-card'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 进度条 */}
          <div className="h-2 bg-cyber-card rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* 步骤标题 */}
      {multiStep && steps && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h2>
            {steps[currentStep].description && (
              <p className="text-gray-400">{steps[currentStep].description}</p>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* 表单字段 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={multiStep ? currentStep : 'fields'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentFields.map(renderField)}
        </motion.div>
      </AnimatePresence>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between gap-4 mt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-cyber-border text-gray-400 rounded hover:text-white hover:border-cyber-cyan transition-colors"
          >
            {cancelText}
          </button>
        )}

        <div className="flex gap-4 ml-auto">
          {multiStep && currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 py-2 bg-cyber-card text-white rounded hover:bg-cyber-card/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              上一步
            </button>
          )}

          {multiStep && !isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-cyber-cyan text-cyber-dark font-semibold rounded hover:bg-cyber-cyan/90 transition-colors"
            >
              下一步
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {submitText}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default DynamicForm;
