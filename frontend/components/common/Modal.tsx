'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  /**
   * 是否显示模态框
   */
  isOpen: boolean;

  /**
   * 关闭回调
   */
  onClose: () => void;

  /**
   * 标题
   */
  title?: string;

  /**
   * 内容
   */
  children: React.ReactNode;

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;

  /**
   * 点击背景是否关闭
   */
  closeOnBackdropClick?: boolean;

  /**
   * 按 ESC 键是否关闭
   */
  closeOnEscape?: boolean;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 内容区域的类名
   */
  contentClassName?: string;

  /**
   * 主题颜色
   */
  themeColor?: 'cyan' | 'purple' | 'pink';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

const themeColors = {
  cyan: 'border-cyber-cyan text-cyber-cyan shadow-glow-cyan',
  purple: 'border-cyber-purple text-cyber-purple shadow-glow-purple',
  pink: 'border-cyber-pink text-cyber-pink shadow-glow-pink',
};

/**
 * 模态框组件
 * 赛博朋克风格的弹窗对话框
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  contentClassName = '',
  themeColor = 'cyan',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = themeColors[themeColor];

  // 处理 ESC 键关闭
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // 禁用背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // 处理背景点击
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (
      closeOnBackdropClick &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
          />

          {/* 模态框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full bg-cyber-card border-2 rounded-lg shadow-2xl',
                theme,
                sizeClasses[size],
                className
              )}
            >
              {/* 头部 */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-cyber-border">
                  {title && (
                    <h2 className={cn('font-display font-bold text-xl', theme)}>
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        'hover:bg-cyber-darker',
                        'text-gray-400 hover:text-white'
                      )}
                      aria-label="关闭"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* 内容 */}
              <div className={cn('p-6', contentClassName)}>
                {children}
              </div>

              {/* 底部装饰线 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
