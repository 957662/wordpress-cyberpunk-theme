/**
 * 赛博朋克风格表单组件
 * 带有霓虹发光效果和动画的表单元素
 */

'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// 基础输入框组件
export interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, label, error, helperText, icon, color = 'cyan', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const colors = {
      cyan: {
        border: 'border-cyber-cyan',
        text: 'text-cyber-cyan',
        bg: 'bg-cyber-cyan',
        glow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]',
      },
      purple: {
        border: 'border-cyber-purple',
        text: 'text-cyber-purple',
        bg: 'bg-cyber-purple',
        glow: 'shadow-[0_0_15px_rgba(157,0,255,0.3)]',
      },
      pink: {
        border: 'border-cyber-pink',
        text: 'text-cyber-pink',
        bg: 'bg-cyber-pink',
        glow: 'shadow-[0_0_15px_rgba(255,0,128,0.3)]',
      },
      green: {
        border: 'border-cyber-green',
        text: 'text-cyber-green',
        bg: 'bg-cyber-green',
        glow: 'shadow-[0_0_15px_rgba(0,255,136,0.3)]',
      },
    };

    const currentColor = colors[color];

    return (
      <div className="space-y-2">
        {label && (
          <label className={cn('text-sm font-medium', currentColor.text, error && 'text-red-400')}>
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type === 'password' && showPassword ? 'text' : type}
            className={cn(
              'w-full px-4 py-3 rounded-lg bg-cyber-darker',
              'border border-cyber-border',
              'text-white placeholder:text-gray-500',
              'transition-all duration-300',
              'focus:outline-none',
              icon && 'pl-10',
              type === 'password' && 'pr-10',
              error && 'border-red-400 focus:border-red-400',
              !error && isFocused && `${currentColor.border} ${currentColor.glow}`,
              !error && !isFocused && 'hover:border-cyber-border/80',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* 聚焦发光效果 */}
          {!error && isFocused && (
            <motion.div
              className={cn('absolute inset-0 rounded-lg pointer-events-none', currentColor.border)}
              style={{ borderWidth: '2px' }}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}

          {/* 状态图标 */}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className="flex items-center gap-1 text-xs">
            {error ? (
              <>
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="text-red-400">{error}</span>
              </>
            ) : (
              <>
                <Info className="w-3 h-3 text-gray-500" />
                <span className="text-gray-500">{helperText}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

// 文本域组件
export interface CyberTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  autoResize?: boolean;
}

export const CyberTextarea = forwardRef<HTMLTextAreaElement, CyberTextareaProps>(
  ({ className, label, error, helperText, color = 'cyan', autoResize = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const colors = {
      cyan: { border: 'border-cyber-cyan', glow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]' },
      purple: { border: 'border-cyber-purple', glow: 'shadow-[0_0_15px_rgba(157,0,255,0.3)]' },
      pink: { border: 'border-cyber-pink', glow: 'shadow-[0_0_15px_rgba(255,0,128,0.3)]' },
      green: { border: 'border-cyber-green', glow: 'shadow-[0_0_15px_rgba(0,255,136,0.3)]' },
    };

    const currentColor = colors[color];

    return (
      <div className="space-y-2">
        {label && (
          <label className={cn('text-sm font-medium', color === 'cyan' && 'text-cyber-cyan', error && 'text-red-400')}>
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-lg bg-cyber-darker',
              'border border-cyber-border',
              'text-white placeholder:text-gray-500',
              'transition-all duration-300',
              'focus:outline-none resize-none',
              error && 'border-red-400 focus:border-red-400',
              !error && isFocused && `${currentColor.border} ${currentColor.glow}`,
              !error && !isFocused && 'hover:border-cyber-border/80',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <div className="text-xs">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <span className="text-gray-500">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

CyberTextarea.displayName = 'CyberTextarea';

// 选择框组件
export interface CyberSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}

export const CyberSelect = forwardRef<HTMLSelectElement, CyberSelectProps>(
  ({ className, label, error, helperText, options, color = 'cyan', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const colors = {
      cyan: { border: 'border-cyber-cyan', glow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]' },
      purple: { border: 'border-cyber-purple', glow: 'shadow-[0_0_15px_rgba(157,0,255,0.3)]' },
      pink: { border: 'border-cyber-pink', glow: 'shadow-[0_0_15px_rgba(255,0,128,0.3)]' },
      green: { border: 'border-cyber-green', glow: 'shadow-[0_0_15px_rgba(0,255,136,0.3)]' },
    };

    const currentColor = colors[color];

    return (
      <div className="space-y-2">
        {label && (
          <label className={cn('text-sm font-medium', color === 'cyan' && 'text-cyber-cyan', error && 'text-red-400')}>
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-lg bg-cyber-darker',
              'border border-cyber-border',
              'text-white',
              'transition-all duration-300',
              'focus:outline-none appearance-none',
              'cursor-pointer',
              error && 'border-red-400 focus:border-red-400',
              !error && isFocused && `${currentColor.border} ${currentColor.glow}`,
              !error && !isFocused && 'hover:border-cyber-border/80',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          {/* 自定义箭头 */}
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            animate={{ rotate: isFocused ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        {(error || helperText) && (
          <div className="text-xs">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <span className="text-gray-500">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

CyberSelect.displayName = 'CyberSelect';

// 复选框组件
export interface CyberCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}

export const CyberCheckbox = forwardRef<HTMLInputElement, CyberCheckboxProps>(
  ({ className, label, error, color = 'cyan', ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(props.checked || false);

    const colors = {
      cyan: 'bg-cyber-cyan border-cyber-cyan',
      purple: 'bg-cyber-purple border-cyber-purple',
      pink: 'bg-cyber-pink border-cyber-pink',
      green: 'bg-cyber-green border-cyber-green',
    };

    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              props.onChange?.(e);
            }}
            {...props}
          />
          <motion.div
            className={cn(
              'w-5 h-5 rounded border-2 cursor-pointer transition-all',
              error && 'border-red-400',
              !error && 'border-cyber-border hover:border-gray-400',
              isChecked && !error && colors[color],
              isChecked && 'shadow-lg'
            )}
            animate={isChecked ? { scale: [1, 0.8, 1] } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              const input = document.querySelector(`input[name="${props.name}"]`) as HTMLInputElement;
              input?.click();
            }}
          >
            {isChecked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center h-full text-white"
              >
                <CheckCircle className="w-3 h-3" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {label && (
          <label className="text-sm text-gray-300 cursor-pointer" onClick={() => {
            const input = document.querySelector(`input[name="${props.name}"]`) as HTMLInputElement;
            input?.click();
          }}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

CyberCheckbox.displayName = 'CyberCheckbox';
