'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterSubscribeProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

export function NewsletterSubscribe({
  className,
  variant = 'default'
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
      // 这里应该调用实际的 API
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus('success');
      setMessage('订阅成功！感谢您的关注');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('订阅失败，请稍后重试');
    }

    // 3秒后重置状态
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
  };

  if (variant === 'compact') {
    return (
      <div className={cn('cyber-card p-6', className)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-cyber-cyan" />
            <h3 className="font-display font-bold text-white">订阅更新</h3>
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className="flex-1 px-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-medium hover:bg-cyber-cyan/90 disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'text-sm flex items-center gap-1.5',
                status === 'success' ? 'text-green-400' : 'text-cyber-pink'
              )}
            >
              {status === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message}
            </motion.p>
          )}
        </form>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex items-center gap-3', className)}>
        <Mail className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="输入邮箱订阅更新"
          disabled={status === 'loading'}
          className="flex-1 px-4 py-2 bg-cyber-darker/50 border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan disabled:opacity-50 text-sm"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-medium hover:bg-cyber-cyan/90 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
        >
          {status === 'loading' ? '订阅中...' : status === 'success' ? '已订阅' : '订阅'}
        </button>
      </form>
    );
  }

  // 默认样式
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('cyber-card p-8 relative overflow-hidden', className)}
    >
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* 图标和标题 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-cyber-cyan/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-cyber-cyan" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">订阅周刊</h3>
            <p className="text-sm text-gray-400">获取最新文章和技术资讯</p>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-gray-400 mb-6">
          每周发送精选技术文章、开发教程和行业动态，无垃圾邮件，随时取消订阅。
        </p>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入您的邮箱地址"
              disabled={status === 'loading'}
              className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 disabled:opacity-50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-6 py-3 bg-cyber-cyan text-cyber-dark rounded-lg font-display font-bold hover:bg-cyber-cyan/90 disabled:opacity-50 transition-all hover:shadow-neon-cyan flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin" />
                <span>订阅中...</span>
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>订阅成功！</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>立即订阅</span>
              </>
            )}
          </button>

          {/* 状态消息 */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-3 rounded-lg flex items-center gap-2 text-sm',
                status === 'success'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/20'
              )}
            >
              {status === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{message}</span>
            </motion.div>
          )}
        </form>

        {/* 统计信息 */}
        <div className="mt-6 pt-6 border-t border-cyber-border">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-cyber-darker border-2 border-cyber-border flex items-center justify-center text-xs"
                  >
                    👤
                  </div>
                ))}
              </div>
              <span>已有 1,234 位订阅者</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>无垃圾邮件</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
