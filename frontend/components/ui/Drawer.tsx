/**
 * 抽屉组件
 * 从侧边滑出的面板
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CloseIcon } from '@/components/icons';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'neon' | 'glass';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const sizes = {
  sm: '320px',
  md: '400px',
  lg: '480px',
  xl: '600px',
};

const verticalSizes = {
  sm: '320px',
  md: '400px',
  lg: '480px',
  xl: '600px',
};

const variants = {
  default: 'bg-cyber-card border-cyber-border',
  neon: 'bg-cyber-card border-2 border-cyber-cyan shadow-neon-cyan',
  glass: 'bg-cyber-card/90 backdrop-blur-xl border-cyber-border/50',
};

export function Drawer({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
}: DrawerProps) {
  const isHorizontal = position === 'left' || position === 'right';
  const sizeValue = isHorizontal ? sizes[size] : verticalSizes[size];

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

  const getPositionStyles = () => {
    switch (position) {
      case 'left':
        return {
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: sizeValue,
        };
      case 'right':
        return {
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: sizeValue,
        };
      case 'top':
        return {
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          height: sizeValue,
        };
      case 'bottom':
        return {
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: sizeValue,
        };
    }
  };

  const getInitialVariants = () => {
    switch (position) {
      case 'left':
        return { x: '-100%' };
      case 'right':
        return { x: '100%' };
      case 'top':
        return { y: '-100%' };
      case 'bottom':
        return { y: '100%' };
    }
  };

  const getAnimateVariants = () => {
    switch (position) {
      case 'left':
      case 'right':
        return { x: 0 };
      case 'top':
      case 'bottom':
        return { y: 0 };
    }
  };

  const getExitVariants = () => {
    return getInitialVariants();
  };

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

          {/* 抽屉 */}
          <motion.div
            initial={getInitialVariants()}
            animate={getAnimateVariants()}
            exit={getExitVariants()}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className={cn(
              'z-50 overflow-hidden',
              variants[variant],
              position === 'left' && 'border-r',
              position === 'right' && 'border-l',
              position === 'top' && 'border-b',
              position === 'bottom' && 'border-t',
              className
            )}
            style={getPositionStyles()}
          >
            {/* 头部 */}
            {showCloseButton && (
              <div className="flex items-center justify-between p-4 border-b border-cyber-border">
                <div className="flex-1" />
                <button
                  onClick={onClose}
                  className="p-2 text-cyber-muted hover:text-cyber-cyan transition-colors"
                  aria-label="关闭"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* 内容 */}
            <div className="h-full overflow-y-auto p-4 custom-scrollbar">
              {children}
            </div>

            {/* 装饰线 */}
            {variant === 'neon' && (
              <div
                className={cn(
                  'absolute pointer-events-none',
                  position === 'left' && 'right-0 top-0 bottom-0 w-0.5 bg-cyber-cyan shadow-neon-cyan',
                  position === 'right' && 'left-0 top-0 bottom-0 w-0.5 bg-cyber-cyan shadow-neon-cyan',
                  position === 'top' && 'bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan shadow-neon-cyan',
                  position === 'bottom' && 'top-0 left-0 right-0 h-0.5 bg-cyber-cyan shadow-neon-cyan'
                )}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// 抽屉头部组件
export interface DrawerHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function DrawerHeader({
  title,
  subtitle,
  icon,
  className,
}: DrawerHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-cyber-cyan">{icon}</div>}
        <div>
          <h3 className="text-lg font-display font-bold text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-cyber-muted mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// 抽屉内容组件
export interface DrawerBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

// 抽屉底部组件
export interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-cyber-border', className)}>
      {children}
    </div>
  );
}
