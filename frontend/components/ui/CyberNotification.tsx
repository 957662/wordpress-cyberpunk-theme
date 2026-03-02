'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberNotificationProps {
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export const CyberNotification: React.FC<CyberNotificationProps> = ({
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const typeStyles = {
    success: {
      border: 'border-green-500/50',
      bg: 'bg-green-500/10',
      icon: (
        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      glow: 'shadow-green-500/20',
    },
    error: {
      border: 'border-red-500/50',
      bg: 'bg-red-500/10',
      icon: (
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      glow: 'shadow-red-500/20',
    },
    warning: {
      border: 'border-yellow-500/50',
      bg: 'bg-yellow-500/10',
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      glow: 'shadow-yellow-500/20',
    },
    info: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/10',
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      glow: 'shadow-cyan-500/20',
    },
  };

  const styles = typeStyles[type];

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative max-w-md w-full border rounded-lg p-4 backdrop-blur-sm',
        'transition-all duration-300',
        styles.border,
        styles.bg,
        styles.glow,
        isClosing ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
        className
      )}
      style={{
        boxShadow: `0 0 20px ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' :
                         type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                         type === 'warning' ? 'rgba(234, 179, 8, 0.3)' :
                         'rgba(6, 182, 212, 0.3)'}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          {message && <p className="mt-1 text-sm text-gray-300">{message}</p>}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all duration-100 ease-linear"
          style={{
            animation: `shrink ${duration}ms linear`,
          }}
        />
      )}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default CyberNotification;
