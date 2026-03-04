'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10',
    borderColor: 'border-cyber-green/30',
  },
  error: {
    icon: XCircle,
    color: 'text-cyber-pink',
    bgColor: 'bg-cyber-pink/10',
    borderColor: 'border-cyber-pink/30',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-cyber-yellow',
    bgColor: 'bg-cyber-yellow/10',
    borderColor: 'border-cyber-yellow/30',
  },
  info: {
    icon: Info,
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
    borderColor: 'border-cyber-cyan/30',
  },
  loading: {
    icon: Loader2,
    color: 'text-cyber-purple',
    bgColor: 'bg-cyber-purple/10',
    borderColor: 'border-cyber-purple/30',
  },
};

function ToastComponent({
  id,
  type,
  title,
  description,
  duration = 5000,
  action,
  onClose,
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (type === 'loading') return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = 100 - (elapsed / duration) * 100;
      setProgress(Math.max(0, remaining));

      if (elapsed >= duration) {
        onClose(id);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [id, duration, type, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-lg border',
        'bg-cyber-card shadow-lg shadow-cyber-cyan/10',
        'min-w-[320px] max-w-md',
        config.borderColor
      )}
    >
      {/* 进度条 */}
      {type !== 'loading' && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-purple"
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      )}

      <div className="flex items-start gap-3 p-4">
        {/* 图标 */}
        <div
          className={cn(
            'flex-shrink-0 p-1 rounded-md',
            config.bgColor,
            config.color
          )}
        >
          <Icon className={cn('w-5 h-5', type === 'loading' && 'animate-spin')} />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white">{title}</h4>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}

          {/* 操作按钮 */}
          {action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                onClose(id);
              }}
              className="mt-2 text-sm font-medium text-cyber-cyan hover:text-cyber-purple transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1 hover:bg-cyber-muted rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </motion.div>
  );
}

// Toast 容器
interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

export function ToastContainer({
  toasts,
  onClose,
  position = 'top-right',
}: ToastContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 p-4',
        'max-h-[80vh] overflow-y-auto',
        positionClasses[position]
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Toast 管理 Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toast = {
    success: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ type: 'success', title, description, ...options }),
    error: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ type: 'error', title, description, ...options }),
    warning: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ type: 'warning', title, description, ...options }),
    info: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ type: 'info', title, description, ...options }),
    loading: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ type: 'loading', title, description, ...options }),
    promise: <T,>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      const id = addToast({ type: 'loading', title: loading });

      promise
        .then(() => {
          removeToast(id);
          addToast({ type: 'success', title: success });
        })
        .catch((err) => {
          removeToast(id);
          addToast({ type: 'error', title: error, description: err.message });
        });
    },
  };

  return {
    toasts,
    addToast,
    removeToast,
    toast,
  };
}

// 单例 Toast 管理
class ToastManager {
  private listeners: Set<(toasts: Toast[]) => void> = new Set();
  private toasts: Toast[] = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  add(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(7);
    this.toasts.push({ ...toast, id });
    this.notify();

    if (toast.type !== 'loading') {
      setTimeout(() => {
        this.remove(id);
      }, toast.duration || 5000);
    }

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notify();
  }

  success(title: string, description?: string) {
    return this.add({ type: 'success', title, description });
  }

  error(title: string, description?: string) {
    return this.add({ type: 'error', title, description });
  }

  warning(title: string, description?: string) {
    return this.add({ type: 'warning', title, description });
  }

  info(title: string, description?: string) {
    return this.add({ type: 'info', title, description });
  }

  loading(title: string, description?: string) {
    return this.add({ type: 'loading', title, description });
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastManager = new ToastManager();

// 快捷方法
export const toast = {
  success: (title: string, description?: string) =>
    toastManager.success(title, description),
  error: (title: string, description?: string) =>
    toastManager.error(title, description),
  warning: (title: string, description?: string) =>
    toastManager.warning(title, description),
  info: (title: string, description?: string) =>
    toastManager.info(title, description),
  loading: (title: string, description?: string) =>
    toastManager.loading(title, description),
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    const id = toastManager.loading(messages.loading);

    promise
      .then(() => {
        toastManager.remove(id);
        toastManager.success(messages.success);
      })
      .catch((err) => {
        toastManager.remove(id);
        toastManager.error(messages.error, err.message);
      });

    return promise;
  },
};
