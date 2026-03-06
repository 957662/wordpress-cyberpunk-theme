'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-cyber-cyan mb-2">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-cyber-cyan/30 bg-cyber-dark/50 px-3 py-2',
            'text-sm text-white placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 focus:border-cyber-cyan',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            error && 'border-cyber-pink focus:ring-cyber-pink/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-cyber-pink">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
