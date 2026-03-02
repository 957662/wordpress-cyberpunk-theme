'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { CyberCard } from '@/components/ui/CyberCard';
import { Loader, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      setError(null);

      // 调用密码重置 API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '发送失败');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark relative overflow-hidden">
      {/* 背景动画 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* 返回链接 */}
        <Link
          href="/auth/login"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回登录
        </Link>

        {/* 标题 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">忘记密码？</h1>
          <p className="text-gray-400">
            {isSuccess
              ? '密码重置链接已发送到您的邮箱'
              : '输入您的邮箱地址，我们将发送密码重置链接'}
          </p>
        </motion.div>

        <CyberCard className="p-8">
          {/* 成功提示 */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">邮件已发送</h3>
              <p className="text-gray-400 mb-6">
                请检查您的邮箱并点击重置链接。如果没有收到，请检查垃圾邮件文件夹。
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white"
              >
                重新发送
              </Button>
            </motion.div>
          ) : (
            <>
              {/* 错误提示 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert type="error" message={error} />
                </motion.div>
              )}

              {/* 表单 */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    邮箱地址
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      error={errors.email?.message}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-purple hover:to-cyber-cyan text-white font-medium py-3 rounded-lg shadow-lg shadow-cyber-cyan/30"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      发送中...
                    </span>
                  ) : (
                    '发送重置链接'
                  )}
                </Button>
              </form>

              {/* 返回登录 */}
              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-cyber-cyan hover:text-cyber-purple transition-colors"
                >
                  想起密码了？返回登录
                </Link>
              </div>
            </>
          )}
        </CyberCard>
      </motion.div>
    </div>
  );
}
