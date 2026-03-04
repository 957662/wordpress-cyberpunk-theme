import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  return (
    <div className={className}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      <div
        className={cn(
          'space-y-2',
          orientation === 'horizontal' && 'flex flex-wrap gap-4 space-y-0'
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id={`${name}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                onChange={() => onChange(option.value)}
                className={cn(
                  'h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  error && 'border-red-500 focus:ring-red-500',
                  'dark:border-gray-700 dark:bg-gray-800'
                )}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'font-medium',
                  option.disabled && 'cursor-not-allowed opacity-50',
                  error && 'text-red-600 dark:text-red-400',
                  !error && 'text-gray-900 dark:text-white'
                )}
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
