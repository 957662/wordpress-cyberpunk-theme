'use client';

import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import toast from 'react-hot-toast';

interface PrintButtonProps {
  /**
   * 按钮样式
   * @default 'default'
   */
  variant?: 'default' | 'minimal' | 'pill';

  /**
   * 按钮大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 自定义样式类名
   */
  className?: string;

  /**
   * 打印前回调
   */
  onBeforePrint?: () => void | Promise<void>;

  /**
   * 打印后回调
   */
  onAfterPrint?: () => void;
}

/**
 * 打印按钮组件
 *
 * 提供一键打印功能，支持打印前的准备工作。
 *
 * @example
 * ```tsx
 * <PrintButton />
 * <PrintButton variant="pill" size="large" />
 * ```
 */
export function PrintButton({
  variant = 'default',
  size = 'medium',
  className = '',
  onBeforePrint,
  onAfterPrint,
}: PrintButtonProps) {
  const handlePrint = async () => {
    try {
      // 执行打印前回调
      if (onBeforePrint) {
        await onBeforePrint();
      }

      // 触发打印
      window.print();

      // 执行打印后回调
      if (onAfterPrint) {
        onAfterPrint();
      }

      toast.success('正在打印...');
    } catch (error) {
      console.error('Print failed:', error);
      toast.error('打印失败，请重试');
    }
  };

  // 尺寸配置
  const sizeClasses = {
    small: 'p-2',
    medium: 'p-2.5',
    large: 'p-3',
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  // 变体样式
  const getVariantClasses = () => {
    const baseClasses = 'flex items-center gap-2 rounded-lg transition-all duration-200';

    if (variant === 'minimal') {
      return `${baseClasses} text-gray-400 hover:text-cyber-cyan`;
    }

    if (variant === 'pill') {
      return `${baseClasses} px-4 py-2 bg-cyber-dark/80 backdrop-blur-sm border border-gray-800 hover:border-cyber-cyan hover:shadow-lg hover:shadow-cyber-cyan/20`;
    }

    // default
    return `${baseClasses} ${sizeClasses[size]} bg-cyber-dark/80 backdrop-blur-sm border border-gray-800 hover:border-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-lg hover:shadow-cyber-cyan/20`;
  };

  return (
    <motion.button
      onClick={handlePrint}
      className={getVariantClasses() + ' ' + className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="打印页面"
    >
      <Printer className="text-cyber-cyan" size={iconSizes[size]} />
      <span className="text-sm font-medium">打印</span>
    </motion.button>
  );
}

/**
 * 打印预览组件
 */
interface PrintPreviewProps {
  /**
   * 是否显示打印预览
   */
  show: boolean;

  /**
   * 关闭预览回调
   */
  onClose: () => void;

  /**
   * 内容
   */
  children: React.ReactNode;
}

export function PrintPreview({ show, onClose, children }: PrintPreviewProps) {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-gray-900">打印预览</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭预览"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">{children}</div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              window.print();
              onClose();
            }}
            className="px-4 py-2 bg-cyber-cyan text-black font-medium rounded-lg hover:bg-cyber-cyan/80 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            打印
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * 文章打印工具栏
 */
interface ArticlePrintToolbarProps {
  /**
   * 文章标题
   */
  title: string;

  /**
   * 自定义样式类名
   */
  className?: string;

  /**
   * 是否显示打印按钮
   * @default true
   */
  showPrint?: boolean;

  /**
   * 是否显示字体调整
   * @default true
   */
  showFontSize?: boolean;

  /**
   * 是否显示日期
   * @default true
   */
  showDate?: boolean;
}

export function ArticlePrintToolbar({
  title,
  className = '',
  showPrint = true,
  showFontSize = true,
  showDate = true,
}: ArticlePrintToolbarProps) {
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`print:hidden ${className}`}>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyber-cyan/20">
        <div>
          <h1 className="text-2xl font-bold text-cyber-cyan mb-1">{title}</h1>
          {showDate && (
            <p className="text-sm text-gray-400">打印日期: {currentDate}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showFontSize && (
            <div className="hidden md:flex items-center gap-2 bg-cyber-dark/80 rounded-lg px-3 py-2 border border-cyber-cyan/20">
              <span className="text-sm text-gray-400">字号:</span>
              <button
                onClick={() => document.body.style.fontSize = '14px'}
                className="px-2 py-1 text-sm hover:bg-cyber-muted rounded transition-colors"
              >
                小
              </button>
              <button
                onClick={() => document.body.style.fontSize = '16px'}
                className="px-2 py-1 text-sm hover:bg-cyber-muted rounded transition-colors"
              >
                中
              </button>
              <button
                onClick={() => document.body.style.fontSize = '18px'}
                className="px-2 py-1 text-sm hover:bg-cyber-muted rounded transition-colors"
              >
                大
              </button>
            </div>
          )}

          {showPrint && <PrintButton />}
        </div>
      </div>

      {/* 打印时显示的页眉 */}
      <div className="print-header hidden print:block">
        <div className="site-name">CyberPress Platform</div>
        <div className="url">{typeof window !== 'undefined' && window.location.href}</div>
      </div>
    </div>
  );
}
