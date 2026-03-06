'use client';

/**
 * Toast 通知组件
 * 用于显示临时通知消息
 */

import { useEffect, useState } from 'react';
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
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastColors = {
  success: 'border-cyber-green bg-cyber-green/10',
  error: 'border-cyber-pink bg-cyber-pink/10',
  info: 'border-cyber-cyan bg-cyber-cyan/10',
  warning: 'border-cyber-yellow bg-cyber-yellow/10',
};

const iconColors = {
  success: 'text-cyber-green',
  error: 'text-cyber-pink',
  info: 'text-cyber-cyan',
  warning: 'text-cyber-yellow',
};

export function Toast({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const Icon = toastIcons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress < 0 ? 0 : newProgress;
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'relative overflow-hidden rounded-lg border-2 p-4 shadow-lg',
            toastColors[type]
          )}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn('flex-shrink-0', iconColors[type])}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="text-sm font-semibold text-white mb-1">
                  {title}
                </h4>
              )}
              <p className="text-sm text-gray-300">{message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          {duration > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <motion.div
                className="h-full bg-current"
                style={{
                  width: `${progress}%`,
                  backgroundColor: iconColors[type].replace('text-', ''),
                }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast Provider
interface ToastItem extends ToastProps {
  id: string;
}

let toastId = 0;

export const toast = {
  show: (props: Omit<ToastProps, 'id'>) => {
    const id = String(toastId++);
    // 这里需要与状态管理集成
    // 暂时使用自定义事件
    window.dispatchEvent(
      new CustomEvent('toast-show', {
        detail: { ...props, id },
      })
    );
    return id;
  },
  success: (message: string, title?: string) => {
    return toast.show({ type: 'success', message, title });
  },
  error: (message: string, title?: string) => {
    return toast.show({ type: 'error', message, title });
  },
  info: (message: string, title?: string) => {
    return toast.show({ type: 'info', message, title });
  },
  warning: (message: string, title?: string) => {
    return toast.show({ type: 'warning', message, title });
  },
};

export default Toast;
