/**
 * 确认对话框组件
 * 用于需要用户确认的危险操作
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const typeConfig = {
  danger: {
    icon: <AlertTriangle className="w-6 h-6" />,
    iconColor: 'text-cyber-pink',
    iconBg: 'bg-cyber-pink/10',
    confirmColor: 'bg-cyber-pink hover:bg-cyber-pink/80',
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6" />,
    iconColor: 'text-cyber-yellow',
    iconBg: 'bg-cyber-yellow/10',
    confirmColor: 'bg-cyber-yellow text-cyber-dark hover:bg-cyber-yellow/80',
  },
  info: {
    icon: <Info className="w-6 h-6" />,
    iconColor: 'text-cyber-cyan',
    iconBg: 'bg-cyber-cyan/10',
    confirmColor: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80',
  },
  success: {
    icon: <CheckCircle className="w-6 h-6" />,
    iconColor: 'text-cyber-green',
    iconBg: 'bg-cyber-green/10',
    confirmColor: 'bg-cyber-green text-cyber-dark hover:bg-cyber-green/80',
  },
};

/**
 * 确认对话框组件
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  type = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const config = typeConfig[type];
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelButtonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !loading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, loading, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={loading ? undefined : onCancel}
          />

          {/* 对话框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative bg-cyber-card border border-cyber-border rounded-lg shadow-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* 图标 */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${config.iconBg} ${config.iconColor} mb-4`}>
                {config.icon}
              </div>

              {/* 标题 */}
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

              {/* 消息 */}
              <p className="text-cyber-muted mb-6">{message}</p>

              {/* 按钮 */}
              <div className="flex items-center justify-end space-x-3">
                <motion.button
                  ref={cancelButtonRef}
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 border border-cyber-border text-cyber-muted rounded-lg hover:border-cyber-cyan hover:text-cyber-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cancelLabel}
                </motion.button>

                <motion.button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmColor}`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <motion.span
                        className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      处理中...
                    </span>
                  ) : (
                    confirmLabel
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * 使用确认对话框的 Hook
 */
export function useConfirmDialog() {
  const [state, setState] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    type: ConfirmDialogProps['type'];
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => {},
  });

  const confirm = React.useCallback(
    (
      title: string,
      message: string,
      type: ConfirmDialogProps['type'] = 'danger'
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          open: true,
          title,
          message,
          type,
          onConfirm: () => {
            setState((prev) => ({ ...prev, open: false }));
            resolve(true);
          },
        });
      });
    },
    []
  );

  const cancel = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    ...state,
    confirm,
    cancel,
  };
}

/**
 * 高阶组件：为组件添加确认功能
 */
export function withConfirm<P extends object>(
  Component: React.ComponentType<P>,
  confirmConfig: {
    title: string;
    message: string;
    type?: ConfirmDialogProps['type'];
  }
): React.ComponentType<P> {
  return function WithConfirmComponent(props: P) {
    const confirm = useConfirmDialog();

    const handleClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      const confirmed = await confirm.confirm(
        confirmConfig.title,
        confirmConfig.message,
        confirmConfig.type
      );

      if (confirmed) {
        // 执行原始操作
        const element = e.target as HTMLElement;
        element.click();
      }
    };

    return <Component {...props} onClick={handleClick} />;
  };
}

/**
 * 确认按钮组件
 */
export function ConfirmButton({
  children,
  title,
  message,
  type = 'danger',
  onConfirm,
  className = '',
}: {
  children: React.ReactNode;
  title: string;
  message: string;
  type?: ConfirmDialogProps['type'];
  onConfirm: () => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className={className}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.button>

      <ConfirmDialog
        open={open}
        title={title}
        message={message}
        type={type}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        loading={loading}
      />
    </>
  );
}

/**
 * 霓虹确认对话框（赛博朋克风格）
 */
export function NeonConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  onConfirm,
  onCancel,
}: Omit<ConfirmDialogProps, 'type' | 'loading'>) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 扫描线效果 */}
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <ConfirmDialog
            open={open}
            title={title}
            message={message}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            type="danger"
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
