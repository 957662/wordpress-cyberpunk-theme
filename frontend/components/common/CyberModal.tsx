'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'cyber' | 'holo' | 'glitch';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export const CyberModal: React.FC<CyberModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  variant = 'cyber',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  overlayClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll
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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'cyber':
        return {
          container: 'bg-cyber-dark/95 border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,240,255,0.3)]',
          header: 'border-b border-cyber-cyan/20',
          title: 'text-cyber-cyan',
          closeButton: 'text-cyber-cyan hover:bg-cyber-cyan/20',
        };
      case 'holo':
        return {
          container: 'bg-cyber-dark/90 backdrop-blur-md border border-cyber-purple/30 shadow-[0_0_50px_rgba(157,0,255,0.3)]',
          header: 'border-b border-cyber-purple/20',
          title: 'text-cyber-purple',
          closeButton: 'text-cyber-purple hover:bg-cyber-purple/20',
        };
      case 'glitch':
        return {
          container: 'bg-cyber-dark/95 border-2 border-cyber-pink shadow-[0_0_50px_rgba(255,0,128,0.3)]',
          header: 'border-b-2 border-cyber-pink',
          title: 'text-cyber-pink',
          closeButton: 'text-cyber-pink hover:bg-cyber-pink/20',
        };
      default:
        return {
          container: 'bg-cyber-dark/95 border border-cyber-gray/30 shadow-2xl',
          header: 'border-b border-cyber-gray/20',
          title: 'text-cyber-white',
          closeButton: 'text-cyber-gray hover:bg-cyber-gray/20',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleOverlayClick}
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/80 backdrop-blur-sm',
              overlayClassName
            )}
          >
            {/* Modal */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className={cn(
                'relative w-full rounded-lg overflow-hidden',
                sizeClasses[size],
                variantStyles.container,
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              tabIndex={-1}
            >
              {/* Decorative corners for cyber variant */}
              {variant === 'cyber' && (
                <>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan/50" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan/50" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan/50" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan/50" />
                </>
              )}

              {/* Scanlines effect for glitch variant */}
              {variant === 'glitch' && (
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,128,0.1)_2px,rgba(255,0,128,0.1)_4px)]" />
                </div>
              )}

              {/* Header */}
              {(title || showCloseButton) && (
                <div className={cn('flex items-center justify-between px-6 py-4', variantStyles.header)}>
                  {title && (
                    <h2 id="modal-title" className={cn('text-lg font-semibold', variantStyles.title)}>
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className={cn('p-1 rounded transition-colors', variantStyles.closeButton)}
                      aria-label="关闭"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                {children}
              </div>

              {/* Animated border for holo variant */}
              {variant === 'holo' && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      background: 'linear-gradient(115deg, transparent 40%, rgba(157,0,255,0.1) 45%, rgba(157,0,255,0.2) 50%, rgba(157,0,255,0.1) 55%, transparent 60%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '200% 200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CyberModal;
