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
  variant?: 'default' | 'neon' | 'hologram';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export const CyberModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: CyberModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus the modal
      modalRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      // Restore focus
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const variants = {
    default: cn(
      'bg-cyber-card/95 backdrop-blur-xl border border-cyber-border/50',
      'shadow-[0_0_50px_rgba(0,0,0,0.8)]'
    ),
    neon: cn(
      'bg-cyber-dark/95 backdrop-blur-xl border-2 border-cyan-400/50',
      'shadow-[0_0_50px_rgba(0,240,255,0.3)]'
    ),
    hologram: cn(
      'bg-gradient-to-br from-cyan-950/90 to-purple-950/90 backdrop-blur-xl border border-cyan-400/30',
      'shadow-[0_0_60px_rgba(0,240,255,0.4)]'
    ),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={handleBackdropClick}
          >
            {/* Scanline effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent"
                animate={{
                  y: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'linear',
                }}
              />
            </div>
          </motion.div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'relative w-full rounded-xl overflow-hidden',
                variants[variant],
                sizeStyles[size]
              )}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
            >
              {/* Grid pattern background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%">
                  <pattern id="modal-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-cyan-400"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#modal-grid-pattern)" />
                </svg>
              </div>

              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-cyan-400/20 relative z-10">
                  {title && (
                    <motion.h2
                      id="modal-title"
                      className="text-xl font-semibold text-cyan-400"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {title}
                    </motion.h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 relative z-10">
                {children}
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-cyan-400 to-transparent" />
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-cyan-400 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-cyan-400 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />
                <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-cyan-400 to-transparent" />
              </div>

              <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-cyan-400 to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-cyan-400 to-transparent" />
              </div>

              {/* Glow effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                  boxShadow: 'inset 0 0 100px rgba(0, 240, 255, 0.1)',
                }}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

CyberModal.displayName = 'CyberModal';
