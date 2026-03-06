'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
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
};

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
            'min-w-[300px] max-w-md',
            config.bgColor,
            config.borderColor,
            config.color
          )}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1 text-sm font-medium">{message}</p>
          {onClose && (
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(), 300);
              }}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast 容器组件
interface ToastContainerProps {
  toasts: Array<{ id: string } & ToastProps>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
