'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, X, Loader2 } from 'lucide-react';

interface NewsletterSubscriptionProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
  showSuccess?: boolean;
  onSubscribe?: (email: string) => Promise<boolean>;
}

interface SubscriptionState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  className = '',
  variant = 'default',
  showSuccess = true,
  onSubscribe,
}) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubscriptionState>({
    status: 'idle',
    message: '',
  });
  const [isVisible, setIsVisible] = useState(true);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setState({
        status: 'error',
        message: '请输入邮箱地址',
      });
      return;
    }

    if (!validateEmail(email)) {
      setState({
        status: 'error',
        message: '请输入有效的邮箱地址',
      });
      return;
    }

    setState({ status: 'loading', message: '' });

    try {
      // 如果提供了自定义订阅函数，使用它；否则模拟 API 调用
      const success = onSubscribe
        ? await onSubscribe(email)
        : await simulateSubscription(email);

      if (success) {
        setState({
          status: 'success',
          message: '订阅成功！感谢您的支持 🎉',
        });
        setEmail('');

        // 自动关闭成功消息
        if (showSuccess) {
          setTimeout(() => {
            setState({ status: 'idle', message: '' });
          }, 5000);
        }
      } else {
        setState({
          status: 'error',
          message: '订阅失败，请稍后重试',
        });
      }
    } catch (error) {
      setState({
        status: 'error',
        message: '网络错误，请检查连接后重试',
      });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // 模拟订阅 API 调用
  const simulateSubscription = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // 在实际应用中，这里会调用真实的 API
    console.log('Subscribing email:', email);
    return true;
  };

  if (!isVisible) return null;

  const variants = {
    default: 'cyber-card p-8 max-w-md',
    compact: 'cyber-card p-4 max-w-sm',
    inline: 'flex items-center gap-4 p-4 bg-cyber-dark/50 rounded-lg',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`${variants[variant]} ${className}`}
      >
        {variant !== 'inline' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-cyber-gray hover:text-cyber-cyan transition-colors"
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        )}

        <div className="space-y-4">
          {/* 头部 */}
          {variant !== 'inline' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 rounded-full mb-4">
                <Mail className="w-8 h-8 text-cyber-cyan" />
              </div>
              <h3 className="text-2xl font-bold text-cyber-white mb-2">
                订阅我们的通讯
              </h3>
              <p className="text-cyber-gray text-sm">
                获取最新文章、技术分享和独家内容
              </p>
            </div>
          )}

          {/* 状态消息 */}
          <AnimatePresence mode="wait">
            {(state.status === 'success' || state.status === 'error') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  state.status === 'success'
                    ? 'bg-cyber-green/10 border border-cyber-green/30 text-cyber-green'
                    : 'bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink'
                }`}
              >
                {state.status === 'success' ? (
                  <Check className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{state.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 表单 */}
          {state.status !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    email
                      ? 'text-cyber-cyan'
                      : 'text-cyber-gray'
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱"
                  disabled={state.status === 'loading'}
                  className={`w-full pl-12 pr-4 py-3 bg-cyber-dark/50 border ${
                    state.status === 'error'
                      ? 'border-cyber-pink'
                      : 'border-cyber-cyan/30'
                  } rounded-lg text-cyber-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan transition-all disabled:opacity-50`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={state.status === 'loading'}
                whileHover={{ scale: state.status === 'loading' ? 1 : 1.02 }}
                whileTap={{ scale: state.status === 'loading' ? 1 : 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-white font-semibold rounded-lg cyber-glow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {state.status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>订阅中...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>立即订阅</span>
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* 隐私说明 */}
          {variant !== 'inline' && (
            <p className="text-xs text-cyber-gray text-center">
              订阅即表示您同意我们的{' '}
              <a href="/privacy" className="text-cyber-cyan hover:underline">
                隐私政策
              </a>
              。您可以随时取消订阅。
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewsletterSubscription;
