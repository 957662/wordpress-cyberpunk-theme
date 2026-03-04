import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
};

const colors = {
  primary: 'border-blue-600 border-t-transparent',
  secondary: 'border-purple-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  current: 'border-current border-t-transparent',
};

export function Spinner({
  size = 'md',
  color = 'primary',
  className,
}: SpinnerProps) {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full',
        sizes[size],
        colors[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export interface FullPageSpinnerProps {
  message?: string;
}

export function FullPageSpinner({ message = 'Loading...' }: FullPageSpinnerProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" />
        {message && (
          <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
}

export interface InlineSpinnerProps {
  message?: string;
  position?: 'left' | 'right' | 'center';
}

export function InlineSpinner({
  message,
  position = 'left',
}: InlineSpinnerProps) {
  const alignments = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
  };

  return (
    <div className={cn('flex items-center space-x-2', alignments[position])}>
      <Spinner size="sm" />
      {message && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </span>
      )}
    </div>
  );
}
