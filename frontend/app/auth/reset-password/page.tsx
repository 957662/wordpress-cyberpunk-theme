'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { CyberCard } from '@/components/ui/CyberCard';
import { Loader, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, '密码至少8个字符'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密码不匹配',
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError('无效的重置链接');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 调用密码重置 API
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '重置失败');
      }

      setIsSuccess(true);

      // 3秒后跳转到登录页
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 无效token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <CyberCard className="p-8 max-w-md">
          <Alert type="error" message="无效的重置链接，请重新申请密码重置" />
          <div className="mt-6 text-center">
            <Link
              href="/auth/forgot-password"
              className="text-cyber-cyan hover:text-cyber-purple"
            >
              重新申请
            </Link>
          </div>
        </CyberCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark relative overflow-hidden">
      {/* 背景动画 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-purple rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* 标题 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">设置新密码</h1>
          <p className="text-gray-400">
            {isSuccess
              ? '密码已成功重置'
              : '请输入您的新密码'}
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
              <h3 className="text-xl font-semibold text-white mb-2">重置成功</h3>
              <p className="text-gray-400">
                即将跳转到登录页面...
              </p>
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
                {/* 新密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    新密码
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pr-10 pl-10"
                      error={errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 确认密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    确认新密码
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pr-10 pl-10"
                      error={errors.confirmPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
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
                      重置中...
                    </span>
                  ) : (
                    '重置密码'
                  )}
                </Button>
              </form>
            </>
          )}
        </CyberCard>
      </motion.div>
    </div>
  );
}
