'use client';

/**
 * 联系表单组件
 * 支持验证的联系表单
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { Input } from './Input';
import { cn } from '@/lib/utils';

// 表单验证 Schema
const contactSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  subject: z.string().min(3, '主题至少需要3个字符'),
  message: z.string().min(10, '消息内容至少需要10个字符'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  className?: string;
}

export function ContactForm({ onSubmit, className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(data);
      setIsSuccess(true);
      reset();

      // 3秒后重置成功状态
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn(
        'space-y-6 p-6 rounded-lg border border-cyber-cyan/30 bg-cyber-dark/50 backdrop-blur-sm',
        className
      )}
    >
      {/* 成功提示 */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-4 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green"
        >
          <CheckCircle className="w-5 h-5" />
          <span>消息发送成功！我会尽快回复您。</span>
        </motion.div>
      )}

      {/* 姓名字段 */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          姓名 <span className="text-cyber-pink">*</span>
        </label>
        <Input
          id="name"
          placeholder="请输入您的姓名"
          error={errors.name?.message}
          {...register('name')}
        />
      </div>

      {/* 邮箱字段 */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          邮箱 <span className="text-cyber-pink">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* 主题字段 */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          主题 <span className="text-cyber-pink">*</span>
        </label>
        <Input
          id="subject"
          placeholder="消息主题"
          error={errors.subject?.message}
          {...register('subject')}
        />
      </div>

      {/* 消息字段 */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          消息 <span className="text-cyber-pink">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="请输入您的消息内容..."
          className={cn(
            'w-full px-4 py-3 rounded-lg border transition-all',
            'bg-cyber-dark/50',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
            errors.message
              ? 'border-cyber-pink focus:border-cyber-pink'
              : 'border-cyber-cyan/30 focus:border-cyber-cyan',
            'text-gray-200 placeholder:text-gray-600'
          )}
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-cyber-pink">{errors.message.message}</p>
        )}
      </div>

      {/* 提交按钮 */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-6 py-3',
          'rounded-lg font-semibold text-white',
          'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
          'hover:shadow-lg hover:shadow-cyber-cyan/20',
          'transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            发送中...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            发送消息
          </>
        )}
      </motion.button>
    </motion.form>
  );
}

// 简单的订阅表单
interface NewsletterFormProps {
  onSubmit?: (email: string) => Promise<void>;
  className?: string;
}

export function NewsletterForm({ onSubmit, className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 简单的邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(email);
      setIsSuccess(true);
      setEmail('');

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError('订阅失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
      <h4 className="text-lg font-semibold text-cyber-cyan">订阅更新</h4>
      <p className="text-sm text-gray-400">
        获取最新的文章和项目更新，直接发送到您的邮箱。
      </p>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={isSubmitting || isSuccess}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg border transition-all',
            'bg-cyber-dark/50 text-gray-200',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
            error ? 'border-cyber-pink' : 'border-cyber-cyan/30 focus:border-cyber-cyan'
          )}
        />
        <motion.button
          type="submit"
          disabled={isSubmitting || isSuccess || !email}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'px-6 py-2 rounded-lg font-semibold text-white',
            'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
            'hover:shadow-lg hover:shadow-cyber-cyan/20',
            'transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            '订阅'
          )}
        </motion.button>
      </div>

      {error && (
        <p className="text-sm text-cyber-pink">{error}</p>
      )}
      {isSuccess && (
        <p className="text-sm text-cyber-green">订阅成功！请查收确认邮件。</p>
      )}
    </form>
  );
}

export default ContactForm;
