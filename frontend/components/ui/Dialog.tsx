/**
 * 对话框/模态框组件
 * 赛博朋克风格对话框
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CloseIcon } from '@/components/icons';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'neon' | 'glass';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

const variants = {
  default: 'bg-cyber-card border border-cyber-border shadow-xl',
  neon: 'bg-cyber-card border-2 border-cyber-cyan shadow-neon-cyan',
  glass: 'bg-cyber-card/80 backdrop-blur-xl border border-cyber-border/50',
};

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
}: DialogProps) {
  // ESC 键关闭
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // 滚动锁定
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* 对话框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'dialog-title' : undefined}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className={cn(
                'relative w-full rounded-lg pointer-events-auto',
                sizes[size],
                variants[variant],
                className
              )}
            >
              {/* 头部 */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-cyber-border">
                  {title && (
                    <h2
                      id="dialog-title"
                      className="text-xl font-display font-bold text-cyber-cyan"
                    >
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 text-cyber-muted hover:text-cyber-cyan transition-colors"
                      aria-label="关闭"
                    >
                      <CloseIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* 内容 */}
              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {children}
              </div>

              {/* 装饰边框 */}
              {variant === 'neon' && (
                <>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan" />
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// 对话框内容组件
export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

// 对话框底部组件
export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function DialogFooter({
  children,
  className,
  align = 'right',
}: DialogFooterProps) {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'flex gap-3 pt-6 border-t border-cyber-border',
        alignments[align],
        className
      )}
    >
      {children}
    </div>
  );
}

// 对话框确认组件
export interface DialogConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function DialogConfirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'danger',
}: DialogConfirmProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: 'text-cyber-pink',
    warning: 'text-cyber-yellow',
    info: 'text-cyber-cyan',
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <DialogContent>
        <p className="text-cyber-muted">{message}</p>
      </DialogContent>
      <DialogFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded border border-cyber-border text-cyber-muted hover:text-white hover:border-cyber-cyan transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={cn(
            'px-4 py-2 rounded font-medium transition-colors',
            variant === 'danger'
              ? 'bg-cyber-pink text-white hover:bg-cyber-pink/90'
              : variant === 'warning'
              ? 'bg-cyber-yellow text-cyber-dark hover:bg-cyber-yellow/90'
              : 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90'
          )}
        >
          {confirmText}
        </button>
      </DialogFooter>
    </Dialog>
  );
}
