'use client';

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 5000) => {
      const id = `toast-${++toastId}`;
      const toast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, toast]);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addToast('success', title, message, duration);
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addToast('error', title, message, duration);
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addToast('info', title, message, duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addToast('warning', title, message, duration);
    },
    [addToast]
  );

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    clear,
  };
};

export default useToast;
