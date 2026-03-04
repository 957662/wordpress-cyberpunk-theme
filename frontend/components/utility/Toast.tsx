/**
 * Toast Notification Component
 *
 * 赛博朋克风格的提示通知组件
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: (id: string) => void;
  className?: string;
}

const toastIcons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
};

const toastStyles: Record<ToastType, string> = {
  success: 'border-cyber-green text-cyber-green bg-cyber-green/10',
  error: 'border-cyber-pink text-cyber-pink bg-cyber-pink/10',
  info: 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10',
  warning: 'border-cyber-yellow text-cyber-yellow bg-cyber-yellow/10',
};

export function Toast({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  className,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const interval = 10;
      const step = 100 / (duration / interval);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= step) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return prev - step;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm',
        toastStyles[type],
        className
      )}
    >
      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute left-0 top-0 h-1 bg-current opacity-50">
          <motion.div
            className="h-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">{toastIcons[type]}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
          )}
          <p className="text-sm opacity-90">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose?: (id: string) => void;
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionStyles: Record<
  Exclude<ToastContainerProps['position'], undefined>,
  string
> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastContainer({
  toasts,
  onClose,
  className,
  position = 'top-right',
}: ToastContainerProps) {
  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none',
        positionStyles[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Toast Hook
export interface UseToastReturn {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, 'id'>) => string;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  remove: (id: string) => void;
  clear: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = React.useCallback(
    (props: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...props, id }]);
      return id;
    },
    []
  );

  const success = React.useCallback(
    (message: string, title?: string) =>
      toast({ type: 'success', message, title }),
    [toast]
  );

  const error = React.useCallback(
    (message: string, title?: string) =>
      toast({ type: 'error', message, title }),
    [toast]
  );

  const info = React.useCallback(
    (message: string, title?: string) =>
      toast({ type: 'info', message, title }),
    [toast]
  );

  const warning = React.useCallback(
    (message: string, title?: string) =>
      toast({ type: 'warning', message, title }),
    [toast]
  );

  const remove = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = React.useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    toast,
    success,
    error,
    info,
    warning,
    remove,
    clear,
  };
}
