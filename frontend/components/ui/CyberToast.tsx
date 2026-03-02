/**
 * 赛博朋克风格通知组件
 * 带有霓虹发光效果的通知系统
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// 通知类型
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// 通知配置
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast 上下文
interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // 自动移除
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Hook: useToast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// 快捷方法
export const toast = {
  success: (message: string, title?: string) => {
    const context = (window as any).__toastContext;
    context?.addToast({ type: 'success', message, title });
  },
  error: (message: string, title?: string) => {
    const context = (window as any).__toastContext;
    context?.addToast({ type: 'error', message, title });
  },
  warning: (message: string, title?: string) => {
    const context = (window as any).__toastContext;
    context?.addToast({ type: 'warning', message, title });
  },
  info: (message: string, title?: string) => {
    const context = (window as any).__toastContext;
    context?.addToast({ type: 'info', message, title });
  },
};

// Toast 容器
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// 单个 Toast 项
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const configs = {
    success: {
      icon: Check,
      color: 'green',
      border: 'border-cyber-green',
      bg: 'bg-cyber-green/10',
      glow: 'shadow-[0_0_15px_rgba(0,255,136,0.3)]',
    },
    error: {
      icon: XCircle,
      color: 'pink',
      border: 'border-cyber-pink',
      bg: 'bg-cyber-pink/10',
      glow: 'shadow-[0_0_15px_rgba(255,0,128,0.3)]',
    },
    warning: {
      icon: AlertTriangle,
      color: 'yellow',
      border: 'border-cyber-yellow',
      bg: 'bg-cyber-yellow/10',
      glow: 'shadow-[0_0_15px_rgba(240,255,0,0.3)]',
    },
    info: {
      icon: Info,
      color: 'cyan',
      border: 'border-cyber-cyan',
      bg: 'bg-cyber-cyan/10',
      glow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]',
    },
  };

  const config = configs[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-lg border-2 backdrop-blur-md',
        config.border,
        config.bg,
        isHovered && config.glow
      )}
    >
      {/* 进度条 */}
      <motion.div
        className={cn('absolute bottom-0 left-0 h-1', config.border.replace('border', 'bg'))}
        initial={{ width: '100%' }}
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      />

      <div className="p-4 flex items-start gap-3">
        {/* 图标 */}
        <div className={cn('flex-shrink-0', config.border.replace('border', 'text'))}>
          <Icon className="w-5 h-5" />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className="font-display font-bold text-white text-sm mb-1">
              {toast.title}
            </h4>
          )}
          <p className="text-gray-300 text-sm">{toast.message}</p>

          {/* 操作按钮 */}
          {toast.action && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toast.action.onClick}
              className={cn(
                'mt-2 px-3 py-1 text-xs font-medium rounded',
                config.border.replace('border', 'text'),
                config.border,
                'border hover:bg-white/5 transition-colors'
              )}
            >
              {toast.action.label}
            </motion.button>
          )}
        </div>

        {/* 关闭按钮 */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * 简化的 Toast 组件（用于直接使用）
 */
export interface CyberToastProps {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  show?: boolean;
}

export function CyberToast({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  show = true,
}: CyberToastProps) {
  const [isVisible, setIsVisible] = useState(show);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="cyber-card px-6 py-4 flex items-center gap-4">
            {type === 'success' && <Check className="w-5 h-5 text-cyber-green" />}
            {type === 'error' && <XCircle className="w-5 h-5 text-cyber-pink" />}
            {type === 'warning' && <AlertTriangle className="w-5 h-5 text-cyber-yellow" />}
            {type === 'info' && <Info className="w-5 h-5 text-cyber-cyan" />}

            <div>
              {title && <h4 className="font-bold text-white">{title}</h4>}
              <p className="text-gray-300 text-sm">{message}</p>
            </div>

            <button onClick={handleClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Toast 状态指示器
 */
export function ToastStatus({ type }: { type: ToastType }) {
  const configs = {
    success: { color: 'bg-cyber-green', glow: 'shadow-[0_0_10px_rgba(0,255,136,0.5)]' },
    error: { color: 'bg-cyber-pink', glow: 'shadow-[0_0_10px_rgba(255,0,128,0.5)]' },
    warning: { color: 'bg-cyber-yellow', glow: 'shadow-[0_0_10px_rgba(240,255,0,0.5)]' },
    info: { color: 'bg-cyber-cyan', glow: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]' },
  };

  const config = configs[type];

  return (
    <motion.div
      className={cn('w-2 h-2 rounded-full', config.color, config.glow)}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}
