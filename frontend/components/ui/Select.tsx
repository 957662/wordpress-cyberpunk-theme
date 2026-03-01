/**
 * 下拉选择框组件
 */

'use client';

import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon } from '@/components/icons';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      placeholder = '请选择...',
      options,
      value,
      defaultValue,
      onChange,
      error,
      helperText,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    const currentValue = value ?? internalValue;
    const selectedOption = options.find((opt) => opt.value === currentValue);

    const handleSelect = (optionValue: string) => {
      const option = options.find((opt) => opt.value === optionValue);
      if (option?.disabled) return;

      setInternalValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    return (
      <div ref={ref} className={cn('relative w-full', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'w-full px-4 py-2.5 bg-cyber-card border rounded-md text-left transition-all duration-200 outline-none',
              error
                ? 'border-cyber-pink focus:border-cyber-pink focus:shadow-neon-pink'
                : 'border-cyber-border focus:border-cyber-cyan focus:shadow-neon-cyan',
              disabled && 'opacity-50 cursor-not-allowed',
              'flex items-center justify-between'
            )}
            disabled={disabled}
          >
            <span
              className={cn(
                'text-sm',
                !selectedOption && 'text-gray-500'
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {isOpen && !disabled && (
              <>
                {/* 遮罩层 */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />

                {/* 下拉列表 */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 w-full mt-1 bg-cyber-card border border-cyber-border rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between',
                        'hover:bg-cyber-muted',
                        option.value === currentValue && 'bg-cyber-cyan/10 text-cyber-cyan',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <span>{option.label}</span>
                      {option.value === currentValue && (
                        <CheckIcon className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'mt-1 text-sm',
              error ? 'text-cyber-pink' : 'text-gray-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
