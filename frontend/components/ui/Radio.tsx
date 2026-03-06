/**
 * 赛博朋克风格单选框组件
 */

'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  value?: string;
  name?: string;
  id?: string;
  label?: string;
  description?: string;
  variant?: 'default' | 'cyan' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onChange?: (checked: boolean) => void;
}

export function Radio({
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  value,
  name,
  id,
  label,
  description,
  variant = 'default',
  size = 'md',
  className,
  onChange,
}: RadioProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleChange = () => {
    if (disabled) return;

    if (!isControlled) {
      setInternalChecked(true);
    }
    onChange?.(true);
  };

  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dotSizeStyles = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const variantStyles = {
    default: {
      border: checked ? 'border-cyber-cyan' : 'border-cyber-border',
      dot: 'bg-cyber-cyan',
      glow: 'shadow-neon-cyan',
    },
    cyan: {
      border: checked ? 'border-cyber-cyan' : 'border-cyber-border',
      dot: 'bg-cyber-cyan',
      glow: 'shadow-neon-cyan',
    },
    purple: {
      border: checked ? 'border-cyber-purple' : 'border-cyber-border',
      dot: 'bg-cyber-purple',
      glow: 'shadow-neon-purple',
    },
    pink: {
      border: checked ? 'border-cyber-pink' : 'border-cyber-border',
      dot: 'bg-cyber-pink',
      glow: 'shadow-neon-pink',
    },
  };

  const styles = variantStyles[variant];

  return (
    <label
      className={cn(
        'relative inline-flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />

      <div className="relative flex-shrink-0 mt-0.5">
        <motion.div
          className={cn(
            'rounded-full border-2 bg-cyber-dark transition-colors',
            sizeStyles[size],
            styles.border,
            checked && styles.glow
          )}
          animate={{
            scale: disabled ? 1 : 1,
          }}
          whileHover={disabled ? {} : { scale: 1.05 }}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
              className={cn(
                'rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                dotSizeStyles[size],
                styles.dot
              )}
            />
          )}
        </motion.div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span
              className={cn(
                'text-sm font-medium',
                checked ? 'text-white' : 'text-gray-300',
                disabled && 'text-gray-500'
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 mt-0.5">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}

// 单选框组
export interface RadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
}

export function RadioGroup({
  name,
  value: controlledValue,
  defaultValue,
  disabled = false,
  orientation = 'vertical',
  className,
  children,
  onChange,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  // 克隆子元素并传递 props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        name: name ?? child.props.name,
        checked: child.props.value === value,
        disabled: disabled || child.props.disabled,
        onChange: () => handleChange(child.props.value),
      });
    }
    return child;
  });

  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {enhancedChildren}
    </div>
  );
}

// 预设选项
export function RadioPreset({
  options,
  ...props
}: Omit<RadioGroupProps, 'children'> & {
  options: Array<{ value: string; label: string; description?: string }>;
}) {
  return (
    <RadioGroup {...props}>
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
        />
      ))}
    </RadioGroup>
  );
}
