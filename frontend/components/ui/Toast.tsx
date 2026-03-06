/**
 * Toast - 通知消息组件
 *
 * 显示短暂的通知消息
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  /**
   * 消息类型
   */
  type?: ToastType;

  /**
   * 消息标题
   */
  title?: string;

  /**
   * 消息内容
   */
  message: string;

  /**
   * 显示时长（毫秒）
   */
  duration?: number;

  /**
   * 是否显示关闭按钮
   */
  closable?: boolean;

  /**
   * 关闭时的回调
   */
  onClose?: () => void;

  /**
   * 额外的类名
   */
  className?: string;

  /**
   * 位置
   */
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const typeStyles = {
  success: {
    container: 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950',
    icon: 'text-green-500',
    Icon: CheckCircle,
  },
  error: {
    container: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950',
    icon: 'text-red-500',
    Icon: AlertCircle,
  },
  warning: {
    container: 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
    icon: 'text-yellow-500',
    Icon: AlertTriangle,
  },
  info: {
    container: 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950',
    icon: 'text-blue-500',
    Icon: Info,
  },
};

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 3000,
  closable = true,
  onClose,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const style = typeStyles[type];
  const Icon = style.Icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // 等待动画完成
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'relative flex items-start gap-3 rounded-lg p-4 shadow-lg',
            style.container,
            className
          )}
          role="alert"
        >
          <Icon className={cn('h-5 w-5 flex-shrink-0', style.icon)} />

          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h4>
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
              {message}
            </p>
          </div>

          {closable && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Toast 容器组件
 */
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type?: ToastType;
    title?: string;
    message: string;
    duration?: number;
    closable?: boolean;
  }>;
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top' | 'bottom';
  className?: string;
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top': 'top-4 left-1/2 -translate-x-1/2',
  'bottom': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right',
  className,
}) => {
  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 max-w-md w-full',
        positionStyles[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              closable={toast.closable}
              onClose={() => onRemove(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Toast Hook
 */
export interface UseToastReturn {
  toasts: Array<{
    id: string;
    type?: ToastType;
    title?: string;
    message: string;
    duration?: number;
    closable?: boolean;
  }>;
  show: (toast: Omit<Parameters<typeof showToast>[0], 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

let toastId = 0;

export function showToast({
  type = 'info',
  title,
  message,
  duration = 3000,
  closable = true,
}: Omit<ToastProps, 'onClose' | 'className' | 'position'> & {
  id?: string;
}): string {
  const id = `toast-${toastId++}`;

  // 这里应该触发一个事件或者使用状态管理
  // 简化版本：直接返回 id
  if (typeof window !== 'undefined' && (window as any).toastDispatch) {
    (window as any).toastDispatch({
      type: 'ADD_TOAST',
      payload: { id, type, title, message, duration, closable },
    });
  }

  return id;
}

// 用于 Toast 组件的辅助函数
export const toast = {
  success: (message: string, title?: string) => showToast({ type: 'success', message, title }),
  error: (message: string, title?: string) => showToast({ type: 'error', message, title }),
  warning: (message: string, title?: string) => showToast({ type: 'warning', message, title }),
  info: (message: string, title?: string) => showToast({ type: 'info', message, title }),
};

export default Toast;
