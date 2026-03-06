/**
 * 确认对话框组件
 */

'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  variant = 'info',
  isLoading = false,
}) => {
  // 处理确认
  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  // 键盘事件
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const variantStyles = {
    danger: {
      confirm: 'bg-red-500 hover:bg-red-600 text-white',
      icon: '🗑️',
    },
    warning: {
      confirm: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      icon: '⚠️',
    },
    info: {
      confirm: 'bg-cyber-cyan hover:bg-cyber-cyan/80 text-cyber-dark',
      icon: 'ℹ️',
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={!isLoading ? onClose : undefined}
          />

          {/* 模态框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-cyber-dark border border-cyber-cyan/30 rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* 顶部装饰线 */}
              <div className={`h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink`} />

              <div className="p-6">
                {/* 图标和标题 */}
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className="text-4xl flex-shrink-0"
                  >
                    {styles.icon}
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {title}
                    </h3>

                    {message && (
                      <p className="text-cyber-muted text-sm">
                        {message}
                      </p>
                    )}
                  </div>
                </div>

                {/* 按钮组 */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg font-medium',
                      'border border-cyber-cyan/30 text-cyber-cyan',
                      'hover:bg-cyber-cyan/10',
                      'transition-all',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    {cancelLabel}
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg font-medium',
                      'transition-all',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      styles.confirm,
                      isLoading && 'cursor-wait'
                    )}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        处理中...
                      </span>
                    ) : (
                      confirmLabel
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// 快捷确认函数
export function confirm(options: {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    document.body.appendChild(modal);

    const cleanup = () => {
      document.body.removeChild(modal);
    };

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    // 这里需要使用 React 渲染，简化版本使用原生确认
    if (typeof window !== 'undefined') {
      const result = window.confirm(`${title}\n\n${message || ''}`);
      resolve(result);
    }
  });
}

// 危险操作确认
export const ConfirmDelete = (props: Omit<ConfirmationModalProps, 'variant' | 'confirmLabel'>) => (
  <ConfirmationModal
    {...props}
    variant="danger"
    confirmLabel="删除"
    title={props.title || '确认删除'}
  />
);

// 警告操作确认
export const ConfirmWarning = (props: Omit<ConfirmationModalProps, 'variant' | 'confirmLabel'>) => (
  <ConfirmationModal
    {...props}
    variant="warning"
    confirmLabel="继续"
    title={props.title || '确认操作'}
  />
);

// 信息确认
export const ConfirmInfo = (props: Omit<ConfirmationModalProps, 'variant' | 'confirmLabel'>) => (
  <ConfirmationModal
    {...props}
    variant="info"
    confirmLabel="确认"
    title={props.title || '请确认'}
  />
);

export default ConfirmationModal;
