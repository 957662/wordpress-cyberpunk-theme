'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'neon' | 'hologram' | 'glass';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full mx-4',
};

export const CyberModal: React.FC<CyberModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'neon',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
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

    return () => {
      previousActiveElement.current?.focus();
    };
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

  const variantStyles = {
    neon: 'bg-gradient-to-br from-[#0a0a0f] to-[#16162a] border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,240,255,0.3)]',
    hologram: 'bg-gradient-to-br from-cyber-purple/10 to-cyber-cyan/10 border border-cyber-purple/50 backdrop-blur-xl',
    glass: 'bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20',
  };

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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full rounded-lg',
                variantStyles[variant],
                sizeStyles[size],
                className
              )}
              tabIndex={-1}
            >
              {/* Scanlines effect */}
              <div className="absolute inset-0 bg-[url('/public/patterns/scanlines.svg')] opacity-5 pointer-events-none rounded-lg" />

              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-cyber-cyan/20">
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-xl font-bold text-white font-mono"
                    >
                      {title}
                    </h2>
                  )}

                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-cyber-cyan/20 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 relative z-10">
                {children}
              </div>

              {/* Glowing border */}
              <div className="absolute inset-0 rounded-lg pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyber-cyan/50" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-cyan/50" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyber-cyan/50" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyber-cyan/50" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CyberModal;
