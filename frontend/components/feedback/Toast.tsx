'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

/**
 * Toast - 通知提示组件
 *
 * 特性：
 * - 多种类型（成功、错误、信息、警告）
 * - 自动关闭
 * - 动画效果
 * - 赛博朋克风格
 */
export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  className
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: Check,
    error: X,
    info: Info,
    warning: AlertTriangle
  };

  const colors = {
    success: 'border-cyber-green text-cyber-green shadow-[0_0_20px_rgba(0,255,136,0.2)]',
    error: 'border-cyber-pink text-cyber-pink shadow-[0_0_20px_rgba(255,0,128,0.2)]',
    info: 'border-cyber-cyan text-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)]',
    warning: 'border-cyber-yellow text-cyber-yellow shadow-[0_0_20px_rgba(240,255,0,0.2)]'
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'relative flex items-center gap-3 px-4 py-3 rounded-lg',
            'bg-cyber-dark/95 backdrop-blur-sm',
            'border-2',
            colors[type],
            'min-w-[300px] max-w-md',
            className
          )}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1 text-sm font-medium">{message}</p>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress bar */}
          {duration > 0 && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * ToastContainer - Toast容器组件
 */
interface ToastConfig {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastConfig[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export function ToastContainer({
  toasts,
  onRemove,
  position = 'top-right',
  className
}: ToastContainerProps) {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positions[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => onRemove(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Toast Hook
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastWrapper = () => (
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  );

  return {
    showToast,
    toasts,
    ToastWrapper
  };
}

/**
 * Preset toast functions
 */
export const toast = {
  success: (message: string, duration?: number) => {
    // Implementation would use a global toast manager
    console.log('[SUCCESS]', message);
  },
  error: (message: string, duration?: number) => {
    console.log('[ERROR]', message);
  },
  info: (message: string, duration?: number) => {
    console.log('[INFO]', message);
  },
  warning: (message: string, duration?: number) => {
    console.log('[WARNING]', message);
  }
};
