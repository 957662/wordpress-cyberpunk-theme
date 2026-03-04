'use client';

/**
 * Toast Component
 * Cyberpunk-styled toast notifications
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const TOAST_COLORS = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    glow: 'shadow-green-500/20',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    glow: 'shadow-red-500/20',
  },
  info: {
    bg: 'bg-cyber-cyan/10',
    border: 'border-cyber-cyan/30',
    icon: 'text-cyber-cyan',
    glow: 'shadow-cyber-cyan/20',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    glow: 'shadow-yellow-500/20',
  },
};

export function Toast({ id, type, title, message, onClose }: ToastProps) {
  const colors = TOAST_COLORS[type];
  const Icon = TOAST_ICONS[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative max-w-sm w-full p-4 ${colors.bg} border ${colors.border} rounded-lg shadow-lg ${colors.glow} backdrop-blur-sm`}
    >
      {/* Close Button */}
      <button
        onClick={() => onClose(id)}
        className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>

      {/* Content */}
      <div className="flex items-start gap-3 pr-6">
        {/* Icon */}
        <div className={`p-2 ${colors.bg} rounded-lg flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm">{title}</h4>
          {message && <p className="text-gray-300 text-sm mt-1">{message}</p>}
        </div>
      </div>

      {/* Progress Bar (optional - for auto-dismiss) */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-20" /> */}
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
  }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
