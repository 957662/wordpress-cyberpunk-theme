/**
 * OTPInput Component
 * 一次性密码输入组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface OTPInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'cyber';
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value: controlledValue,
  defaultValue,
  onChange,
  onComplete,
  size = 'md',
  variant = 'default',
  disabled = false,
  error = false,
  autoFocus = true,
  className = '',
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const sizeStyles = {
    sm: 'w-8 h-10 text-lg',
    md: 'w-12 h-14 text-2xl',
    lg: 'w-16 h-20 text-3xl',
  };

  const variantStyles = {
    default: 'border-cyber-border focus:border-cyber-cyan',
    neon: 'border-cyber-cyan shadow-neon-cyan',
    cyber: 'border-cyber-purple shadow-neon-purple',
  };

  const errorStyles = error ? 'border-cyber-pink shadow-neon-pink' : '';

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // 只允许数字
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length > 1) {
      // 处理粘贴的情况
      const newValue = numericValue.slice(0, length - index);
      const updatedValue =
        currentValue.slice(0, index) + newValue + currentValue.slice(index + newValue.length);

      if (controlledValue === undefined) {
        setInternalValue(updatedValue);
      }
      onChange?.(updatedValue);

      // 聚焦到下一个输入框
      const nextIndex = Math.min(index + newValue.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      // 检查是否完成
      if (updatedValue.length === length) {
        onComplete?.(updatedValue);
      }
    } else if (numericValue) {
      // 处理单个数字输入
      const updatedValue =
        currentValue.slice(0, index) + numericValue + currentValue.slice(index + 1);

      if (controlledValue === undefined) {
        setInternalValue(updatedValue);
      }
      onChange?.(updatedValue);

      // 聚焦到下一个输入框
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // 检查是否完成
      if (updatedValue.length === length) {
        onComplete?.(updatedValue);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;

    // 处理删除键
    if (e.key === 'Backspace' && !currentValue[index]) {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // 处理左右箭头键
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    e.preventDefault();

    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (pastedData) {
      const maxLength = Math.min(pastedData.length, length);
      const newValue = pastedData.slice(0, maxLength);

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);

      // 聚焦到相应的输入框
      inputRefs.current[Math.min(maxLength, length - 1)]?.focus();

      // 检查是否完成
      if (newValue.length === length) {
        onComplete?.(newValue);
      }
    }
  };

  // 处理自动聚焦
  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  return (
    <div
      ref={containerRef}
      className={cn('flex items-center gap-2', className)}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, index) => (
        <motion.input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={currentValue[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center rounded-lg border-2 bg-cyber-dark/80 text-center font-mono font-bold text-white transition-all',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeStyles[size],
            variantStyles[variant],
            errorStyles
          )}
          whileFocus={{ scale: 1.05 }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
