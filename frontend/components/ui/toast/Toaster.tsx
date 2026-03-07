'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastProps, ToastType } from './Toast';
import { v4 as uuidv4 } from 'uuid';

interface ToastContextValue {
  toast: (props: Omit<ToastProps, 'id' | 'onClose'>) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface Toast extends Omit<ToastProps, 'onClose'> {
  id: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const toast = useCallback((props: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = uuidv4();
    const newToast: Toast = {
      ...props,
      id,
    };

    setToasts((prev) => [...prev, newToast]);

    if (props.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, props.duration || 5000);
    }
  }, []);

  const success = useCallback((message: string, title?: string, duration?: number) => {
    toast({ type: 'success', title, message, duration });
  }, [toast]);

  const error = useCallback((message: string, title?: string, duration?: number) => {
    toast({ type: 'error', title, message, duration });
  }, [toast]);

  const info = useCallback((message: string, title?: string, duration?: number) => {
    toast({ type: 'info', title, message, duration });
  }, [toast]);

  const warning = useCallback((message: string, title?: string, duration?: number) => {
    toast({ type: 'warning', title, message, duration });
  }, [toast]);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: ToastContextValue = {
    toast,
    success,
    error,
    info,
    warning,
    clear,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted && createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast {...toast} onClose={handleClose} />
              </div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
