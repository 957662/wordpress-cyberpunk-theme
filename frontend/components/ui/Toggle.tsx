/**
 * 切换组件
 * 开关、复选框等
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// 切换开关
export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'glass';
  label?: string;
  className?: string;
}

const sizes = {
  sm: { width: '36px', height: '20px', dot: '16px' },
  md: { width: '44px', height: '24px', dot: '20px' },
  lg: { width: '52px', height: '28px', dot: '24px' },
};

const variants = {
  default: {
    off: 'bg-cyber-muted',
    on: 'bg-cyber-cyan',
    dot: 'bg-white',
  },
  neon: {
    off: 'bg-cyber-muted border border-cyber-border',
    on: 'bg-cyber-cyan shadow-neon-cyan',
    dot: 'bg-white',
  },
  glass: {
    off: 'bg-cyber-card/50 border border-cyber-border',
    on: 'bg-cyber-cyan/80 border border-cyber-cyan',
    dot: 'bg-white',
  },
};

export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  className,
}: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : isChecked;

  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !currentChecked;

    if (!isControlled) {
      setIsChecked(newChecked);
    }

    onChange?.(newChecked);
  };

  const sizeStyles = sizes[size];
  const variantStyles = variants[variant];

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={currentChecked}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative rounded-full transition-all duration-200',
          currentChecked ? variantStyles.on : variantStyles.off
        )}
        style={{
          width: sizeStyles.width,
          height: sizeStyles.height,
        }}
      >
        <motion.span
          className={cn(
            'absolute top-0.5 rounded-full shadow-sm',
            variantStyles.dot
          )}
          style={{
            width: sizeStyles.dot,
            height: sizeStyles.dot,
          }}
          animate={{
            left: currentChecked ? 'calc(100% - 2px)' : '2px',
            x: currentChecked ? '-100%' : '0',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>

      {label && (
        <span className="text-sm text-cyber-muted select-none">{label}</span>
      )}
    </label>
  );
}

// 复选框组
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon';
  label?: string;
  description?: string;
  className?: string;
}

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  size = 'md',
  variant = 'default',
  label,
  description,
  className,
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : isChecked;
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = () => {
    if (disabled) return;

    const newChecked = !currentChecked;

    if (!isControlled) {
      setIsChecked(newChecked);
    }

    onChange?.(newChecked);
  };

  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <label
      className={cn(
        'inline-flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={currentChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            'rounded border-2 flex items-center justify-center transition-all duration-200',
            sizeStyles[size],
            variant === 'default' && 'border-cyber-border bg-cyber-card',
            variant === 'neon' && 'border-cyber-cyan bg-cyber-card',
            currentChecked && 'bg-cyber-cyan border-cyber-cyan',
            !disabled && !currentChecked && 'hover:border-cyber-cyan'
          )}
        >
          {(currentChecked || indeterminate) && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-3 h-3 text-cyber-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {indeterminate ? (
                <rect x="6" y="11" width="12" height="2" fill="currentColor" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              )}
            </motion.svg>
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-white select-none block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-cyber-muted select-none block mt-1">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}

// 单选按钮
export interface RadioProps {
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon';
  label?: string;
  description?: string;
  value?: string;
  name?: string;
  className?: string;
}

export function Radio({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  description,
  value,
  name,
  className,
}: RadioProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <label
      className={cn(
        'inline-flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            'rounded-full border-2 flex items-center justify-center transition-all duration-200',
            sizeStyles[size],
            variant === 'default' && 'border-cyber-border bg-cyber-card',
            variant === 'neon' && 'border-cyber-cyan bg-cyber-card',
            checked && 'border-cyber-cyan',
            !disabled && !checked && 'hover:border-cyber-cyan'
          )}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'rounded-full bg-cyber-cyan',
                dotSizes[size]
              )}
            />
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-white select-none block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-cyber-muted select-none block mt-1">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}

// 单选按钮组
export interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioGroupOption[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon';
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  className,
}: RadioGroupProps) {
  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          disabled={option.disabled}
          size={size}
          variant={variant}
          label={option.label}
          description={option.description}
        />
      ))}
    </div>
  );
}
