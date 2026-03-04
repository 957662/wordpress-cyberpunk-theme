/**
 * CyberPress Platform - OTPInput Component
 * OTP 验证码输入组件 - 赛博朋克风格
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  type?: 'text' | 'number';
  separator?: string;
  separatorPosition?: number;
  className?: string;
  inputClassName?: string;
}

export function OTPInput({
  length = 6,
  value: controlledValue,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  errorMessage,
  type = 'text',
  separator,
  separatorPosition,
  className,
  inputClassName,
}: OTPInputProps) {
  const [value, setValue] = useState(controlledValue || '');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 受控模式
  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = (index: number, inputValue: string) => {
    // 只允许数字或字母
    const regex = type === 'number' ? /^[0-9]$/ : /^[a-zA-Z0-9]$/;
    if (inputValue && !regex.test(inputValue)) {
      return;
    }

    const newValue = value.split('');
    newValue[index] = inputValue.toUpperCase();
    const result = newValue.join('');

    setValue(result);
    onChange?.(result);

    // 自动聚焦下一个输入框
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // 完成输入
    if (result.length === length && onComplete) {
      onComplete(result);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // 删除键
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // 左右箭头键
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // 粘贴
    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      navigator.clipboard.readText().then((text) => {
        const regex = type === 'number' ? /^[0-9]+$/ : /^[a-zA-Z0-9]+$/;
        if (regex.test(text)) {
          const pasteValue = text.slice(0, length - index);
          const newValue = value.split('');
          for (let i = 0; i < pasteValue.length; i++) {
            newValue[index + i] = pasteValue[i].toUpperCase();
          }
          const result = newValue.join('');
          setValue(result);
          onChange?.(result);

          if (result.length === length && onComplete) {
            onComplete(result);
          }
        }
      });
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const regex = type === 'number' ? /^[0-9]+$/ : /^[a-zA-Z0-9]+$/;
    if (regex.test(text)) {
      const pasteValue = text.slice(0, length - index);
      const newValue = value.split('');
      for (let i = 0; i < pasteValue.length; i++) {
        newValue[index + i] = pasteValue[i].toUpperCase();
      }
      const result = newValue.join('');
      setValue(result);
      onChange?.(result);

      if (result.length === length && onComplete) {
        onComplete(result);
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length }).map((_, index) => (
          <div key={index} className="relative">
            <motion.input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode={type === 'number' ? 'numeric' : 'text'}
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              onPaste={(e) => handlePaste(index, e)}
              disabled={disabled}
              className={cn(
                'w-12 h-14 text-center text-2xl font-display font-bold rounded-lg border-2 bg-cyber-card transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && 'border-cyber-pink',
                !error && 'border-cyber-border',
                focusedIndex === index && !error && 'border-cyber-cyan shadow-neon-cyan',
                inputClassName
              )}
            />

            {/* 分隔符 */}
            {separator && separatorPosition === index && (
              <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-cyber-muted font-bold">
                {separator}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 错误信息 */}
      {error && errorMessage && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-cyber-pink text-sm text-center"
        >
          {errorMessage}
        </motion.p>
      )}
    </div>
  );
}
