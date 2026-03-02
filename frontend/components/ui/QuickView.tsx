/**
 * QuickView Component - 快速预览组件
 * 在不离开当前页面的情况下预览内容
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, Maximize2, ExternalLink, Copy, Check } from 'lucide-react';

export interface QuickViewProps {
  trigger: React.ReactNode;
  title?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  position?: 'center' | 'right' | 'left';
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  actions?: QuickViewAction[];
}

export interface QuickViewAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export function QuickView({
  trigger,
  title,
  content,
  footer,
  className,
  size = 'md',
  position = 'center',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  onOpen,
  onClose,
  actions = [],
}: QuickViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  const positions = {
    center: 'items-center justify-center',
    right: 'items-center justify-end',
    left: 'items-center justify-start',
  };

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // ESC 键关闭
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]);

  // 禁止背景滚动
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

  // 复制内容
  const handleCopy = async () => {
    if (contentRef.current) {
      const text = contentRef.current.innerText;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <>
      {/* 触发器 */}
      <div onClick={handleOpen} className="cursor-pointer">
        {trigger}
      </div>

      {/* 预览弹窗 */}
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
              onClick={closeOnOutsideClick ? handleClose : undefined}
            />

            {/* 内容容器 */}
            <div
              className={cn(
                "fixed inset-0 z-50 flex p-4 overflow-auto",
                positions[position]
              )}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative bg-cyber-card border border-cyber-border rounded-lg shadow-2xl w-full",
                  sizes[size],
                  className
                )}
              >
                {/* 头部 */}
                {(title || actions.length > 0) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border">
                    <div className="flex items-center gap-3">
                      {title && (
                        <h2 className="text-xl font-semibold text-cyber-text">{title}</h2>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 操作按钮 */}
                      {actions.map((action, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={action.onClick}
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            action.variant === 'primary' && "bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90",
                            action.variant === 'secondary' && "bg-cyber-purple text-white hover:bg-cyber-purple/90",
                            action.variant === 'outline' && "border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10",
                            action.variant === 'ghost' && "text-cyber-cyan hover:bg-cyber-cyan/10",
                            action.variant === 'danger' && "bg-cyber-pink text-white hover:bg-cyber-pink/90"
                          )}
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </motion.button>
                      ))}

                      {/* 复制按钮 */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopy}
                        className="p-2 rounded-md hover:bg-cyber-cyan/10 text-cyber-text-secondary hover:text-cyber-cyan transition-colors"
                        title="复制内容"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-cyber-green" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </motion.button>

                      {/* 关闭按钮 */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="p-2 rounded-md hover:bg-cyber-pink/10 text-cyber-text-secondary hover:text-cyber-pink transition-colors"
                        aria-label="关闭"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* 内容区域 */}
                <div
                  ref={contentRef}
                  className="px-6 py-4 overflow-auto max-h-[calc(100vh-200px)]"
                >
                  {content}
                </div>

                {/* 底部 */}
                {footer && (
                  <div className="px-6 py-4 border-t border-cyber-border">
                    {footer}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * QuickViewPreview Component - 内容预览组件
 * 显示内容的摘要，点击可快速查看完整内容
 */
export interface QuickViewPreviewProps {
  title: string;
  preview: string;
  content: React.ReactNode;
  maxLength?: number;
  className?: string;
}

export function QuickViewPreview({
  title,
  preview,
  content,
  maxLength = 200,
  className,
}: QuickViewPreviewProps) {
  const truncatedPreview =
    preview.length > maxLength ? preview.slice(0, maxLength) + '...' : preview;

  return (
    <QuickView
      trigger={
        <div
          className={cn(
            "p-4 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan transition-colors cursor-pointer",
            className
          )}
        >
          <h3 className="text-lg font-semibold text-cyber-text mb-2">{title}</h3>
          <p className="text-sm text-cyber-text-secondary">{truncatedPreview}</p>
          {preview.length > maxLength && (
            <div className="mt-2 flex items-center gap-1 text-sm text-cyber-cyan">
              <ExternalLink className="w-4 h-4" />
              <span>查看更多</span>
            </div>
          )}
        </div>
      }
      title={title}
      content={content}
      size="lg"
    />
  );
}

/**
 * QuickViewImage Component - 图片快速预览
 */
export interface QuickViewImageProps {
  src: string;
  alt?: string;
  title?: string;
  trigger?: React.ReactNode;
  className?: string;
}

export function QuickViewImage({
  src,
  alt,
  title,
  trigger,
  className,
}: QuickViewImageProps) {
  const defaultTrigger = (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-cyber-border hover:border-cyber-cyan transition-colors cursor-pointer group",
        className
      )}
    >
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
        <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );

  return (
    <QuickView
      trigger={trigger || defaultTrigger}
      title={title}
      content={
        <div className="flex items-center justify-center">
          <img src={src} alt={alt} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
        </div>
      }
      size="full"
      actions={[
        {
          label: '下载图片',
          icon: <Copy className="w-4 h-4" />,
          onClick: () => {
            const link = document.createElement('a');
            link.href = src;
            link.download = alt || 'image';
            link.click();
          },
          variant: 'primary',
        },
      ]}
    />
  );
}
