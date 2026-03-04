'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export interface ToastProps {
  id: string;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: ToastPosition;
  onClose?: (id: string) => void;
  showProgress?: boolean;
  glow?: boolean;
}

const toastIcons = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

const toastColors = {
  success: 'from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400',
  error: 'from-red-500/20 to-pink-500/20 border-red-500/50 text-red-400',
  warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-400',
  info: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-cyan-400',
};

const toastGlowColors = {
  success: 'shadow-green-500/50',
  error: 'shadow-red-500/50',
  warning: 'shadow-yellow-500/50',
  info: 'shadow-cyan-500/50',
};

export const CyberToast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  position = 'top-right',
  onClose,
  showProgress = true,
  glow = false,
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (duration === 0) return;

    const interval = 16; // ~60fps
    const decrement = (100 / duration) * interval;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= decrement) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return prev - decrement;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, isPaused]);

  const handleClose = () => {
    onClose?.(id);
  };

  const positionClasses = {
    'top-left': 'items-start justify-start',
    'top-right': 'items-start justify-end',
    'bottom-left': 'items-end justify-start',
    'bottom-right': 'items-end justify-end',
    'top-center': 'items-start justify-center',
    'bottom-center': 'items-end justify-center',
  };

  return (
    <motion.div
      className={cn(
        'relative w-full max-w-md overflow-hidden rounded-lg border-2',
        'bg-gradient-to-br',
        toastColors[type],
        glow && `shadow-lg ${toastGlowColors[type]}`,
        'backdrop-blur-md'
      )}
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 进度条 */}
      {showProgress && duration > 0 && (
        <motion.div
          className="absolute left-0 top-0 h-1 bg-current opacity-30"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      )}

      {/* 内容 */}
      <div className="flex items-start gap-3 p-4">
        {/* 图标 */}
        <div className="flex-shrink-0 mt-0.5">{toastIcons[type]}</div>

        {/* 文本 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && (
            <p className="mt-1 text-sm opacity-80 line-clamp-2">{message}</p>
          )}
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-md p-1 hover:bg-white/10 transition-colors"
          aria-label="Close toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 装饰线 */}
      <div className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
    </motion.div>
  );
};

// Toast 容器组件
export interface ToastContainerProps {
  toasts: ToastProps[];
  position?: ToastPosition;
  onClose?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  onClose,
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 p-4 pointer-events-none',
        positionClasses[position]
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <CyberToast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CyberToast;
