'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PinCodeProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  type?: 'text' | 'password';
  disabled?: boolean;
  error?: boolean;
}

export const PinCode: React.FC<PinCodeProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  className,
  type = 'text',
  disabled = false,
  error = false,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (char.length > 1) return;

    const newValue = value.slice(0, index) + char + value.slice(index + 1);
    onChange?.(newValue);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange?.(pastedData);
      if (pastedData.length === length && onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type={type === 'password' ? 'password' : 'text'}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              'w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
              error
                ? 'border-red-500 text-red-500'
                : focusedIndex === index
                ? 'border-cyber-cyan'
                : 'border-dark-700 hover:border-dark-600',
              disabled && 'opacity-50 cursor-not-allowed',
              type === 'password' && 'tracking-widest'
            )}
          />
        </motion.div>
      ))}
    </div>
  );
};

interface VerificationCodeProps {
  onVerify: (code: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
  length?: number;
  className?: string;
}

export const VerificationCode: React.FC<VerificationCodeProps> = ({
  onVerify,
  onResend,
  length = 6,
  className,
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleComplete = async (value: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const success = await onVerify(value);
      if (!success) {
        setError('验证码错误，请重试');
        setCode('');
      }
    } catch (err) {
      setError('验证失败，请稍后重试');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    try {
      await onResend?.();
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('发送失败，请稍后重试');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">输入验证码</h3>
        <p className="text-sm text-gray-400">
          我们已向您的手机发送了 {length} 位验证码
        </p>
      </div>

      <PinCode
        length={length}
        value={code}
        onChange={setCode}
        onComplete={handleComplete}
        error={!!error}
        disabled={isVerifying}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}

      {isVerifying && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
          <span>验证中...</span>
        </div>
      )}

      {onResend && (
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className={cn(
              'text-sm transition-colors',
              countdown > 0 || isResending
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-cyber-cyan hover:text-cyber-cyan/80'
            )}
          >
            {isResending
              ? '发送中...'
              : countdown > 0
              ? `重新发送 (${countdown}s)`
              : '重新发送'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PinCode;
