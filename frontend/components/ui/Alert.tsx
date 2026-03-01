/**
 * Alert Component
 * 警告/提示组件
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Alert 类型
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'cyber';

/**
 * Alert 组件属性
 */
export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
}

/**
 * 默认图标映射
 */
const defaultIcons = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  cyber: <AlertCircle className="w-5 h-5" />
};

/**
 * 样式映射
 */
const variantStyles = {
  info: {
    container: 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400',
    icon: 'text-blue-500'
  },
  success: {
    container: 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400',
    icon: 'text-green-500'
  },
  warning: {
    container: 'bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-400',
    icon: 'text-yellow-500'
  },
  error: {
    container: 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400',
    icon: 'text-red-500'
  },
  cyber: {
    container: 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-neon',
    icon: 'text-cyber-cyan'
  }
};

/**
 * Alert 组件
 */
export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  icon,
  dismissible = false
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = icon || defaultIcons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative flex items-start space-x-3 p-4 border-l-4 rounded',
        styles.container,
        className
      )}
      role="alert"
    >
      {/* 图标 */}
      <div className={cn('flex-shrink-0', styles.icon)}>
        {Icon}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-sm font-semibold mb-1">
            {title}
          </h3>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>

      {/* 关闭按钮 */}
      {(dismissible || onClose) && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

/**
 * AlertList 组件 - 用于显示多个 Alert
 */
export interface AlertListProps {
  alerts: Array<{
    id: string;
    variant?: AlertVariant;
    title?: string;
    content: React.ReactNode;
  }>;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function AlertList({ alerts, onDismiss, className }: AlertListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            title={alert.title}
            onClose={() => onDismiss?.(alert.id)}
            dismissible
          >
            {alert.content}
          </Alert>
        ))}
      </AnimatePresence>
    </div>
  );
}
