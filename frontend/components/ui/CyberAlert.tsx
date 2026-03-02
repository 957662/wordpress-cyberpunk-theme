'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberAlertProps {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  variant?: 'default' | 'glow' | 'neon';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const CyberAlert: React.FC<CyberAlertProps> = ({
  title,
  description,
  type = 'info',
  variant = 'default',
  dismissible = false,
  onDismiss,
  className,
}) => {
  const typeStyles = {
    success: {
      border: 'border-green-500/50',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      border: 'border-red-500/50',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      border: 'border-yellow-500/50',
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const variantStyles = {
    default: '',
    glow: 'shadow-lg',
    neon: 'shadow-xl animate-pulse',
  };

  const styles = typeStyles[type];

  return (
    <div
      className={cn(
        'relative border rounded-lg p-4 backdrop-blur-sm',
        styles.border,
        styles.bg,
        variantStyles[variant],
        className
      )}
      style={{
        boxShadow: variant !== 'default' ? `0 0 20px ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' :
                                                      type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                                                      type === 'warning' ? 'rgba(234, 179, 8, 0.3)' :
                                                      'rgba(6, 182, 212, 0.3)'}` : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0', styles.text)}>{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-sm font-semibold', styles.text)}>{title}</h4>
          {description && (
            <p className="mt-1 text-sm text-gray-300">{description}</p>
          )}
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 transition-colors',
              styles.text,
              'hover:text-white'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CyberAlert;
