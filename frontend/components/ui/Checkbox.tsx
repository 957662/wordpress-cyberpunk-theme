/**
 * 复选框组件
 */

'use client';

import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@/components/icons';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      size = 'md',
      color = 'cyan',
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(
      checked ?? defaultChecked ?? false
    );

    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      onChange?.(e);
    };

    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    const colors = {
      cyan: isChecked ? 'border-cyber-cyan bg-cyber-cyan' : 'border-cyber-border bg-transparent',
      purple: isChecked ? 'border-cyber-purple bg-cyber-purple' : 'border-cyber-border bg-transparent',
      pink: isChecked ? 'border-cyber-pink bg-cyber-pink' : 'border-cyber-border bg-transparent',
      green: isChecked ? 'border-cyber-green bg-cyber-green' : 'border-cyber-border bg-transparent',
    };

    return (
      <label
        className={cn(
          'inline-flex items-start gap-3 cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative pt-0.5">
          <input
            type="checkbox"
            ref={ref}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <motion.div
            className={cn(
              'flex items-center justify-center border-2 rounded transition-colors duration-200',
              sizes[size],
              colors[color]
            )}
            animate={{
              scale: isChecked ? [1, 0.95, 1] : 1,
            }}
            transition={{ duration: 0.1 }}
          >
            {(isChecked || indeterminate) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {indeterminate ? (
                  <div className="w-2/3 h-0.5 bg-white rounded" />
                ) : (
                  <CheckIcon className={cn(iconSizes[size], 'text-white')} />
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span
                className={cn(
                  'text-sm font-medium leading-none',
                  disabled ? 'text-gray-500' : 'text-gray-200'
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <p className="text-sm text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
