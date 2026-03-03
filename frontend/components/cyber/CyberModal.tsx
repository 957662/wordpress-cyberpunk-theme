/**
 * CyberModal - 赛博朋克风格模态框组件
 */
'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CyberModalProps {
  /** 是否显示 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题 */
  title?: string;
  /** 子元素 */
  children: React.ReactNode;
  /** 大小 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 点击背景是否关闭 */
  closeOnBackdropClick?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnEscape?: boolean;
  /** 自定义样式 */
  className?: string;
  /** 变体 */
  variant?: 'default' | 'neon' | 'hologram' | 'glitch';
  /** 是否居中 */
  centered?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

const variantClasses = {
  default: 'border-cyber-cyan/50 shadow-lg shadow-cyber-cyan/20',
  neon: 'border-cyber-cyan shadow-lg shadow-cyber-cyan/50',
  hologram: 'border-cyber-purple shadow-lg shadow-cyber-purple/50 backdrop-blur-sm',
  glitch: 'border-laser-pink shadow-lg shadow-laser-pink/30',
};

/**
 * 赛博朋克风格模态框
 *
 * @example
 * ```tsx
 * <CyberModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="标题"
 *   size="md"
 *   variant="neon"
 * >
 *   <p>内容</p>
 * </CyberModal>
 * ```
 */
export const CyberModal: React.FC<CyberModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  variant = 'default',
  centered = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 键关闭
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  // 滚动锁定
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

  // 焦点管理
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      firstElement?.focus();

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* 模态框 */}
          <div
            className={`fixed inset-0 z-50 flex ${centered ? 'items-center justify-center' : 'items-start justify-center pt-20'} p-4`}
            onClick={handleBackdropClick}
            >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`
                relative w-full ${sizeClasses[size]}
                bg-cyber-dark border-2 ${variantClasses[variant]}
                rounded-lg overflow-hidden
                ${className}
              `}
              onClick={e => e.stopPropagation()}
            >
              {/* 标题栏 */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-4 border-b border-cyber-cyan/20 bg-cyber-dark/50">
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-lg font-semibold text-cyber-cyan text-glow-cyan"
                    >
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1 rounded hover:bg-cyber-cyan/10 transition-colors"
                      aria-label="关闭"
                    >
                      <X className="w-5 h-5 text-cyber-cyan" />
                    </button>
                  )}
                </div>
              )}

              {/* 内容区域 */}
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                {children}
              </div>

              {/* 扫描线效果 */}
              {variant === 'default' || variant === 'neon' ? (
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/20 to-transparent animate-scan" />
                </div>
              ) : null}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
};

/**
 * 模态框头部
 */
export const CyberModalHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

/**
 * 模态框主体
 */
export const CyberModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

/**
 * 模态框底部
 */
export const CyberModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end gap-2 mt-4 pt-4 border-t border-cyber-cyan/20 ${className}`}>
      {children}
    </div>
  );
};

export default CyberModal;
