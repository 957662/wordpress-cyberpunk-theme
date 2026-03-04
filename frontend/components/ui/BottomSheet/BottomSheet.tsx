/**
 * CyberPress Platform - BottomSheet Component
 * 底部抽屉组件 - 赛博朋克风格
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: 'auto' | 'half' | 'full' | number;
  snapPoints?: number[];
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showHandle?: boolean;
  className?: string;
  contentClassName?: string;
}

const heightStyles = {
  auto: 'h-auto',
  half: 'h-[50vh]',
  full: 'h-[90vh]',
};

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  snapPoints,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showHandle = true,
  className,
  contentClassName,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentSnap, setCurrentSnap] = useState(0);

  // ESC 键关闭
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // 防止背景滚动
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

  const getHeightStyle = () => {
    if (typeof height === 'number') {
      return { height: `${height}px` };
    }
    return heightStyles[height];
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* 底部抽屉 */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center">
            <motion.div
              ref={sheetRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className={cn(
                'relative w-full max-w-4xl bg-cyber-card border-t border-cyber-border rounded-t-2xl shadow-2xl',
                className
              )}
              style={typeof height === 'number' ? { height: `${height}px` } : undefined}
            >
              {/* 拖动把手 */}
              {showHandle && (
                <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
                  <div className="w-12 h-1.5 bg-cyber-border rounded-full" />
                </div>
              )}

              {/* 标题栏 */}
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border">
                  <h2 className="text-xl font-display font-semibold text-cyber-cyan">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-cyber-muted hover:text-cyber-cyan transition-colors rounded-lg hover:bg-cyber-border/20"
                    aria-label="关闭"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* 内容区域 */}
              <div
                ref={contentRef}
                className={cn(
                  'overflow-y-auto overflow-x-hidden',
                  !title && 'pt-2',
                  contentClassName
                )}
                style={{
                  maxHeight: typeof height === 'number' ? `${height - 60}px` : 'calc(100vh - 200px)',
                }}
              >
                <div className="p-6">
                  {children}
                </div>
              </div>

              {/* 底部装饰线 */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-neon-cyan" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// 添加 useState 导入
import { useState } from 'react';
