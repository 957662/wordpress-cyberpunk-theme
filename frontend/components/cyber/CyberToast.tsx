'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => string;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  loading: (title: string, message?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig = {
  success: {
    icon: CheckCircle,
    color: 'green',
    bgClass: 'bg-green-500/10 border-green-500/50 text-green-400',
    iconBg: 'bg-green-500/20'
  },
  error: {
    icon: XCircle,
    color: 'red',
    bgClass: 'bg-red-500/10 border-red-500/50 text-red-400',
    iconBg: 'bg-red-500/20'
  },
  warning: {
    icon: AlertCircle,
    color: 'yellow',
    bgClass: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
    iconBg: 'bg-yellow-500/20'
  },
  info: {
    icon: Info,
    color: 'cyan',
    bgClass: 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400',
    iconBg: 'bg-cyan-500/20'
  },
  loading: {
    icon: Loader2,
    color: 'purple',
    bgClass: 'bg-purple-500/10 border-purple-500/50 text-purple-400',
    iconBg: 'bg-purple-500/20'
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    if (toast.type !== 'loading' && toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
        toast.onClose?.();
      }, toast.duration || 5000);
    }

    return id;
  }, []);

  const success = useCallback((title: string, message?: string) => {
    return toast({ type: 'success', title, message });
  }, [toast]);

  const error = useCallback((title: string, message?: string) => {
    return toast({ type: 'error', title, message });
  }, [toast]);

  const warning = useCallback((title: string, message?: string) => {
    return toast({ type: 'warning', title, message });
  }, [toast]);

  const info = useCallback((title: string, message?: string) => {
    return toast({ type: 'info', title, message });
  }, [toast]);

  const loading = useCallback((title: string, message?: string) => {
    return toast({ type: 'loading', title, message, duration: 0 });
  }, [toast]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      toast?.onClose?.();
      return prev.filter(t => t.id !== id);
    });
  }, []);

  const dismissAll = useCallback(() => {
    setToasts(prev => {
      prev.forEach(t => t.onClose?.());
      return [];
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, warning, info, loading, dismiss, dismissAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  maxToasts = 5
}) => {
  const { toasts, dismiss } = useToast();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  const visibleToasts = toasts.slice(-maxToasts);

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2 w-full max-w-sm',
      positionClasses[position]
    )}>
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-lg border-2',
        'backdrop-blur-xl shadow-xl',
        'p-4 pr-10',
        config.bgClass
      )}
    >
      {/* 背景光效 */}
      <div className={cn(
        'absolute inset-0 opacity-20 blur-xl',
        config.iconBg
      )} />

      <div className="relative flex items-start gap-3">
        {/* 图标 */}
        <div className={cn(
          'flex-shrink-0 p-1.5 rounded-lg',
          config.iconBg
        )}>
          <Icon className={cn(
            'w-5 h-5',
            toast.type === 'loading' && 'animate-spin'
          )} />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white">{toast.title}</h4>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-300">{toast.message}</p>
          )}

          {/* 操作按钮 */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={cn(
                'mt-2 text-sm font-medium underline',
                'hover:opacity-80 transition-opacity'
              )}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={() => onDismiss(toast.id)}
          className={cn(
            'absolute top-2 right-2 p-1 rounded-md',
            'text-gray-400 hover:text-white',
            'hover:bg-white/10 transition-colors'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 进度条（非 loading 类型） */}
      {toast.type !== 'loading' && toast.duration !== 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
          className={cn(
            'absolute bottom-0 left-0 h-0.5',
            'bg-current opacity-30'
          )}
        />
      )}
    </motion.div>
  );
};

export default ToastProvider;
