/**
 * Alert Component
 * 警告提示组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-500',
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-500',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-500',
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-500',
  },
};

export function Alert({
  type = 'info',
  title,
  message,
  closable = false,
  onClose,
  className,
}: AlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative p-4 rounded-lg border-l-4',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className={cn('flex-shrink-0', config.color)}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </div>

        {/* Close Button */}
        {closable && onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default Alert;
