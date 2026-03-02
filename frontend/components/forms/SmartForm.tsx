/**
 * 智能表单组件
 * 支持动态字段、条件显示、自动验证、AI辅助
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';
import {
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
  conditional?: {
    field: string;
    value: any;
    operator?: 'eq' | 'neq' | 'contains';
  };
  helpText?: string;
  aiSuggestion?: boolean;
}

export interface SmartFormProps {
  fields: FormField[];
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  onChange?: (data: Record<string, any>, isValid: boolean) => void;
  submitText?: string;
  showProgress?: boolean;
  enableAI?: boolean;
  className?: string;
}

export function SmartForm({
  fields,
  onSubmit,
  onChange,
  submitText = '提交',
  showProgress = true,
  enableAI = false,
  className
}: SmartFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initial[field.id] = field.defaultValue;
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});

  // 验证单个字段
  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label}是必填项`;
    }

    if (field.validation && value) {
      const { min, max, pattern, custom } = field.validation;

      if (min && typeof value === 'string' && value.length < min) {
        return `${field.label}最少需要${min}个字符`;
      }

      if (max && typeof value === 'string' && value.length > max) {
        return `${field.label}最多${max}个字符`;
      }

      if (min && typeof value === 'number' && value < min) {
        return `${field.label}不能小于${min}`;
      }

      if (max && typeof value === 'number' && value > max) {
        return `${field.label}不能大于${max}`;
      }

      if (pattern && !pattern.test(value)) {
        return `${field.label}格式不正确`;
      }

      if (custom) {
        return custom(value);
      }
    }

    return null;
  };

  // 验证整个表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    visibleFields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 计算可见字段（条件显示）
  const visibleFields = fields.filter(field => {
    if (!field.conditional) return true;

    const { field: conditionField, value: conditionValue, operator = 'eq' } = field.conditional;
    const fieldValue = formData[conditionField];

    switch (operator) {
      case 'eq':
        return fieldValue === conditionValue;
      case 'neq':
        return fieldValue !== conditionValue;
      case 'contains':
        return Array.isArray(fieldValue) ? fieldValue.includes(conditionValue) : false;
      default:
        return true;
    }
  });

  // 计算表单进度
  const progress = React.useMemo(() => {
    const requiredFields = visibleFields.filter(f => f.required);
    const filledRequiredFields = requiredFields.filter(
      f => formData[f.id] && formData[f.id] !== ''
    );
    return requiredFields.length > 0
      ? (filledRequiredFields.length / requiredFields.length) * 100
      : 100;
  }, [formData, visibleFields]);

  // 表单是否有效
  const isFormValid = React.useMemo(() => {
    return Object.keys(errors).length === 0 && progress === 100;
  }, [errors, progress]);

  // 更新表单数据
  const handleChange = (fieldId: string, value: any) => {
    const newFormData = { ...formData, [fieldId]: value };
    setFormData(newFormData);

    const field = fields.find(f => f.id === fieldId);
    if (field && touched[fieldId]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldId]: error || ''
      }));
    }

    if (onChange) {
      onChange(newFormData, isFormValid);
    }
  };

  // 处理失焦验证
  const handleBlur = (fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));

    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, formData[fieldId]);
      setErrors(prev => ({
        ...prev,
        [fieldId]: error || ''
      }));
    }
  };

  // AI 建议生成
  const generateAISuggestion = async (field: FormField) => {
    if (!enableAI || !field.aiSuggestion) return;

    setLoadingAI(prev => ({ ...prev, [field.id]: true }));

    // 模拟AI生成
    setTimeout(() => {
      const suggestions: Record<string, string> = {
        username: 'cyber_user_' + Math.floor(Math.random() * 1000),
        email: 'user' + Math.floor(Math.random() * 1000) + '@example.com',
        password: 'Secure@Pass123',
        bio: '这是一段自动生成的个人简介...',
        description: '这是一个自动生成的描述...'
      };

      setAiSuggestions(prev => ({
        ...prev,
        [field.id]: suggestions[field.id] || '建议内容'
      }));

      setLoadingAI(prev => ({ ...prev, [field.id]: false }));
    }, 1000);
  };

  // 应用AI建议
  const applySuggestion = (fieldId: string) => {
    if (aiSuggestions[fieldId]) {
      handleChange(fieldId, aiSuggestions[fieldId]);
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('表单提交错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* 进度条 */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-cyber-muted">表单完成度</span>
            <span className="text-sm font-semibold text-cyber-cyan">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* 成功提示 */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert
              variant="success"
              message="表单提交成功！"
              icon={<Check className="w-5 h-5" />}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 表单字段 */}
      <div className="space-y-4">
        {visibleFields.map((field) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4">
              <div className="space-y-3">
                {/* 标签 */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  <div className="flex items-center gap-2">
                    {field.helpText && (
                      <div className="group relative">
                        <HelpCircle className="w-4 h-4 text-cyber-muted cursor-help" />
                        <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-cyber-card border border-cyber-border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {field.helpText}
                        </div>
                      </div>
                    )}

                    {enableAI && field.aiSuggestion && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => generateAISuggestion(field)}
                        className="flex items-center gap-1 text-xs text-cyber-purple hover:text-cyber-purple/80"
                        disabled={loadingAI[field.id]}
                      >
                        <Sparkles className={cn('w-3 h-3', loadingAI[field.id] && 'animate-spin')} />
                        AI建议
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* 输入控件 */}
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onBlur={() => handleBlur(field.id)}
                    placeholder={field.placeholder}
                    className={cn(
                      'w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-cyan resize-none',
                      errors[field.id] && touched[field.id] && 'border-red-500'
                    )}
                    rows={4}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onBlur={() => handleBlur(field.id)}
                    className={cn(
                      'w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-cyan',
                      errors[field.id] && touched[field.id] && 'border-red-500'
                    )}
                  >
                    <option value="">{field.placeholder || '请选择...'}</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[field.id] || false}
                      onChange={(e) => handleChange(field.id, e.target.checked)}
                      onBlur={() => handleBlur(field.id)}
                      className="w-4 h-4 accent-cyber-cyan"
                    />
                    <span className="text-sm">{field.placeholder}</span>
                  </label>
                ) : (
                  <Input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onBlur={() => handleBlur(field.id)}
                    placeholder={field.placeholder}
                    error={errors[field.id] && touched[field.id] ? errors[field.id] : undefined}
                  />
                )}

                {/* AI建议 */}
                {aiSuggestions[field.id] && !formData[field.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 bg-cyber-purple/10 border border-cyber-purple/30 rounded text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-cyber-purple">{aiSuggestions[field.id]}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => applySuggestion(field.id)}
                      >
                        采用
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* 错误提示 */}
                <AnimatePresence>
                  {errors[field.id] && touched[field.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-xs text-red-500"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors[field.id]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 提交按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isFormValid || isSubmitting}
          isLoading={isSubmitting}
        >
          {submitText}
        </Button>
      </motion.div>
    </form>
  );
}
