/**
 * CyberPress Platform - NewsletterCard Component
 * 订阅卡片组件 - 赛博朋克风格
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';

export interface NewsletterCardProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => Promise<void>;
  showSuccessMessage?: boolean;
  successMessage?: string;
  variant?: 'default' | 'neon' | 'hologram';
  className?: string;
}

export function NewsletterCard({
  title = '订阅我们的通讯',
  description = '获取最新的文章、教程和赛博朋克设计资源',
  placeholder = 'your@email.com',
  buttonText = '订阅',
  onSubmit,
  showSuccessMessage = true,
  successMessage = '订阅成功！感谢您的支持。',
  variant = 'default',
  className,
}: NewsletterCardProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit?.(email);
      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setError('订阅失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return 'border-2 border-cyber-cyan shadow-neon-cyan';
      case 'hologram':
        return 'bg-gradient-to-br from-cyber-card to-cyber-muted backdrop-blur-md border border-cyber-cyan/30';
      default:
        return 'border border-cyber-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'relative bg-cyber-card rounded-lg p-6 overflow-hidden',
        getVariantStyles(),
        className
      )}
    >
      {/* 装饰元素 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyber-purple/5 rounded-full blur-3xl" />

      {/* 扫描线效果 */}
      {variant === 'hologram' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent pointer-events-none"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="relative">
        {/* 图标 */}
        <motion.div
          className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Mail className="w-6 h-6 text-cyber-dark" />
        </motion.div>

        {/* 成功状态 */}
        {isSuccess && showSuccessMessage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-green/20 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Sparkles className="w-8 h-8 text-cyber-green" />
            </motion.div>
            <h3 className="text-xl font-bold text-cyber-green mb-2">{successMessage}</h3>
            <p className="text-sm text-cyber-muted">我们会定期向您发送精选内容</p>
          </motion.div>
        ) : (
          <>
            {/* 标题和描述 */}
            <h3 className="text-xl font-bold text-cyber-cyan mb-2">{title}</h3>
            <p className="text-sm text-cyber-muted mb-6">{description}</p>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  disabled={isSubmitting}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border-2 bg-cyber-darker',
                    'text-gray-300 placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-200',
                    error ? 'border-cyber-pink' : 'border-cyber-border focus:border-cyber-cyan'
                  )}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-0 text-xs text-cyber-pink"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || !email}
                whileHover={{ scale: isSubmitting || !email ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || !email ? 1 : 0.98 }}
                className={cn(
                  'w-full px-6 py-3 rounded-lg font-semibold',
                  'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
                  'text-cyber-dark',
                  'shadow-neon-cyan hover:shadow-neon-cyan-lg',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200'
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyber-dark" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    订阅中...
                  </span>
                ) : (
                  buttonText
                )}
              </motion.button>
            </form>

            {/* 隐私说明 */}
            <p className="text-xs text-cyber-muted mt-4 text-center">
              我们尊重您的隐私，随时可以取消订阅
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
