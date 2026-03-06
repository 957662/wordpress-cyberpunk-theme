/**
 * 订阅表单组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export interface NewsletterFormProps {
  onSubmit?: (email: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  showSuccessMessage?: boolean;
  variant?: 'default' | 'compact' | 'card';
  className?: string;
}

export function NewsletterForm({
  onSubmit,
  placeholder = '输入您的邮箱',
  buttonText = '订阅',
  showSuccessMessage = true,
  variant = 'default',
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!email.trim()) {
        toast.error('请输入邮箱地址');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('请输入有效的邮箱地址');
        return;
      }

      await onSubmit?.(email);
      setIsSuccess(true);
      toast.success('订阅成功！感谢您的关注。');

      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
      }, 3000);
    } catch (error) {
      toast.error('订阅失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <div className="flex-1 relative">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={isSubmitting || isSuccess}
            className="bg-cyber-muted border-cyber-border"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting || isSuccess}
          isLoading={isSubmitting}
        >
          {isSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      </form>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-cyber-border bg-cyber-card p-6',
          className
        )}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyber-purple/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                订阅更新
              </h3>
              <p className="text-sm text-gray-400">
                获取最新文章和项目动态
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={isSubmitting || isSuccess}
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting || isSuccess}
              isLoading={isSubmitting}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  已订阅
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {buttonText}
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            我们尊重您的隐私，随时可以取消订阅
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-display font-bold text-white flex items-center gap-2">
        <Mail className="w-5 h-5 text-cyber-cyan" />
        订阅更新
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting || isSuccess}
          leftIcon={<Mail className="w-4 h-4" />}
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting || isSuccess}
          isLoading={isSubmitting}
        >
          {isSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              已订阅
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      </form>
      {showSuccessMessage && isSuccess && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-cyber-green flex items-center gap-1"
        >
          <Check className="w-4 h-4" />
          订阅成功！感谢您的关注。
        </motion.p>
      )}
    </div>
  );
}

export default NewsletterForm;
