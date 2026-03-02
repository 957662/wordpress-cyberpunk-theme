'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface FormFieldProps {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  description?: string;
  children: React.ReactElement;
}

/**
 * 表单字段包装器
 */
export function FormField({ label, error, success, required, description, children }: FormFieldProps) {
  const childProps = children.props as {
    id?: string;
    error?: boolean;
    success?: boolean;
    'aria-describedby'?: string;
  };

  const fieldId = childProps.id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const successId = `${fieldId}-success`;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-200"
        >
          {label}
          {required && <span className="text-cyber-pink ml-1">*</span>}
        </label>
      )}

      {children}

      {description && !error && !success && (
        <p id={descriptionId} className="text-xs text-gray-400">
          {description}
        </p>
      )}

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-cyber-pink flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}

        {success && !error && (
          <motion.p
            id={successId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-cyber-green flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 增强的输入框组件
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  description?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, icon, rightAddon, description, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === 'password';

    return (
      <FormField label={label} error={error} success={success} description={description}>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            {...props}
            type={isPassword && showPassword ? 'text' : props.type}
            className={`w-full px-4 py-2.5 rounded-lg bg-cyber-muted border border-cyber-border text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 focus:border-cyber-cyan transition-all ${
              icon ? 'pl-10' : ''
            } ${
              error ? 'border-cyber-pink focus:ring-cyber-pink/50' : ''
            } ${
              success ? 'border-cyber-green focus:ring-cyber-green/50' : ''
            } ${rightAddon ? 'pr-24' : ''} ${className}`}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          {rightAddon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightAddon}
            </div>
          )}
        </div>
      </FormField>
    )
);
Input.displayName = 'Input';

/**
 * 增强的文本域组件
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  description?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, success, description, showCharacterCount, maxLength, className = '', value, ...props }, ref) => {
    const characterCount = typeof value === 'string' ? value.length : 0;

    return (
      <FormField label={label} error={error} success={success} description={description}>
        <div className="relative">
          <textarea
            ref={ref}
            {...props}
            value={value}
            maxLength={maxLength}
            className={`w-full px-4 py-2.5 rounded-lg bg-cyber-muted border border-cyber-border text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 focus:border-cyber-cyan transition-all resize-y min-h-[100px] ${
              error ? 'border-cyber-pink focus:ring-cyber-pink/50' : ''
            } ${
              success ? 'border-cyber-green focus:ring-cyber-green/50' : ''
            } ${showCharacterCount || maxLength ? 'pb-8' : ''} ${className}`}
          />

          {(showCharacterCount || maxLength) && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {characterCount}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>
      </FormField>
    )
});
Textarea.displayName = 'Textarea';

/**
 * 增强的选择框组件
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: string;
  description?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, success, description, options, placeholder, className = '', ...props }, ref) => {
    return (
      <FormField label={label} error={error} success={success} description={description}>
        <div className="relative">
          <select
            ref={ref}
            {...props}
            className={`w-full px-4 py-2.5 rounded-lg bg-cyber-muted border border-cyber-border text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 focus:border-cyber-cyan transition-all appearance-none cursor-pointer ${
              error ? 'border-cyber-pink focus:ring-cyber-pink/50' : ''
            } ${
              success ? 'border-cyber-green focus:ring-cyber-green/50' : ''
            } ${className}`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </FormField>
    )
});
Select.displayName = 'Select';

/**
 * 增强的复选框组件
 */
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, className = '', ...props }, ref) => {
    const id = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div>
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            {...props}
            id={id}
            type="checkbox"
            className={`mt-0.5 w-5 h-5 rounded bg-cyber-muted border-2 border-cyber-border text-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/50 focus:ring-offset-0 focus:border-cyber-cyan transition-all cursor-pointer ${
              error ? 'border-cyber-pink' : ''
            } ${className}`}
          />

          {label && (
            <label
              htmlFor={id}
              className="text-sm text-gray-200 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>

        {description && !error && (
          <p className="mt-1 text-xs text-gray-400 ml-8">{description}</p>
        )}

        {error && (
          <p className="mt-1 text-xs text-cyber-pink flex items-center gap-1 ml-8">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    )
});
Checkbox.displayName = 'Checkbox';

/**
 * 表单提交按钮组件
 */
interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ isSubmitting = false, submitText = '提交', submittingText = '提交中...', className = '', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="submit"
        disabled={isSubmitting || props.disabled}
        whileHover={{ scale: !isSubmitting && !props.disabled ? 1.02 : 1 }}
        whileTap={{ scale: !isSubmitting && !props.disabled ? 0.98 : 1 }}
        className={`w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-semibold shadow-lg hover:shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
        {...props}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {submittingText}
          </span>
        ) : (
          submitText
        )}
      </motion.button>
    )
});
SubmitButton.displayName = 'SubmitButton';
