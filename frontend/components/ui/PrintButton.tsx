'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Check, Loader2 } from 'lucide-react';

export interface PrintButtonProps {
  /** 打印区域选择器 */
  target?: string;
  /** 打印完成后回调 */
  onAfterPrint?: () => void;
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 自定义类名 */
  className?: string;
  /** 是否显示打印预览 */
  showPreview?: boolean;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const PrintButton: React.FC<PrintButtonProps> = ({
  target,
  onAfterPrint,
  size = 'md',
  variant = 'primary',
  className = '',
  showPreview = false,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printed, setPrinted] = useState(false);

  const handlePrint = async () => {
    if (isPrinting) return;

    setIsPrinting(true);

    try {
      // 如果指定了目标元素，只打印该元素
      if (target) {
        const element = document.querySelector(target);
        if (!element) {
          console.error(`Element with selector "${target}" not found`);
          return;
        }

        // 创建打印样式
        const style = document.createElement('style');
        style.textContent = `
          @media print {
            body * {
              visibility: hidden;
            }
            ${target} {
              visibility: visible;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `;
        document.head.appendChild(style);

        // 打印
        window.print();

        // 清理样式
        setTimeout(() => {
          document.head.removeChild(style);
        }, 1000);
      } else {
        // 打印整个页面
        window.print();
      }

      setPrinted(true);
      setTimeout(() => setPrinted(false), 2000);
      onAfterPrint?.();
    } catch (error) {
      console.error('Print failed:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const variantStyles = {
    primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-purple hover:text-white',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-pink',
    ghost: 'bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePrint}
      disabled={isPrinting}
      className={`
        flex items-center gap-2 rounded-lg font-medium
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {isPrinting ? (
        <>
          <Loader2 size={iconSizes[size]} className="animate-spin" />
          <span>打印中...</span>
        </>
      ) : printed ? (
        <>
          <Check size={iconSizes[size]} />
          <span>已打印</span>
        </>
      ) : (
        <>
          <Printer size={iconSizes[size]} />
          <span>打印</span>
        </>
      )}
    </motion.button>
  );
};

/** 打印预览组件 */
export const PrintPreview: React.FC<{
  /** 预览内容 */
  children: React.ReactNode;
  /** 是否显示 */
  show?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
}> = ({ children, show = false, onClose }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white text-black rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">打印预览</h3>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

/** 可打印区域组件 - 标记可打印的区域 */
export const PrintableArea: React.FC<{
  /** 区域ID */
  id?: string;
  /** 子内容 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}> = ({ id, children, className = '' }) => {
  return (
    <div id={id} className={className} data-printable>
      {children}
    </div>
  );
};

export default PrintButton;
