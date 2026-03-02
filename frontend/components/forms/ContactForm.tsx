/**
 * ContactForm - 联系表单组件
 * 赛博朋克风格的联系表单
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { contactFormSchema, type ContactFormInput } from '@/lib/schemas/validation';
import { CyberButton } from '../ui/CyberButton';
import { CyberInput } from '../ui/CyberInput';
import { CyberTextarea } from '../ui/CyberTextarea';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    try {
      // 这里替换为实际的 API 调用
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('消息发送成功！我们会尽快回复您。');
      setIsSuccess(true);
      reset();

      // 3秒后重置成功状态
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast.error('发送失败，请稍后重试。');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">消息已发送！</h3>
        <p className="text-gray-400">感谢您的联系，我们会尽快回复您。</p>
      </motion.div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-300">
            姓名
          </label>
          <CyberInput
            {...register('name')}
            placeholder="您的姓名"
            error={errors.name?.message}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-300">
            邮箱
          </label>
          <CyberInput
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-300">
            主题
          </label>
          <CyberInput
            {...register('subject')}
            placeholder="消息主题"
            error={errors.subject?.message}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-300">
            消息
          </label>
          <CyberTextarea
            {...register('message')}
            placeholder="请输入您的消息..."
            rows={6}
            error={errors.message?.message}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CyberButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                发送中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                发送消息
              </>
            )}
          </CyberButton>
        </motion.div>
      </form>
    </>
  );
}
