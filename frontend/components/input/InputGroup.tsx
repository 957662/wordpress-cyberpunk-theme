import React from 'react';
import { cn } from '@/lib/utils';

interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

const spacingClasses = {
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
};

/**
 * InputGroup - 输入组组件
 * 用于包装表单输入字段，提供标签、错误提示等
 */
export const InputGroup: React.FC<InputGroupProps> = ({
  children,
  className,
  orientation = 'vertical',
  spacing = 'md',
  label,
  description,
  error,
  required,
}) => {
  return (
    <div className={cn(
      orientation === 'vertical' && spacingClasses[spacing],
      className
    )}>
      {(label || description) && (
        <div className="space-y-1">
          {label && (
            <label className="block text-sm font-medium text-gray-200">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}

      {children}

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputGroup;
