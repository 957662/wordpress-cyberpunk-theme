/**
 * 邮件订阅 Widget
 * 允许用户订阅邮件列表
 */

'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailIcon, CheckIcon, AlertCircleIcon, LoaderIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { cn } from '@/lib/utils';

export interface NewsletterWidgetProps {
  /** 订阅接口地址 */
  subscribeEndpoint?: string;
  /** Widget 标题 */
  title?: string;
  /** 描述文字 */
  description?: string;
  /** 输入框占位符 */
  placeholder?: string;
  /** 按钮文字 */
  buttonText?: string;
  /** 成功消息 */
  successMessage?: string;
  /** 自定义类名 */
  className?: string;
  /** 订阅回调 */
  onSubscribe?: (email: string) => Promise<void>;
}

type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterWidget({
  subscribeEndpoint,
  title = '订阅更新',
  description = '获取最新的文章和资讯',
  placeholder = 'your@email.com',
  buttonText = '订阅',
  successMessage = '订阅成功！请检查您的邮箱。',
  className,
  onSubscribe,
}: NewsletterWidgetProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('idle');
  const [message, setMessage] = useState('');

  // 验证邮箱格式
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 处理订阅
  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();

    // 验证邮箱
    if (!email || !isValidEmail(email)) {
      setStatus('error');
      setMessage('请输入有效的邮箱地址');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // 使用自定义回调或默认 API
      if (onSubscribe) {
        await onSubscribe(email);
      } else if (subscribeEndpoint) {
        const response = await fetch(subscribeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('订阅失败');
        }
      } else {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setStatus('success');
      setMessage(successMessage);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('订阅失败，请稍后重试');
      console.error('Newsletter subscription error:', error);
    }

    // 3秒后重置状态
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
  };

  return (
    <Widget title={title} className={className}>
      <div className="space-y-4">
        {/* 描述 */}
        {description && (
          <p className="text-sm text-gray-400">{description}</p>
        )}

        {/* 订阅表单 */}
        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={status === 'loading'}
              className={cn(
                'w-full pl-10 pr-4 py-3 rounded-lg',
                'bg-cyber-dark border border-cyber-border',
                'text-white placeholder-gray-600',
                'focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-300'
              )}
              aria-label="邮箱地址"
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === 'loading'}
            whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
            className={cn(
              'w-full py-3 px-4 rounded-lg',
              'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
              'text-white font-medium',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'shadow-neon-cyan hover:shadow-neon-purple',
              'transition-all duration-300',
              'relative overflow-hidden'
            )}
          >
            <AnimatePresence mode="wait">
              {status === 'loading' ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                  <span>订阅中...</span>
                </motion.div>
              ) : (
                <motion.span
                  key="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {buttonText}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        {/* 状态消息 */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'flex items-start gap-2 p-3 rounded-lg text-sm',
                status === 'success'
                  ? 'bg-cyber-green/10 border border-cyber-green/30 text-cyber-green'
                  : 'bg-red-500/10 border border-red-500/30 text-red-500'
              )}
            >
              {status === 'success' ? (
                <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span>{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 隐私说明 */}
        <p className="text-xs text-gray-600 text-center">
          我们尊重您的隐私，不会发送垃圾邮件。
        </p>
      </div>
    </Widget>
  );
}
