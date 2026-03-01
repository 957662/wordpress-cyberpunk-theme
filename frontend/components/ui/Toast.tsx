/**
 * Toast 通知组件
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, ErrorIcon, WarningIcon, InfoIcon, CloseIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const icons = {
  success: CheckIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

const colors = {
  success: 'cyber-green',
  error: 'cyber-pink',
  warning: 'cyber-yellow',
  info: 'cyber-cyan',
};

export function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%', y: '-50%' }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: '100%', scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="relative pointer-events-auto"
    >
      <div
        className={cn(
          'flex items-start gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-md border-l-4',
          'bg-cyber-card border-cyber-border',
          type === 'success' && 'border-l-cyber-green',
          type === 'error' && 'border-l-cyber-pink',
          type === 'warning' && 'border-l-cyber-yellow',
          type === 'info' && 'border-l-cyber-cyan'
        )}
      >
        {/* Icon */}
        <div className={cn('flex-shrink-0', `text-${colors[type]}`)}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-medium text-white mb-1">{title}</h4>
          )}
          <p className="text-sm text-gray-400">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={cn(
            'absolute bottom-0 left-0 h-0.5',
            `bg-${colors[type]}`
          )}
        />
      )}
    </motion.div>
  );
}

// Toast 容器
export function ToastContainer({ toasts }: { toasts: Omit<ToastProps, 'onClose'>[] }) {
  const [localToasts, setLocalToasts] = useState(toasts);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {localToasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => {
              setLocalToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
