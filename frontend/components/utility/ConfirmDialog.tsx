/**
 * Confirm Dialog Component
 *
 * 确认对话框组件，用于需要用户确认的操作
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type ConfirmDialogType = 'warning' | 'danger' | 'info' | 'success';

export interface ConfirmDialogProps {
  open: boolean;
  type?: ConfirmDialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

const dialogIcons = {
  warning: <AlertTriangle className="w-12 h-12 text-cyber-yellow" />,
  danger: <AlertTriangle className="w-12 h-12 text-cyber-pink" />,
  info: <Info className="w-12 h-12 text-cyber-cyan" />,
  success: <CheckCircle className="w-12 h-12 text-cyber-green" />,
};

const dialogStyles: Record<ConfirmDialogType, string> = {
  warning: 'border-cyber-yellow bg-cyber-yellow/5',
  danger: 'border-cyber-pink bg-cyber-pink/5',
  info: 'border-cyber-cyan bg-cyber-cyan/5',
  success: 'border-cyber-green bg-cyber-green/5',
};

const buttonStyles: Record<ConfirmDialogType, string> = {
  warning: 'hover:bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow',
  danger: 'hover:bg-cyber-pink/20 border-cyber-pink text-cyber-pink',
  info: 'hover:bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan',
  success: 'hover:bg-cyber-green/20 border-cyber-green text-cyber-green',
};

export function ConfirmDialog({
  open,
  type = 'warning',
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  className,
}: ConfirmDialogProps) {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onCancel}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full max-w-md rounded-lg border-2 p-6 shadow-2xl backdrop-blur-md',
                dialogStyles[type],
                'bg-cyber-dark',
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onCancel}
                className="absolute right-4 top-4 p-1 rounded hover:bg-black/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {dialogIcons[type]}
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-sm opacity-80">{message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  className={cn('flex-1', buttonStyles[type])}
                  variant="outline"
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for easier usage
export function useConfirmDialog() {
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    type: ConfirmDialogType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    open: false,
    type: 'warning',
    title: '',
    message: '',
  });

  const confirm = React.useCallback(
    (
      type: ConfirmDialogType,
      title: string,
      message: string
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setDialog({
          open: true,
          type,
          title,
          message,
          onConfirm: () => resolve(true),
        });
      });
    },
    []
  );

  const handleConfirm = React.useCallback(() => {
    dialog.onConfirm?.();
    setDialog((prev) => ({ ...prev, open: false }));
  }, [dialog]);

  const handleCancel = React.useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    dialog,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
