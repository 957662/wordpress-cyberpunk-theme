/**
 * Toast 通知容器组件
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/lib/hooks/useToast';
import { CheckIcon, ErrorIcon, WarningIcon, InfoIcon, CloseIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto min-w-[300px] max-w-md"
          >
            <ToastItem toast={toast} onDismiss={() => removeToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  };
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const icons = {
    success: <CheckIcon className="w-5 h-5" />,
    error: <ErrorIcon className="w-5 h-5" />,
    warning: <WarningIcon className="w-5 h-5" />,
    info: <InfoIcon className="w-5 h-5" />,
  };

  const styles = {
    success: 'border-cyber-green bg-cyber-green/10',
    error: 'border-cyber-pink bg-cyber-pink/10',
    warning: 'border-cyber-yellow bg-cyber-yellow/10',
    info: 'border-cyber-cyan bg-cyber-cyan/10',
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg',
        styles[toast.type]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 text-sm text-white">{toast.message}</div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
