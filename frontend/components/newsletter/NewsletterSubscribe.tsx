/**
 * 邮件订阅组件
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MailIcon, CheckIcon, ErrorIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export interface NewsletterSubscribeProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'card';
  onSuccess?: (email: string) => void;
}

export function NewsletterSubscribe({
  title = '订阅我们的通讯',
  description = '获取最新文章和项目动态，不错过任何更新',
  className,
  variant = 'default',
  onSuccess,
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('请输入有效的邮箱地址');
      return;
    }

    setStatus('loading');

    // 模拟 API 调用
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 这里应该调用实际的订阅 API
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      setStatus('success');
      setMessage('订阅成功！感谢您的关注');
      onSuccess?.(email);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('订阅失败，请稍后重试');
    }
  };

  const variants = {
    default: 'cyber-card p-8',
    minimal: 'p-4',
    card: 'bg-gradient-to-br from-cyber-cyan/10 via-cyber-purple/10 to-cyber-pink/10 border border-cyber-border p-8 rounded-2xl',
  };

  return (
    <div className={cn(variants[variant], className)}>
      {/* 头部 */}
      {(variant === 'default' || variant === 'card') && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cyber-cyan/10 rounded-lg">
              <MailIcon className="w-6 h-6 text-cyber-cyan" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">{title}</h3>
          </div>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      )}

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="flex-1"
            required
          />
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="whitespace-nowrap"
          >
            {status === 'loading' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : status === 'success' ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              '订阅'
            )}
          </Button>
        </div>

        {/* 状态消息 */}
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex items-center gap-2 text-sm',
              status === 'success' ? 'text-green-400' : 'text-red-400'
            )}
          >
            {status === 'success' ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <ErrorIcon className="w-4 h-4" />
            )}
            <span>{message}</span>
          </motion.div>
        )}

        {/* 隐私说明 */}
        <p className="text-xs text-gray-500">
          订阅即表示您同意我们的隐私政策。您可以随时取消订阅。
        </p>
      </form>
    </div>
  );
}

// 侧边栏订阅组件
export function SidebarNewsletter() {
  return (
    <div className="cyber-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <MailIcon className="w-5 h-5 text-cyber-cyan" />
        <h4 className="font-display font-bold text-white">订阅更新</h4>
      </div>
      <NewsletterSubscribe
        variant="minimal"
        title=""
        description="获取最新文章推送"
      />
    </div>
  );
}

// Footer 订阅组件
export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');
    setEmail('');
  };

  return (
    <div className="max-w-md">
      <h4 className="font-display font-bold text-white mb-3">订阅我们</h4>
      <p className="text-gray-400 text-sm mb-4">
        获取最新文章和项目动态
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 px-4 py-2 bg-cyber-muted border border-cyber-border rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-colors text-sm"
          required
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-6 py-2 bg-cyber-cyan text-cyber-dark font-medium rounded hover:bg-cyber-cyan/90 transition-colors disabled:opacity-50 text-sm"
        >
          {status === 'success' ? <CheckIcon className="w-5 h-5" /> : '订阅'}
        </motion.button>
      </form>
    </div>
  );
}

// 模态框订阅组件
export function ModalNewsletter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (status === 'success') {
      setTimeout(() => onClose(), 2000);
    }
    setStatus('success');
    setEmail('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="cyber-card p-8 max-w-md w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-cyber-cyan/10 rounded-full mb-4">
            <MailIcon className="w-8 h-8 text-cyber-cyan" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-2">
            不要错过精彩内容
          </h3>
          <p className="text-gray-400">
            订阅我们的通讯，获取最新文章和独家内容
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="输入您的邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            required
          />
          <Button
            type="submit"
            className="w-full"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? '订阅中...' : status === 'success' ? '已订阅' : '立即订阅'}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          我们尊重您的隐私，绝不发送垃圾邮件
        </p>
      </motion.div>
    </motion.div>
  );
}
