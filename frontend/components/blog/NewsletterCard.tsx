'use client';

/**
 * NewsletterCard Component
 * 邮件订阅卡片组件
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, Sparkles } from 'lucide-react';
import { CyberButton } from '@/components/ui';

interface NewsletterCardProps {
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 输入框占位符 */
  placeholder?: string;
  /** 按钮文字 */
  buttonText?: string;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 变体 */
  variant?: 'default' | 'neon' | 'compact';
  /** 成功消息 */
  successMessage?: string;
  /** 自定义样式类名 */
  className?: string;
}

export function NewsletterCard({
  title = '订阅我们的新闻通讯',
  description = '每周精选文章、技术趋势和设计灵感，直接发送到您的收件箱',
  placeholder = 'your@email.com',
  buttonText = '立即订阅',
  showIcon = true,
  variant = 'default',
  successMessage = '订阅成功！感谢您的支持 🎉',
  className = '',
}: NewsletterCardProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证邮箱
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // TODO: 调用实际的订阅API
      // await subscribeToNewsletter(email);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setError('订阅失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`cyber-card p-4 border border-cyber-border/50 ${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={isSubmitting || isSuccess}
            className={`
              flex-1 px-4 py-2 bg-cyber-dark
              border border-cyber-border rounded-lg
              text-white placeholder-gray-500 text-sm
              focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20
              disabled:opacity-50
            `}
          />
          <CyberButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? '订阅中...' : isSuccess ? '已订阅' : buttonText}
          </CyberButton>
        </form>
        {error && (
          <p className="text-xs text-cyber-pink mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        cyber-card p-6 md:p-8 border border-cyber-border/50
        ${variant === 'neon' ? 'border-cyber-cyan/30 shadow-lg shadow-cyber-cyan/10' : ''}
        ${className}
      `}
    >
      {/* 成功状态 */}
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-cyber-green" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">订阅成功！</h3>
          <p className="text-gray-400">{successMessage}</p>
        </motion.div>
      ) : (
        <>
          {/* 标题部分 */}
          <div className="text-center mb-6">
            {showIcon && (
              <div className="w-16 h-16 bg-cyber-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {variant === 'neon' ? (
                  <Sparkles className="w-8 h-8 text-cyber-cyan" />
                ) : (
                  <Mail className="w-8 h-8 text-cyber-cyan" />
                )}
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                disabled={isSubmitting}
                className={`
                  flex-1 px-4 py-3 bg-cyber-dark
                  border border-cyber-border rounded-lg
                  text-white placeholder-gray-500
                  focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20
                  disabled:opacity-50
                  ${variant === 'neon' ? 'focus:shadow-lg focus:shadow-cyber-cyan/20' : ''}
                `}
              />
              <CyberButton
                type="submit"
                variant={variant === 'neon' ? 'neon' : 'primary'}
                disabled={isSubmitting}
                className="whitespace-nowrap"
              >
                {isSubmitting ? '订阅中...' : buttonText}
              </CyberButton>
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-cyber-pink text-center mt-3"
              >
                {error}
              </motion.p>
            )}

            {/* 隐私说明 */}
            <p className="text-xs text-gray-500 text-center mt-4">
              我们尊重您的隐私，随时可以取消订阅
            </p>
          </form>
        </>
      )}
    </motion.div>
  );
}

/**
 * NewsletterPopup Component
    * 弹出式订阅卡片
     */
interface NewsletterPopupProps extends Omit<NewsletterCardProps, 'className'> {
  /** 是否显示 */
  show: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 延迟显示（毫秒） */
  delay?: number;
}

export function NewsletterPopup({
  show,
  onClose,
  delay = 3000,
  ...props
}: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    if (show && delay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    setIsVisible(show);
  }, [show, delay]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* 背景遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* 弹出内容 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md relative"
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 bg-cyber-pink rounded-full flex items-center justify-center text-white hover:bg-cyber-pink/80 transition-colors z-10"
          >
            ✕
          </button>

          <NewsletterCard {...props} />
        </motion.div>
      </div>
    </>
  );
}

/**
 * NewsletterBanner Component
 * 横幅式订阅组件
 */
interface NewsletterBannerProps extends Omit<NewsletterCardProps, 'title' | 'description' | 'className'> {
  /** 横幅文字 */
  message?: string;
  /** 位置 */
  position?: 'top' | 'bottom';
}

export function NewsletterBanner({
  message = '📬 订阅我们的新闻通讯，获取最新文章和技术趋势',
  placeholder = 'your@email.com',
  buttonText = '订阅',
  position = 'bottom',
  ...props
}: NewsletterBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className={`
      fixed left-0 right-0 z-40 border-t border-cyber-border
      ${position === 'top' ? 'top-0' : 'bottom-0'}
    `}>
      <div className="cyber-card">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Mail className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
              <p className="text-sm text-gray-300">{message}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder={placeholder}
                className="px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 text-sm focus:border-cyber-cyan focus:outline-none"
              />
              <CyberButton variant="primary" size="sm">
                {buttonText}
              </CyberButton>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-gray-500 hover:text-gray-300 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
