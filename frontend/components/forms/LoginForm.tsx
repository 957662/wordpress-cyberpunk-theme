/**
 * LoginForm - 登录表单组件
 * 赛博朋克风格的登录表单
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

import { loginSchema, type LoginInput } from '@/lib/schemas/validation';
import { CyberButton } from '../ui/CyberButton';
import { CyberInput } from '../ui/CyberInput';

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    try {
      // 这里替换为实际的 API 调用
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('登录成功！');
      // 登录成功后的处理，如跳转
    } catch (error) {
      toast.error('登录失败，请检查您的凭据。');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            邮箱
          </label>
          <CyberInput
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            autoComplete="email"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-2 text-gray-300">
            密码
          </label>
          <div className="relative">
            <CyberInput
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              {...register('remember')}
              type="checkbox"
              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-neon-cyan focus:ring-neon-cyan focus:ring-offset-gray-900"
            />
            <span className="text-sm text-gray-400">记住我</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-neon-cyan hover:text-cyber-purple transition-colors"
          >
            忘记密码？
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CyberButton
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                登录中...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                登录
              </>
            )}
          </CyberButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-400"
        >
          还没有账号？{' '}
          <Link
            href="/register"
            className="text-neon-cyan hover:text-cyber-purple transition-colors font-medium"
          >
            立即注册
          </Link>
        </motion.div>
      </form>
    </>
  );
}
