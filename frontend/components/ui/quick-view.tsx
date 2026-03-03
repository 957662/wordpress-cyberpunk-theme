/**
 * QuickView Component
 * 快速预览组件 - 提供内容的快速预览功能
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye } from 'lucide-react';

interface QuickViewProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  width?: number | string;
  height?: number | string;
  position?: 'right' | 'left' | 'center';
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const QuickView: React.FC<QuickViewProps> = ({
  trigger,
  content,
  title,
  width = 600,
  height = 'auto',
  position = 'right',
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnOutsideClick]);

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'right-full mr-4';
      case 'center':
        return 'left-1/2 -translate-x-1/2 top-full mt-4';
      default:
        return 'left-full ml-4';
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 ${getPositionClasses()}`}
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div className="bg-cyber-dark border border-cyber-cyan/30 rounded-lg shadow-lg shadow-cyber-cyan/20 overflow-hidden">
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-cyan/20 bg-cyber-muted/50">
                  {title && (
                    <h3 className="text-lg font-semibold text-cyber-cyan">{title}</h3>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-cyber-cyan transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4" style={{ height }}>
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface QuickViewCardProps {
  title: string;
  description: string;
  image?: string;
  meta?: {
    date?: string;
    author?: string;
    category?: string;
  };
  onQuickView?: () => void;
  onViewFull?: () => void;
  className?: string;
}

export const QuickViewCard: React.FC<QuickViewCardProps> = ({
  title,
  description,
  image,
  meta,
  onQuickView,
  onViewFull,
  className = '',
}) => {
  return (
    <div
      className={`bg-cyber-dark border border-cyber-cyan/20 rounded-lg p-4 hover:border-cyber-cyan/50 transition-all ${className}`}
    >
      {image && (
        <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-cyber-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

      {meta && (
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {meta.date && <span>{meta.date}</span>}
          {meta.author && <span>• {meta.author}</span>}
          {meta.category && (
            <span className="text-cyber-cyan">• {meta.category}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <QuickView
          trigger={
            <button
              onClick={onQuickView}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg text-cyber-cyan hover:bg-cyber-cyan/20 transition-all text-sm"
            >
              <Eye size={16} />
              Quick View
            </button>
          }
          content={
            <div>
              <h4 className="text-xl font-bold text-white mb-4">{title}</h4>
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-300 mb-4">{description}</p>
              {meta && (
                <div className="text-xs text-gray-500">
                  {meta.date && <div>Published: {meta.date}</div>}
                  {meta.author && <div>By: {meta.author}</div>}
                  {meta.category && <div>Category: {meta.category}</div>}
                </div>
              )}
            </div>
          }
          title="Quick Preview"
        />

        {onViewFull && (
          <button
            onClick={onViewFull}
            className="px-4 py-2 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-cyber-purple hover:bg-cyber-purple/20 transition-all text-sm"
          >
            View Full
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickView;
