'use client';

/**
 * NewsletterSection - 新闻订阅组件
 *
 * 功能特性：
 * - 邮箱输入
 * - 表单验证
 * - 订阅状态
 * - 成功提示
 * - 赛博朋克风格
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { CyberButton } from '@/components/ui';

interface NewsletterSectionProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
}

export function NewsletterSection({
  title = '订阅我们的新闻通讯',
  description = '每周精选文章、技术趋势和设计灵感，直接发送到您的收件箱',
  placeholder = 'your@email.com',
  buttonText = '订阅',
  successMessage = '订阅成功！感谢您的订阅。',
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 基本验证
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('请输入有效的邮箱地址');
      return;
    }

    setStatus('loading');

    try {
      // 这里应该调用实际的订阅 API
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus('success');
      setMessage(successMessage);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('订阅失败，请稍后重试');
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`cyber-card p-8 md:p-12 text-center border ${
            status === 'success'
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-cyber-cyan/30'
          }`}
        >
          {/* 图标 */}
          <div className="w-16 h-16 bg-cyber-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
            {status === 'loading' ? (
              <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <Mail className="w-8 h-8 text-cyber-cyan" />
            )}
          </div>

          {/* 标题 */}
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>

          {/* 描述 */}
          {status === 'idle' || status === 'error' ? (
            <>
              <p className="text-gray-400 mb-8">{description}</p>

              {/* 表单 */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  disabled={status === 'loading'}
                  className="flex-1 px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <CyberButton
                  type="submit"
                  variant="primary"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? '提交中...' : buttonText}
                </CyberButton>
              </form>

              {/* 错误消息 */}
              {status === 'error' && message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-red-500"
                >
                  {message}
                </motion.p>
              )}
            </>
          ) : (
            /* 成功消息 */
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-lg text-green-500 mb-8"
            >
              {message}
            </motion.p>
          )}

          {/* 隐私声明 */}
          {status === 'idle' && (
            <p className="mt-4 text-xs text-gray-600">
              我们尊重您的隐私，不会发送垃圾邮件。您可以随时取消订阅。
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * NewsletterInline - 内联版本（用于页脚等）
 */
interface NewsletterInlineProps {
  onSubmit?: (email: string) => Promise<void>;
}

export function NewsletterInline({ onSubmit }: NewsletterInlineProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setStatus('loading');

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="输入邮箱"
        disabled={status === 'loading'}
        className="flex-1 px-3 py-2 bg-cyber-dark border border-cyber-border rounded text-sm text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none"
        required
      />
      <CyberButton
        type="submit"
        variant="primary"
        size="sm"
        disabled={status === 'loading'}
      >
        {status === 'success' ? '✓' : '订阅'}
      </CyberButton>
    </form>
  );
}

export default NewsletterSection;
