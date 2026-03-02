/**
 * Drawer - 抽屉组件
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  children,
  placement = 'right',
  size = 'md',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}: DrawerProps) {
  // 处理 ESC 键
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

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

  const sizeStyles = {
    sm: placement === 'left' || placement === 'right' ? 'w-80' : 'h-80',
    md: placement === 'left' || placement === 'right' ? 'w-96' : 'h-96',
    lg: placement === 'left' || placement === 'right' ? 'w-[600px]' : 'h-[600px]',
    xl: placement === 'left' || placement === 'right' ? 'w-[800px]' : 'h-[800px]',
    full: placement === 'left' || placement === 'right' ? 'w-full' : 'h-full',
  };

  const placementStyles = {
    left: 'inset-y-0 left-0 h-full',
    right: 'inset-y-0 right-0 h-full',
    top: 'inset-x-0 top-0 w-full',
    bottom: 'inset-x-0 bottom-0 w-full',
  };

  const animationVariants = {
    left: {
      closed: { x: '-100%' },
      open: { x: 0 },
    },
    right: {
      closed: { x: '100%' },
      open: { x: 0 },
    },
    top: {
      closed: { y: '-100%' },
      open: { y: 0 },
    },
    bottom: {
      closed: { y: '100%' },
      open: { y: 0 },
    },
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeOnOutsideClick ? onClose : undefined}
          />

          {/* 抽屉 */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={animationVariants[placement]}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed bg-cyber-dark/95 border border-cyber-cyan/30 shadow-2xl z-50',
              placementStyles[placement],
              sizeStyles[size],
              className
            )}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="h-full overflow-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// 抽屉头部
export interface DrawerHeaderProps {
  children: ReactNode;
  className?: string;
}

export function DrawerHeader({ children, className }: DrawerHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-cyber-cyan/20', className)}>
      {children}
    </div>
  );
}

// 抽屉内容
export interface DrawerBodyProps {
  children: ReactNode;
  className?: string;
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

// 抽屉底部
export interface DrawerFooterProps {
  children: ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-cyber-cyan/20', className)}>
      {children}
    </div>
  );
}
