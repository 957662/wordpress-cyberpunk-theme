import React from 'react';
import { cn } from '@/lib/utils';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  error?: string;
}

export function FormLabel({
  children,
  required = false,
  error,
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={cn(
        'mb-1.5 block text-sm font-medium',
        error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

export interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

export interface FormHelperProps {
  children: React.ReactNode;
}

export function FormHelper({ children }: FormHelperProps) {
  return (
    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {children}
    </p>
  );
}
