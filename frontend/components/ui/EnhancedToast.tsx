'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

interface Toast extends ToastOptions {
  id: string;
  createdAt: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (options: ToastOptions) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toastVariants = {
  success: {
    icon: Check,
    className: 'border-l-4 border-l-cyber-green text-cyber-green',
    bgClassName: 'bg-cyber-green/10',
  },
  error: {
    icon: AlertCircle,
    className: 'border-l-4 border-l-cyber-pink text-cyber-pink',
    bgClassName: 'bg-cyber-pink/10',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-l-4 border-l-cyber-yellow text-cyber-yellow',
    bgClassName: 'bg-cyber-yellow/10',
  },
  info: {
    icon: Info,
    className: 'border-l-4 border-l-cyber-cyan text-cyber-cyan',
    bgClassName: 'bg-cyber-cyan/10',
  },
};

export const EnhancedToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...options,
      id,
      variant: options.variant || 'info',
      createdAt: Date.now(),
      duration: options.duration ?? 5000,
    };

    setToasts(prev => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const success = (title: string, description?: string) =>
    toast({ title, description, variant: 'success' });

  const error = (title: string, description?: string) =>
    toast({ title, description, variant: 'error' });

  const warning = (title: string, description?: string) =>
    toast({ title, description, variant: 'warning' });

  const info = (title: string, description?: string) =>
    toast({ title, description, variant: 'info' });

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextValue = {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useEnhancedToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useEnhancedToast must be used within EnhancedToastProvider');
  }
  return context;
};

const ToastContainer: React.FC = () => {
  const { toasts } = useEnhancedToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { dismiss } = useEnhancedToast();
  const variant = toastVariants[toast.variant];
  const Icon = variant.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-lg',
        'border bg-deep-black/95 backdrop-blur-md shadow-2xl',
        'min-w-[300px] max-w-md',
        variant.className
      )}
    >
      {/* Content */}
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={cn('flex-shrink-0', variant.bgClassName, 'rounded-full p-1')}>
          {toast.icon || <Icon className="w-4 h-4" />}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
          {toast.description && (
            <p className="mt-1 text-sm text-gray-300">{toast.description}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-cyber-cyan hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => dismiss(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={cn('h-0.5', variant.bgClassName)}
        />
      )}
    </motion.div>
  );
};

// Named exports for convenience
export const toast = {
  success: (title: string, description?: string) => {
    const context = useContext(ToastContext);
    return context?.success(title, description) || '';
  },
  error: (title: string, description?: string) => {
    const context = useContext(ToastContext);
    return context?.error(title, description) || '';
  },
  warning: (title: string, description?: string) => {
    const context = useContext(ToastContext);
    return context?.warning(title, description) || '';
  },
  info: (title: string, description?: string) => {
    const context = useContext(ToastContext);
    return context?.info(title, description) || '';
  },
};

export default EnhancedToastProvider;
