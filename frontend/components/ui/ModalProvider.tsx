'use client';

/**
 * Modal Provider Component
 * 全局 Modal/Dialog 系统
 * 支持多层级、嵌套、自定义样式
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

// ============================================
// 类型定义
// ============================================

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto';

export interface ModalOptions {
  id?: string;
  title?: string;
  content: ReactNode;
  size?: ModalSize;
  closable?: boolean;
  maskClosable?: boolean;
  showCloseButton?: boolean;
  fullscreen?: boolean;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
  onOpen?: () => void;
}

interface Modal extends ModalOptions {
  id: string;
  isOpen: boolean;
  level: number;
}

interface ModalContextType {
  modals: Modal[];
  open: (options: ModalOptions) => string;
  close: (id: string) => void;
  closeAll: () => void;
  isOpen: (id: string) => boolean;
}

// ============================================
// Context
// ============================================

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// ============================================
// 尺寸配置
// ============================================

const sizeClasses: Record<ModalSize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full h-full m-0 rounded-none',
  auto: 'w-auto',
};

// ============================================
// Modal Component
// ============================================

interface ModalItemProps {
  modal: Modal;
  zIndex: number;
  onClose: () => void;
}

const ModalItem = ({ modal, zIndex, onClose }: ModalItemProps) => {
  useEffect(() => {
    if (modal.onOpen && modal.isOpen) {
      modal.onOpen();
    }
  }, [modal.isOpen, modal.onOpen]);

  const handleMaskClick = () => {
    if (modal.maskClosable !== false) {
      onClose();
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal.closable !== false) {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modal.closable]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleMaskClick}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          relative w-full ${sizeClasses[modal.size || 'lg']}
          max-h-[90vh] overflow-hidden
          rounded-lg border border-cyan-500/30
          bg-gray-900/95 backdrop-blur-md
          shadow-2xl shadow-cyan-500/20
          ${modal.fullscreen ? 'w-screen h-screen m-0 rounded-none border-0' : ''}
          ${modal.className || ''}
        `}
      >
        {/* Header */}
        {(modal.title || modal.showCloseButton !== false) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">
              {modal.title}
            </h2>
            <div className="flex items-center gap-2">
              {/* Fullscreen Toggle */}
              {modal.fullscreen !== undefined && (
                <button
                  onClick={() => {
                    // Toggle fullscreen (you'd need to implement this in parent)
                  }}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {modal.fullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Close Button */}
              {modal.showCloseButton !== false && modal.closable !== false && (
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className={`
            overflow-y-auto
            ${modal.title ? 'py-4' : 'p-6'}
            ${modal.contentClassName || ''}
          `}
          style={{ maxHeight: modal.title ? 'calc(90vh - 80px)' : '90vh' }}
        >
          {modal.content}
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
      </motion.div>
    </div>
  );
};

// ============================================
// Provider Component
// ============================================

interface ModalProviderProps {
  children: ReactNode;
  baseZIndex?: number;
}

export const ModalProvider = ({ children, baseZIndex = 1000 }: ModalProviderProps) => {
  const [modals, setModals] = useState<Modal[]>([]);

  const open = useCallback((options: ModalOptions): string => {
    const id = options.id || `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const level = modals.length;

    const newModal: Modal = {
      ...options,
      id,
      isOpen: true,
      level,
      size: options.size || 'lg',
      closable: options.closable !== false,
      maskClosable: options.maskClosable !== false,
      showCloseButton: options.showCloseButton !== false,
    };

    setModals((prev) => [...prev, newModal]);

    return id;
  }, [modals.length]);

  const close = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAll = useCallback(() => {
    modals.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
  }, [modals]);

  const isOpen = useCallback((id: string) => {
    return modals.some((m) => m.id === id && m.isOpen);
  }, [modals]);

  const contextValue: ModalContextType = {
    modals,
    open,
    close,
    closeAll,
    isOpen,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {/* Modal Container */}
      <AnimatePresence mode="sync">
        {modals.map((modal, index) => (
          <ModalItem
            key={modal.id}
            modal={modal}
            zIndex={baseZIndex + index}
            onClose={() => close(modal.id)}
          />
        ))}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

// ============================================
// Hook
// ============================================

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};

// ============================================
// Convenience Hooks
// ============================================

export const useModalOpener = () => {
  const { open } = useModal();
  return open;
};

export const useModalCloser = () => {
  const { close } = useModal();
  return close;
};
