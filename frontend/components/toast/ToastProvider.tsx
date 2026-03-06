'use client';

/**
 * ToastProvider - Toast 通知管理组件
 * 管理和显示多个 Toast 通知
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast, ToastItem } from './Toast';

interface ToastProviderProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastProvider({
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleToastShow = (event: CustomEvent) => {
      const newToast = event.detail as ToastItem;
      setToasts((prev) => {
        const updated = [...prev, newToast];
        // 限制最大数量
        if (updated.length > maxToasts) {
          return updated.slice(-maxToasts);
        }
        return updated;
      });
    };

    window.addEventListener('toast-show', handleToastShow as EventListener);

    return () => {
      window.removeEventListener('toast-show', handleToastShow as EventListener);
    };
  }, [maxToasts]);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (!isMounted) {
    return null;
  }

  const portalRoot = document.getElementById('toast-root') || document.body;

  return createPortal(
    <div className={cn('fixed z-50 flex flex-col gap-3 max-w-md w-full', positionStyles[position])}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={handleClose}
          />
        ))}
      </AnimatePresence>
    </div>,
    portalRoot
  );
}

// Hook for using toast
export function useToast() {
  const show = (props: Omit<ToastItem, 'id'>) => {
    return window.dispatchEvent(
      new CustomEvent('toast-show', {
        detail: props,
      })
    );
  };

  return {
    success: (message: string, title?: string) =>
      show({ type: 'success', message, title }),
    error: (message: string, title?: string) =>
      show({ type: 'error', message, title }),
    info: (message: string, title?: string) =>
      show({ type: 'info', message, title }),
    warning: (message: string, title?: string) =>
      show({ type: 'warning', message, title }),
    show,
  };
}

export default ToastProvider;

// Import cn utility
import { cn } from '@/lib/utils';
