'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// ============================================
// 类型定义
// ============================================

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalOptions {
  title?: string;
  content: ReactNode;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  customClassName?: string;
  onClose?: () => void;
}

interface ModalContextType {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
  isOpen: boolean;
}

// ============================================
// Modal Context
// ============================================

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// ============================================
// Modal Provider
// ============================================

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((options: ModalOptions) => {
    setModal(options);
    setIsOpen(true);
    // 防止页面滚动
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setModal(null);
      document.body.style.overflow = '';
    }, 300);
  }, []);

  // ESC 键关闭
  useEffect(() => {
    if (!isOpen || !modal?.closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, modal, closeModal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <AnimatePresence>
        {isOpen && modal && (
          <ModalContent
            modal={modal}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

// ============================================
// Modal Content Component
// ============================================

interface ModalContentProps {
  modal: ModalOptions;
  onClose: () => void;
}

const ModalContent: React.FC<ModalContentProps> = ({ modal, onClose }) => {
  const {
    title,
    content,
    size = 'md',
    closeOnOverlay = true,
    showCloseButton = true,
    customClassName = '',
    onClose: customOnClose,
  } = modal;

  const handleClose = useCallback(() => {
    customOnClose?.();
    onClose();
  }, [customOnClose, onClose]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlay) {
      handleClose();
    }
  }, [closeOnOverlay, handleClose]);

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`relative ${sizeClasses[size]} w-full cyber-card ${customClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-cyber-cyan/30">
            <h3 className="text-xl font-bold text-cyber-white">{title}</h3>
            {showCloseButton && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2 rounded-lg text-cyber-gray hover:text-cyber-white hover:bg-cyber-dark/50 transition-all"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        )}

        {/* 内容 */}
        <div className={title ? 'p-6' : 'p-6 pt-0'}>
          {content}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// 预设的 Modal 组件
// ============================================

// Alert Modal
interface AlertModalProps {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  confirmText?: string;
  onConfirm?: () => void;
}

export const showAlert = ({
  title = '提示',
  message,
  type = 'info',
  confirmText = '确定',
  onConfirm,
}: AlertModalProps) => {
  const { openModal, closeModal } = useModal();

  const icons = {
    info: <Info className="w-12 h-12 text-cyber-cyan" />,
    success: <CheckCircle className="w-12 h-12 text-cyber-green" />,
    warning: <AlertTriangle className="w-12 h-12 text-cyber-yellow" />,
    error: <AlertCircle className="w-12 h-12 text-cyber-pink" />,
  };

  const colors = {
    info: 'text-cyber-cyan',
    success: 'text-cyber-green',
    warning: 'text-cyber-yellow',
    error: 'text-cyber-pink',
  };

  openModal({
    title,
    size: 'sm',
    content: (
      <div className="text-center space-y-4">
        <div className="flex justify-center">{icons[type]}</div>
        <p className={`text-${colors[type]}`}>{message}</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onConfirm?.();
            closeModal();
          }}
          className="w-full py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-white font-semibold rounded-lg cyber-glow"
        >
          {confirmText}
        </motion.button>
      </div>
    ),
  });
};

// Confirm Modal
interface ConfirmModalProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
  onConfirm: () => void | Promise<void>;
}

export const showConfirm = ({
  title = '确认',
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'danger',
  onConfirm,
}: ConfirmModalProps) => {
  const { openModal, closeModal } = useModal();

  const colors = {
    danger: 'from-cyber-pink to-red-600',
    warning: 'from-cyber-yellow to-orange-500',
  };

  openModal({
    title,
    size: 'sm',
    content: (
      <div className="space-y-6">
        <p className="text-cyber-gray">{message}</p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={closeModal}
            className="flex-1 py-3 bg-cyber-dark/50 border border-cyber-cyan/30 text-cyber-cyan font-semibold rounded-lg hover:bg-cyber-cyan/10 transition-all"
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              await onConfirm();
              closeModal();
            }}
            className={`flex-1 py-3 bg-gradient-to-r ${colors[type]} text-cyber-white font-semibold rounded-lg cyber-glow`}
          >
            {confirmText}
          </motion.button>
        </div>
      </div>
    ),
  });
};

// Prompt Modal
interface PromptModalProps {
  title?: string;
  message: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void | Promise<void>;
}

export const showPrompt = ({
  title = '输入',
  message,
  placeholder = '请输入...',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
}: PromptModalProps) => {
  const { openModal, closeModal } = useModal();
  const [value, setValue] = React.useState('');

  openModal({
    title,
    size: 'sm',
    content: (
      <div className="space-y-4">
        <p className="text-cyber-gray text-sm">{message}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg text-cyber-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan transition-all"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              onConfirm(value);
              closeModal();
            }
          }}
        />
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={closeModal}
            className="flex-1 py-3 bg-cyber-dark/50 border border-cyber-cyan/30 text-cyber-cyan font-semibold rounded-lg hover:bg-cyber-cyan/10 transition-all"
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              if (value.trim()) {
                await onConfirm(value);
                closeModal();
              }
            }}
            disabled={!value.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-white font-semibold rounded-lg cyber-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {confirmText}
          </motion.button>
        </div>
      </div>
    ),
  });
};

// Custom Modal Hook
export const useCustomModal = () => {
  const { openModal } = useModal();

  return useCallback(
    (options: ModalOptions) => {
      return new Promise<boolean>((resolve) => {
        openModal({
          ...options,
          onClose: () => {
            options.onClose?.();
            resolve(false);
          },
        });
      });
    },
    [openModal]
  );
};

export default ModalProvider;
